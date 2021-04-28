const { https } = require('./src/index.js');

exports.handler = https.onRequest((params, context) => {
  console.log(context);
  return {
    code: 200,
    params,
  };
});
