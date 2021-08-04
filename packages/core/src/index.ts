import { IdkRequest } from './interface';
import {
  getBody,
  analizeRequestParams,
  analizeEvents,
  makeResult,
  httpRouteParserHandler,
} from './util';
import { HTTP, INITIALIZER } from './constant';

const internal = {};

const dk = (handler?: Function | Object, baseMiddlewares?: any[]) => {
  let baseHandler;
  if (Object.prototype.toString.call(handler) === '[object Object]') {
    // 传入类型是对象
    baseHandler = (config) => httpRouteParserHandler(config, handler);
  } else {
    baseHandler = handler || function () {};
  }

  const beforeMiddlewares = [];
  const afterMiddlewares = [];
  const onErrorMiddlewares = [];
  const initializerPlugins = [];

  const instance = function (first, second, thrid?: any) {
    const { type, callback, event, req, res, context } = analizeEvents(first, second, thrid);

    const request: IdkRequest = {
      req,
      res,
      event,
      context,
      callback,
      type,
      result: undefined,
      error: undefined,
      internal,
    };

    return runRequest(
      request,
      [...beforeMiddlewares],
      baseHandler,
      [...afterMiddlewares],
      [...onErrorMiddlewares],
    );
  };

  instance.use = (middlewares) => {
    if (Array.isArray(middlewares)) {
      for (const middleware of middlewares) {
        instance.applyMiddleware(middleware);
      }
      return instance;
    }
    return instance.applyMiddleware(middlewares);
  };

  instance.applyMiddleware = (middleware) => {
    const { before, after, initializer, onError } = middleware;

    if (!before && !after && !onError && !initializer) {
      throw new Error(
        'Middleware must be an object containing at least one key among "before", "after", "onError"',
      );
    }

    if (before) instance.before(before);
    if (after) instance.after(after);
    if (initializer) instance.initializer(initializer);
    if (onError) instance.onError(onError);
    return instance;
  };
  instance.initializerHandler = undefined;

  instance.initializer = (initializerPlugin) => {
    initializerPlugins.push(initializerPlugin);
    // @ts-ignore
    instance.initializerHandler = fcInitializer(initializerPlugins);
    return instance;
  };

  // Inline Middlewares
  instance.before = (beforeMiddleware) => {
    beforeMiddlewares.push(beforeMiddleware);
    return instance;
  };
  instance.after = (afterMiddleware) => {
    afterMiddlewares.unshift(afterMiddleware);
    return instance;
  };
  instance.onError = (onErrorMiddleware) => {
    onErrorMiddlewares.push(onErrorMiddleware);
    return instance;
  };

  instance.__middlewares = {
    before: beforeMiddlewares,
    after: afterMiddlewares,
    onError: onErrorMiddlewares,
    initializer: initializerPlugins,
  };
  baseMiddlewares && instance.use(baseMiddlewares);

  return instance;
};

const runRequest = async (
  request: IdkRequest,
  beforeMiddlewares,
  baseHandler,
  afterMiddlewares,
  onErrorMiddlewares,
) => {
  try {
    if (request.type === 'HTTP') {
      await getBody(request);
    }
    await runMiddlewares(request, beforeMiddlewares);
    // Check if before stack hasn't exit early
    if (request.result === undefined) {
      request.result = await baseHandler(analizeRequestParams(request));
      await runMiddlewares(request, afterMiddlewares);
    }
  } catch (e) {
    // Reset result changes made by after stack before error thrown
    request.result = undefined;
    request.error = e;
    try {
      await runMiddlewares(request, onErrorMiddlewares);
      // Catch if onError stack hasn't handled the error
      if (request.type === HTTP) {
        if (request.result === undefined || request.res === undefined) {
          request.result = {
            statusCode: typeof e.code === 'number' ? e.code : 500,
            body: { code: e.code, message: e.message },
          };
        }
      } else {
        request.callback(request.error);
      }
    } catch (e) {
      // Save error that wasn't handled
      e.originalError = request.error;
      request.error = e;
      if (request.type === HTTP) {
        throw request.error;
      } else {
        request.callback(request.error);
      }
    }
  } finally {
    // await plugin?.requestEnd?.();
  }
  makeResult(request);
  if (request.type === INITIALIZER) {
    Object.assign(internal, request.result);
  }
  return request.error ? undefined : request;
};

const runMiddlewares = async (request, middlewares) => {
  for (const nextMiddleware of middlewares) {
    const res = await nextMiddleware?.(request);
    // short circuit chaining and respond early
    if (res !== undefined) {
      request.result = res;
      return;
    }
  }
};

const fcInitializer = (initializerList) =>
  dk(async (context) => {
    const items = {};
    for (const item of initializerList) {
      Object.assign(items, await item(context));
    }
    return items;
  });

export = dk;
