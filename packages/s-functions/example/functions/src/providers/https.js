exports.onRequest = (handler) => (req, res, context) => {
  const result = handler(req, res, context);
  res.send(JSON.stringify(result));
};
