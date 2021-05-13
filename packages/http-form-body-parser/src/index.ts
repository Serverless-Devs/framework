const { parse } = require('qs');

const getFormBody = require('body/form');

const mimePattern = /^application\/x-www-form-urlencoded(;.*)?$/;

const httpFormBodyParserMiddleware = () => {
  const httpUrlencodeBodyParserMiddlewareBefore = async (request) => {
    try {
      await new Promise((resolve, reject) => {
        getFormBody(request.req, (err, formBody) => {
          console.log('----formBody---', formBody);
          const { headers, isBase64Encoded } = request.req;
          const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];
          if (mimePattern.test(contentTypeHeader)) {
            //
            try {
              // base64 buffer 需要先转为可识别的 utf-8 的 buffer，再转为 string
              const data = isBase64Encoded ? Buffer.from(formBody, 'base64').toString() : formBody;
              request.req.body = parse(data);
              resolve(request.req);
            } catch (e) {
              reject(e);
            }
          } else {
            request.req.body = formBody;
            resolve(request.req);
          }
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    before: httpUrlencodeBodyParserMiddlewareBefore,
  };
};

export = httpFormBodyParserMiddleware;
