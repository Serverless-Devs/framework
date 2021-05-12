import { IMidRequest } from '@serverless-devs/noah-core';

const httpResponseParserMiddleware = () => {
  const httpResponseParserMiddlewareAfter = async (request: IMidRequest) => {
    const { res, result } = request;
    if ('json' in result) {
      res.setHeader('content-type', 'application/json; charset=utf8');
      request.result = { ...request.result, body: JSON.stringify(result.json) };
      return;
    }
  };
  return {
    after: httpResponseParserMiddlewareAfter,
  };
};

module.exports = httpResponseParserMiddleware;
