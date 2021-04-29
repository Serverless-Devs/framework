exports.onRequest = (handler) => (req, res, context) => {
  const result = handler(req, res, context);
  if (res && res.send) {
    res.send(result);
  }
};
