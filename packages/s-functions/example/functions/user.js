const { https } = require('./src/index.js');

exports.handler = https.onRequest((req, res, context) => {
  console.log(req, res, context);
  return {
    code: 200,
    message: 'success',
  };
});
