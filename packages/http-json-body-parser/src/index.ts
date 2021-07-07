/**
 * application/json: json parse
 */
const mimePattern = /^application\/(.+\+)?json(;.*)?$/;

const defaults = {
  reviver: undefined,
};

interface IOptions {
  reviver?: (key: string, value: any) => any;
}
const methods = ['put', 'post', 'patch']; // 理论上只有这些method才需要对body做转换
const httpJsonBodyParserMiddleware = (opts?: IOptions) => {
  const options = { ...defaults, ...(opts || {}) };
  const httpJsonBodyParserMiddlewareBefore = async (request) => {
    const { headers, isBase64Encoded, body, method = '' } = request.req ?? {};
    const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];
    if (mimePattern.test(contentTypeHeader) && methods.includes(method.toLowerCase())) {
      if (body && typeof body === 'object') return; // 已经是对象不处理
      try {
        // base64 buffer 需要先转为可识别的 utf-8 的 buffer，再转为 string
        const data = isBase64Encoded
          ? Buffer.from(body.toString(), 'base64').toString()
          : body.toString();
        request.req.body = JSON.parse(data, options.reviver);
      } catch (e) {
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

export = httpJsonBodyParserMiddleware;
