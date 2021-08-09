/* eslint no-useless-escape: 0 */
import { createGithubHandler } from './util';
import events from './util/githubEvent';

const toHump = (name) => {
  return `on_${name}`.replace(/\_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}

export const githubHandler = (options) => {
  const handler = createGithubHandler(options);
  Object.keys(events).forEach((event) => {
    if (event === 'err') { // 在 createGithubHandler 中 handler.emit('error') 事件会导致整个流程直接中断抛异常，所以改成了handler.emit('err')
      handler.onError = (err, req) => handler.on(event, err, req);
    } else {
      handler[toHump(event)] = callback => handler.on(event, callback);
    }
  })
  return handler;
}