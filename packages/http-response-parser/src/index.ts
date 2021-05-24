import { IdkRequest } from '@serverless-devs/dk-core/lib/interface';

const httpResponseParserMiddleware = () => {
  const httpResponseParserMiddlewareAfter = async (request: IdkRequest) => {
    const { res, result } = request;
    if (!res) return;

    if ('html' in result) {
      res.setHeader('content-type', 'text/html; charset=utf8');
      const { html, ...rest } = request.result;
      request.result = { ...rest, body: html };
      return;
    }

    if ('css' in result) {
      res.setHeader('content-type', 'text/css; charset=utf8');
      const { css, ...rest } = request.result;
      request.result = { ...rest, body: css };
      return;
    }

    if ('text' in result) {
      res.setHeader('content-type', 'text/plain; charset=utf8');
      const { text, ...rest } = request.result;
      request.result = { ...rest, body: text };
      return;
    }

    if ('js' in result) {
      res.setHeader('content-type', 'text/javascript; charset=utf8');
      const { js, ...rest } = request.result;
      request.result = { ...rest, body: js };
      return;
    }

    if ('json' in result) {
      res.setHeader('content-type', 'application/json; charset=utf8');
      const { json, ...rest } = request.result;
      request.result = { ...rest, body: JSON.stringify(json) };
      return;
    }

    if ('xml' in result) {
      res.setHeader('content-type', 'application/xml; charset=utf8');
      const { xml, ...rest } = request.result;
      request.result = { ...rest, body: xml };
    }
  };
  return {
    after: httpResponseParserMiddlewareAfter,
  };
};

export = httpResponseParserMiddleware;
