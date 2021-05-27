import createError from 'http-errors';
import Ajv from 'ajv/dist/2019.js';
import localize from 'ajv-i18n';
import formats from 'ajv-formats';
import formatsDraft2019 from 'ajv-formats-draft2019';
const { jsonSafeParse } = require('@serverless-devs/dk-util');

let ajv;
const ajvDefaults = {
  strict: true,
  coerceTypes: 'array', // important for query string params
  allErrors: true,
  useDefaults: 'empty',
  messages: false, // allow i18n
};

const defaults = {
  eventSchema: null,
  bodySchema: null,
  urlSchema: null,
  outputSchema: null,
  ajvOptions: {},
  ajvInstance: undefined,
  defaultLanguage: 'en',
};

const validatorMiddleware = (opts = {}) => {
  let {
    eventSchema,
    bodySchema,
    urlSchema,
    outputSchema,
    ajvOptions,
    ajvInstance,
    defaultLanguage,
  } = {
    ...defaults,
    ...opts,
  };
  eventSchema = compile(eventSchema, ajvOptions, ajvInstance);
  bodySchema = compile(bodySchema, ajvOptions, ajvInstance);
  urlSchema = compile(urlSchema, ajvOptions, ajvInstance);
  outputSchema = compile(outputSchema, ajvOptions, ajvInstance);

  const validatorMiddlewareBefore = async (request) => {
    const event = jsonSafeParse(request.event.toString());
    if (event) {
      // 事件函数
      const valid = eventSchema(event);
      if (!valid) {
        const error = new createError.BadRequest('Event object failed validation');
        const language = chooseLanguage(event, defaultLanguage);
        localize[language](eventSchema.errors);
        error.details = eventSchema.errors;
        throw error;
      }
    } else {
      // http函数
      // body
      if (bodySchema) {
        const valid = bodySchema(request.req.body);
        if (!valid) {
          const error = new createError.BadRequest('Body object failed validation');
          const language = chooseLanguage(request.req.body, defaultLanguage);
          localize[language](bodySchema.errors);
          error.details = bodySchema.errors;
          throw error;
        }
      }
      // path和queries
      if (urlSchema) {
        const valid = urlSchema({ path: request.req.path, queries: request.req.queries });
        if (!valid) {
          const error = new createError.BadRequest('Url object failed validation');
          const language = chooseLanguage(request.req.queries, defaultLanguage);
          localize[language](urlSchema.errors);
          error.details = urlSchema.errors;
          throw error;
        }
      }
    }
  };

  const validatorMiddlewareAfter = async (request) => {
    const valid = outputSchema(request.result);
    if (!valid) {
      const error = new createError.InternalServerError('Response object failed validation');
      error.details = outputSchema.errors;
      error.response = request.result;
      throw error;
    }
  };

  const inputSchema = eventSchema || bodySchema || urlSchema;
  return {
    before: inputSchema ? validatorMiddlewareBefore : null,
    after: outputSchema ? validatorMiddlewareAfter : null,
  };
};

// This is pulled out due to it's performance cost (50-100ms on cold start)
// Precompile your schema during a build step is recommended.
const compile = (schema, ajvOptions, ajvInstance = null) => {
  // Check if already compiled
  if (typeof schema === 'function' || !schema) return schema;
  const options = { ...ajvDefaults, ...ajvOptions };
  if (!ajv) {
    ajv = ajvInstance ?? new Ajv(options);
    formats(ajv);
    formatsDraft2019(ajv);
  }
  return ajv.compile(schema);
};

/* in ajv-i18n Portuguese is represented as pt-BR */
const languageNormalizationMap = {
  pt: 'pt-BR',
  'pt-br': 'pt-BR',
  pt_BR: 'pt-BR',
  pt_br: 'pt-BR',
  zh: 'zh-TW',
  'zh-tw': 'zh-TW',
  zh_TW: 'zh-TW',
  zh_tw: 'zh-TW',
};

const normalizePreferredLanguage = (lang) => languageNormalizationMap[lang] ?? lang;

const availableLanguages = Object.keys(localize);
const chooseLanguage = ({ preferredLanguage }, defaultLanguage) => {
  if (preferredLanguage) {
    const lang = normalizePreferredLanguage(preferredLanguage);
    if (availableLanguages.includes(lang)) {
      return lang;
    }
  }

  return defaultLanguage;
};

export = validatorMiddleware;
