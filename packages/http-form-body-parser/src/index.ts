
const { parse } = require('qs');

const mimePattern = /^application\/x-www-form-urlencoded(;.*)?$/

const httpFormBodyParserMiddleware = () => {
  const httpUrlencodeBodyParserMiddlewareBefore = async (request) => {
    const { headers, isBase64Encoded, body } = request.req;
    const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];
    if (mimePattern.test(contentTypeHeader)) {
      if (body && typeof body === 'object') return; // 已经是对象不处理
      try {
        // base64 需要先转为可识别的 utf-8 的 buffer，再转为 string
        const data = isBase64Encoded
          ? Buffer.from(body, 'base64').toString()
          : body
        request.req.body = parse(data)
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  return {
    before: httpUrlencodeBodyParserMiddlewareBefore,
  };
}

module.exports = httpFormBodyParserMiddleware;
