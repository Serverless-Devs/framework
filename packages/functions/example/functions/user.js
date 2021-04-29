const { https } = require('./src/index.js');

exports.handler = https.onRequest((request, context) => {
  console.log(context);
  return {
    statusCode: 200,
    headers: {
      name: 'xiaoming',
      age: '20',
    },
    deleteHeaders: ['name'],
    body: {
      code: 200,
      data: request,
      message: '这是一条成功的消息',
    },
  };
});
