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
  const githubHandler = createGithubHandler(options?.config);

  http.app.use(async (ctx, next) => {
    const data = await githubHandler(ctx.request);
    ctx.status = data.code;
    ctx.body = data.message;
    ctx.github = data;
    await options?.handler?.(ctx);
    next();
  });

  return http(options?.httpOpts);
}

export = github;