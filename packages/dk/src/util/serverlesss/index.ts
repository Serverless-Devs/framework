import finish from './finish';
import getFrameword from './framework';
import getProvider from './provider';


const defaultOptions = {
  requestId: 'x-request-id'
};

interface IOpts {
  basePath?: string,
  request?: Function,
  response?: Function,
  requestId?: string,
}

export const serverlessHandler = (app, opts: IOpts) => {
  const options = Object.assign({}, defaultOptions, opts);
  const framework = getFrameword(app);
  const provider = getProvider(options);

  return provider(async (request, ...context) => {
    await finish(request, options.request, ...context);
    const response = await framework(request);
    await finish(response, options.response, ...context);
    return response;
  })
};
