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
  const {
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

  const useSchemaForAll = (schemaConfig) => {
    if(schemaConfig) return Object.prototype.hasOwnProperty.call(schemaConfig, 'type')
    return false
  }

  // TODO：请求 url post/list/ 能访问对应路由 post/list
  const getCorrespondingvalidSchema = (request, schemaConfig) => {
    const { method, path } = request.req
    let validSchema = null;
    for(const [key, schema] of Object.entries(schemaConfig)){
      if(key.toLowerCase().replace(/\s+/g,"") === method.toLowerCase() + path.toLowerCase()){
        try{
          validSchema = compile(schema, ajvOptions, ajvInstance)
        }catch(err){
          throw new createError.InternalServerError(
            `There may be a problem with the schema format, you can refer to the detailed error information: ${err}`,
          );
        }
      }
    }
    return validSchema
  }

  const validEventSchema = useSchemaForAll(eventSchema) ? compile(eventSchema, ajvOptions, ajvInstance) : null
  const validBodySchema = useSchemaForAll(bodySchema) ? compile(bodySchema, ajvOptions, ajvInstance) : null
  const validUrlSchema = useSchemaForAll(urlSchema) ? compile(urlSchema, ajvOptions, ajvInstance) : null
  const validOutputSchema = useSchemaForAll(outputSchema) ? compile(outputSchema, ajvOptions, ajvInstance) : null

  const validatorMiddlewareBefore = async (request) => {
    const event = Buffer.isBuffer(request.event)
      ? jsonSafeParse(request.event.toString())
      : request.event;
    if (event) {
      // 事件函数
      let validEventSchemaTemp = null
      if(!validEventSchema){
        validEventSchemaTemp = getCorrespondingvalidSchema(request, eventSchema)
      }
      // 没有找到匹配的就不校验
      if(!validEventSchema && !validEventSchemaTemp) return
      const validate = validEventSchema || validEventSchemaTemp
      const valid = validate(event);
      if (!valid) {
        const error = new createError.BadRequest('Event object failed validation');
        const language = chooseLanguage(event, defaultLanguage);
        localize[language](validate.errors);
        error.details = validate.errors;
        throw error;
      }
    } else {
      // http函数
      // body
      if (bodySchema) {
        let validBodySchemaTemp = null
        if(!validBodySchema){
            validBodySchemaTemp = getCorrespondingvalidSchema(request, bodySchema)
        }
        if(!validBodySchema && !validBodySchemaTemp) return
        const validate = validBodySchema || validBodySchemaTemp
        const valid = validate(request.req.body);
        if (!valid) {
          const error = new createError.BadRequest('Body object failed validation');
          const language = chooseLanguage(request.req.body, defaultLanguage);
          localize[language](validate.errors);
          error.details = validate.errors;
          throw error;
        }
      }
      // path和queries
      if (urlSchema) {
        let validUrlSchemaTemp = null
        if(!validUrlSchema){
          validUrlSchemaTemp = getCorrespondingvalidSchema(request, urlSchema)
        }
        if(!validUrlSchema && !validUrlSchemaTemp) return
        const validate = validUrlSchema || validUrlSchemaTemp
        const valid = validate({ path: request.req.path, queries: request.req.queries });
        if (!valid) {
          const error = new createError.BadRequest('Url object failed validation');
          const language = chooseLanguage(request.req.queries, defaultLanguage);
          localize[language](validate.errors);
          error.details = validate.errors;
          throw error;
        }
      }
    }
  };

  const validatorMiddlewareAfter = async (request) => {
    let validOutputSchemaTemp = null
    if(!validOutputSchema){
      validOutputSchemaTemp = getCorrespondingvalidSchema(request, outputSchema)
    }
    if(!validOutputSchema && !validOutputSchemaTemp) return
    const validate = validOutputSchema || validOutputSchemaTemp
    const valid = validate(request.result);
    if (!valid) {
      const error = new createError.InternalServerError('Response object failed validation');
      error.details = validate.errors;
      error.response = request.result;
      throw error;
    }
  };

  const usedInputSchema = eventSchema || bodySchema || urlSchema;
  const usedOutputSchema = outputSchema

  return {
    before: usedInputSchema ? validatorMiddlewareBefore : null,
    after: usedOutputSchema ? validatorMiddlewareAfter : null,
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
