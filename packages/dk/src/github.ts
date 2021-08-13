import { createGithubHandler } from './util';
import dk from './dk'

interface IGithubOptions {
  handler: Function;
  config: {
    path: string,
    secret?: string,
  };
}

const github = (options: IGithubOptions) => {
  const githubHandler = createGithubHandler(options.config);
  return dk((ctx) => {
    const data = githubHandler(ctx.req);
    ctx.req.github = data;
    return options.handler(ctx);
  })
};

github.onEvent = (options: IGithubOptions) => github(options);

export {
  github,
}
