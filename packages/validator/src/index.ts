import createError from 'http-errors';
import Ajv from 'ajv/dist/2019.js';
import localize from 'ajv-i18n';
import formats from 'ajv-formats';
import formatsDraft2019 from 'ajv-formats-draft2019';

let ajv;
const ajvDefaults = {
  strict: true,
  coerceTypes: 'array', // important for query string params
  allErrors: true,
  useDefaults: 'empty',
  messages: false, // allow i18n
};

const defaults = {
  inputSchema: null,
  outputSchema: null,
  ajvOptions: {},
  ajvInstance: undefined,
  defaultLanguage: 'en',
};

const validatorMiddleware = (opts = {}) => {
  let { inputSchema, outputSchema, ajvOptions, ajvInstance, defaultLanguage } = {
    ...defaults,
    ...opts,
  };
  inputSchema = compile(inputSchema, ajvOptions, ajvInstance);
  outputSchema = compile(outputSchema, ajvOptions, ajvInstance);

  const validatorMiddlewareBefore = async (request) => {
    const valid = inputSchema(request.event);
    if (!valid) {
      const error = new createError.BadRequest('Event object failed validation');
      request.event.headers = { ...request.event.headers };

      const language = chooseLanguage(request.event, defaultLanguage);
      localize[language](inputSchema.errors);

      error.details = inputSchema.errors;
      throw error;
    }
  };

  const validatorMiddlewareAfter = async (request) => {
    const valid = outputSchema(request.response);

    if (!valid) {
      const error = new createError.InternalServerError('Response object failed validation');
      error.details = outputSchema.errors;
      error.response = request.response;
      throw error;
    }
  };
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

export default validatorMiddleware;
