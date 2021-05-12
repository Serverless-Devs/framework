
var getRawBody = require('raw-body');

const mimePattern = /^application\/(.+\+)?json(;.*)?$/;

export interface Options {
  reviver?: (key: string, value: any) => any;
}

export default () => {
  const httpJsonBodyParserMiddlewareBefore = async (request) => {
    const { headers } = request.req;

    const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];

    if (mimePattern.test(contentTypeHeader)) {
      try {
        await new Promise(resolve => {
          getRawBody(request.req, (err, body) => {
            request.req.body = body.toString();
            resolve(request.req);
          });
        });
      } catch (err) {
        const createError = require('http-errors');
        throw new createError.UnprocessableEntity(
          'Content type defined as JSON but an invalid JSON was provided',
        );
      }
    }
  };

  return {
    before: httpJsonBodyParserMiddlewareBefore,
  };
};
