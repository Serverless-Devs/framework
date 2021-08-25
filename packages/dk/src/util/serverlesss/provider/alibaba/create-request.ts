import Request from '../../request';

function removeBasePath(path = '/', basePath) {
  if (basePath) {
    const basePathIndex = path.indexOf(basePath);

    if (basePathIndex > -1) {
      return path.substr(basePathIndex + basePath.length) || '/';
    }
  }

  return path;
}

export default (event, context, options) => {
  const { method, headers, body, url, path, queries } = event;
  if (typeof options.requestId === 'string' && options.requestId.length > 0) {
    const header = options.requestId.toLowerCase();
    const requestId = headers[header];
    if (requestId) {
      headers[header] = requestId;
    }
  }

  const req = new Request({
    method,
    headers,
    body,
    url: removeBasePath(url, options.basePath),
    path,
    queries
  });

  req.requestContext = event.requestContext;
  req.apiGateway = {
    event,
    context,
  };
  return req;
};
