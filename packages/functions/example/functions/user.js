const { https } = require('./src/index.js');

// 添加
const addRouter = () => {
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
};

// 添加
const deleteRouter = () => {
  return {
    statusCode: 200,
    body: {
      code: 200,
      data: request,
      message: '这是一条成功的消息',
    },
  };
};

exports.handler = https.onRequest({
  'GET /user': addRouter,
  'POST /user{id}': deleteRouter,
});
