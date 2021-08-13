import { createGithubHandler } from './util';
import dk from './dk'

const github = (options) => {
  const githubHandler = createGithubHandler(options.config);
  return dk((ctx) => {
    const data = githubHandler(ctx.req);
    ctx.req.github = data;
    return options.handler(ctx);
  })
};

github.onEvent = (options) => github(options);

export {
  github,
}
