interface IOptions {
  code?: number | string;
  message?: string
}
const httpErrorHandlerMiddleware = (opts?: IOptions) => {
  const httpErrorHandlerMiddlewareOnError = async (request) => {
    // const errorBody = { code: 500, message: 'server error' };

    if (request.type === 'HTTP') {
      request.result = {
        statusCode: request.statusCode || typeof request.error?.code === 'number' ? request.error?.code : 500,
        body: opts || { code: request.error?.code || 500, message: request.error?.message || 'server error' },
      }
    }
  }

  return {
    onError: httpErrorHandlerMiddlewareOnError
  }
}

export = httpErrorHandlerMiddleware;
