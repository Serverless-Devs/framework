const getRawBody = require('raw-body');
const getFormBody = require('body/form');

const formType = 'application/x-www-form-urlencoded';

exports.onRequest = (handler) => async (req, res, context) => {
  const request = {
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
        request.body = formBody;
        resolve(request.body);
      });
    });
  } else {
    await new Promise((resolve, reject) => {
      getRawBody(req, (err, body) => {
        if (err) reject(err);
        request.body = body.toString();
        resolve(request.body);
      });
    });
  }
  const result = handler(request, context);
  res.setStatusCode(result.statusCode);
  if ('headers' in result) {
    const headers = result.headers;
    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]);
    });
  }
  if ('deleteHeaders' in result) {
    const deleteHeaders = result.deleteHeaders;
    deleteHeaders.forEach((key) => {
      res.deleteHeader(key);
    });
  }
  res.send(JSON.stringify(result.body));
};
