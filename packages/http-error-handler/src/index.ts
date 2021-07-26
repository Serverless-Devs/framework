interface IOptions {
  code?: number | string;
  message?: string
}
const httpErrorHandlerMiddleware = (opts?: IOptions) => {
  const httpErrorHandlerMiddlewareOnError = async (request) => {
    const errorBody = {
      code: typeof request.error?.code === 'number' ? request.error?.code : 500,
      message: request.error?.message || 'server error'
    };

    if (request.type === 'HTTP') {
      request.result = {
        statusCode: request.statusCode || errorBody.code,
        body: opts || errorBody,
      }
    }
  }

  return {
    onError: httpErrorHandlerMiddlewareOnError
  }
}

export = httpErrorHandlerMiddleware;
