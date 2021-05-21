const { jsonSafeParse } = require('@serverless-devs/noah-util');
const cbor = require('cbor');

const otsBodyParserMiddleware = () => {
  const otsBodyParserMiddlewareBefore = async (request) => {
    await new Promise((resolve, reject) => {
      try {
        cbor.decodeFirst(request.event, (error, obj) => {
          request.event = obj || jsonSafeParse(request.event.toString()); // 兼容 FC 手动触发
          console.log(1, obj, request.event)
          resolve(request)
        });
      } catch (e) {
        console.log(2)
        reject(e)
      }
    });
  }

  return {
    before: otsBodyParserMiddlewareBefore,
  };
};

export = otsBodyParserMiddleware;

