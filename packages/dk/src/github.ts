import { createGithubHandler } from './util';
import { http, IOptions } from './http';

interface Iconfig {
  path?: string,
  secret?: string,
}

interface IGithubOptions {
  handler?: Function;
  config?: Iconfig | Iconfig[];
  httpOpts?: IOptions;
}

const github = (options?: IGithubOptions) => {
  const { config = {}, handler, httpOpts = {} } = options;
  const githubHandler = createGithubHandler(config);

  http.app.use(async (ctx, next) => {
    const data = await githubHandler(ctx.request);
    ctx.status = data.code;
    ctx.body = data.message;
    ctx.github = data;
    await handler?.(ctx);
    next();
  });

  return http(httpOpts);
}

export default github;