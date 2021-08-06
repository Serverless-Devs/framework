const Cookies = require('./cookies')
const cookieSession = require('./session');
const cookiesMiddleware = (options) => {
  const cookiesMiddlewareBefore = async (request) => {
    const cookies = new Cookies(request.req, request.res, options)
    request.req.cookies = cookies
  };
  return {
    before: cookiesMiddlewareBefore,
  };
};

const cookieSessionMiddleware = (options) => {
  const cookieSessionMiddlewareBefore = async (request) => {
    cookieSession(options)(request)
  };
  return {
    before: cookieSessionMiddlewareBefore,
  };
};


export = { cookiesMiddleware, cookieSessionMiddleware };
