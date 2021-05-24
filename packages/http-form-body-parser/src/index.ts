const { parse } = require('qs');

const mimePattern = /^application\/x-www-form-urlencoded(;.*)?$/;

const methods = ['put', 'post', 'patch']; // 理论上只有这些method才需要对body做转换
const httpFormBodyParserMiddleware = () => {
  const httpUrlencodeBodyParserMiddlewareBefore = async (request) => {
    const { headers, isBase64Encoded, body, method = '' } = request.req ?? {};
    const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];
    if (mimePattern.test(contentTypeHeader) && methods.includes(method.toLowerCase())) {
      if (body && typeof body === 'object') return; // 已经是对象不处理
      try {
        // base64 需要先转为可识别的 utf-8 的 buffer，再转为 string
        const data = isBase64Encoded ? Buffer.from(body, 'base64').toString() : body;
        request.req.body = parse(data);
      } catch (e) {
        throw new Error(e);
      }
    }
  };

  return {
    before: httpUrlencodeBodyParserMiddlewareBefore,
  };
};

export = httpFormBodyParserMiddleware;
