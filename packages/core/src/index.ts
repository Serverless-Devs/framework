import { IMidRequest as IMidRequestInner, IPlugin } from './interface';
import { analizeRequestParams, analizeEvents, makeResult } from './util';
import { HTTP, INITIALIZER } from './constant';

export type IMidRequest = IMidRequestInner;

const internal = {};

const noah = (baseHandler?: (...any) => any, plugin?: IPlugin) => {
  baseHandler = baseHandler || function () {};
  plugin?.beforePrefetch?.();
  const beforeMiddlewares = [];
  const afterMiddlewares = [];
  const onErrorMiddlewares = [];

  const instance = (first, second, thrid?: any) => {
    const { type, callback, event, req, res, context } = analizeEvents(first, second, thrid);

    plugin?.requestStart?.();
    const request: IMidRequest = {
      req,
      res,
      event,
      context,
      callback,
      type,
      result: undefined,
      error: undefined,
    };

    return runRequest(
      request,
      [...beforeMiddlewares],
      baseHandler,
      [...afterMiddlewares],
      [...onErrorMiddlewares],
      plugin,
    );
  };

  if (plugin && plugin.initializer) {
    instance.initializer = plugin.initializer;
  }

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
    const { before, after, onError } = middleware;

    if (!before && !after && !onError) {
      throw new Error(
        'Middleware must be an object containing at least one key among "before", "after", "onError"',
      );
    }

    if (before) instance.before(before);
    if (after) instance.after(after);
    if (onError) instance.onError(onError);

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
  };

  return instance;
};

const runRequest = async (
  request: IMidRequest,
  beforeMiddlewares,
  baseHandler,
  afterMiddlewares,
  onErrorMiddlewares,
  plugin,
) => {
  try {
    await runMiddlewares(request, beforeMiddlewares, plugin);
    // Check if before stack hasn't exit early
    if (request.result === undefined) {
      plugin?.beforeHandler?.();
      request.result = await baseHandler(analizeRequestParams(request));
      plugin?.afterHandler?.();
      await runMiddlewares(request, afterMiddlewares, plugin);
    }
  } catch (e) {
    // Reset result changes made by after stack before error thrown
    request.result = undefined;
    request.error = e;
    try {
      await runMiddlewares(request, onErrorMiddlewares, plugin);
      // Catch if onError stack hasn't handled the error
      if (request.type === HTTP) {
        if (request.result === undefined || request.res === undefined) {
          throw request.error;
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
    await plugin?.requestEnd?.();
  }
  makeResult(request);
  if (request.type === INITIALIZER) {
    Object.assign(internal, request.result);
  }
  return request.error ? undefined : request;
};

const runMiddlewares = async (request, middlewares, plugin) => {
  for (const nextMiddleware of middlewares) {
    plugin?.beforeMiddleware?.(nextMiddleware?.name);
    const res = await nextMiddleware?.(request);
    plugin?.afterMiddleware?.(nextMiddleware?.name);
    // short circuit chaining and respond early
    if (res !== undefined) {
      request.result = res;
      return;
    }
  }
};

module.exports = noah;
