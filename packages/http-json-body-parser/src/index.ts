/**
 * application/json: json parse
 */
var getRawBody = require('raw-body');

const mimePattern = /^application\/(.+\+)?json(;.*)?$/;

const defaults = {
  reviver: undefined,
};

export interface Options {
  reviver?: (key: string, value: any) => any;
}

const httpJsonBodyParserMiddleware = (opts?: Options) => {
  const options = { ...defaults, ...(opts || {}) };
  const httpJsonBodyParserMiddlewareBefore = async (request) => {
    try {
      await new Promise((resolve, reject) => {
        getRawBody(request.req, (err, body) => {
          // 这里拿到的 body 是 buffer
          const { headers, isBase64Encoded } = request.req;
          const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];
          if (mimePattern.test(contentTypeHeader)) {
            //
            try {
              // base64 buffer 需要先转为可识别的 utf-8 的 buffer，再转为 string
              const data = isBase64Encoded
                ? Buffer.from(body.toString(), 'base64').toString()
                : body.toString();
              request.req.body = JSON.parse(data, options.reviver);
              resolve(request.req);
            } catch (e) {
              const createError = require('http-errors');
              const error = new createError.UnprocessableEntity(
                'Content type defined as JSON but an invalid JSON was provided',
              );
              reject(error);
            }
          } else {
            request.req.body = body.toString();
            resolve(request.req);
          }
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    before: httpJsonBodyParserMiddlewareBefore,
  };
};

module.exports = httpJsonBodyParserMiddleware;
