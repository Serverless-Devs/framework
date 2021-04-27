const funtions = require('../../src/index.js');

module.exports = funtions.https.onRequest((req, res, context) => {
  return {
    code: 200,
    message: 'success',
  };
});
