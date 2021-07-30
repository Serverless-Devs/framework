import { createGithubHandler } from './util';

export const githubHandler = (options) => {
  const handler = createGithubHandler(options);

  handler.onPush = (callback) => {
    handler.on('push', callback)
  }
  handler.onIssues = (callback) => {
    handler.on('issues', callback)
  }
  handler.onEvent = (callback) => {
    handler.on('event', callback)
  }
  return handler;
}