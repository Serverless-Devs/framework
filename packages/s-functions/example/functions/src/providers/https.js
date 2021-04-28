const getRawBody = require('raw-body');
const getFormBody = require('body/form');

const formType = 'application/x-www-form-urlencoded';

exports.onRequest = (handler) => async (req, res, context) => {
  const params = {
    path: req.path,
    queries: req.queries,
    headers: req.headers,
    method: req.method,
    url: req.url,
    clientIP: req.clientIP,
  };

  const contentType = req.headers['content-type'] || '';

  if (contentType.includes(formType)) {
    await new Promise((resolve, reject) => {
      getFormBody(req, (err, formBody) => {
        if (err) reject(err);
        params.body = formBody;
        resolve(params.body);
      });
    });
  } else {
    await new Promise((resolve, reject) => {
      getRawBody(req, (err, body) => {
        if (err) reject(err);
        params.body = body.toString();
        resolve(params.body);
      });
    });
  }
  const result = handler(params, context);
  res.send(JSON.stringify(result));
};
