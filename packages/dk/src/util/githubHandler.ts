// https://docs.github.com/cn/developers/webhooks-and-events/webhooks/about-webhooks
// https://github.com/rvagg/github-webhook-handler
// https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads
import EventEmitter from 'events';
import crypto from 'crypto';

function findHandler(url, arr) {
  if (!Array.isArray(arr)) {
    return arr
  }

  let ret = arr[0]
  for (let i = 0; i < arr.length; i++) {
    if (url === arr[i].path) {
      ret = arr[i]
    }
  }

  return ret
}

function checkType(options) {
  if (typeof options !== 'object') {
    throw new TypeError('must provide an options object')
  }

  if (typeof options.path !== 'string') {
    throw new TypeError('must provide a \'path\' option')
  }

  const { secret = '' } = options;
  if (typeof secret !== 'string') {
    throw new TypeError('must provide a \'secret\' option')
  }
}

// 生成令牌
function sign(data, secret = '') {
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(new Buffer(JSON.stringify(data)));
  return `sha1=${hmac.digest('hex')}`;
}
// 校验令牌
function verify(signature, data, secret = '') {
  if (!secret) return true;
  const sig = Buffer.from(signature)
  const signed = Buffer.from(sign(data, secret))
  if (sig.length !== signed.length) {
    return false
  }
  return crypto.timingSafeEqual(sig, signed)
}

export interface IHandler {
  sign: (data: any, secret?: string) => string;
  verify: (signature: any, data: any, secret?: string) => boolean;
  on?: Function;
  emit?: Function
  (req: any): any;
  [key: string]: any;
}

export const createGithubHandler = (initOptions) => {
  let options
  // validate type of options
  if (Array.isArray(initOptions)) {
    for (let i = 0; i < initOptions.length; i++) {
      checkType(initOptions[i])
    }
  } else {
    checkType(initOptions)
  }

  const handler: IHandler = (req) => {
    let events

    options = findHandler(req.path, initOptions)

    if (typeof options.events === 'string' && options.events !== '*') {
      events = [options.events]
    } else if (Array.isArray(options.events) && options.events.indexOf('*') === -1) {
      events = options.events
    }

    if (req.path !== options.path || req.method !== 'POST') {
      return { code: 404, message: 'no match path' }
    }

    function hasError(msg) {
      const err = new Error(msg);
      handler.emit('err', err, req); //  handler.emit('error') 事件会导致整个流程直接中断抛异常，所以改成了handler.emit('err')
      return { code: 400, message: err.message }
    }

    const sig = req.headers['x-hub-signature']
    const event = req.headers['x-github-event']
    const id = req.headers['x-github-delivery']
    const contentType = req.headers['content-type'];

    if (options.secret && !sig) {
      return hasError('No X-Hub-Signature found on request')
    }

    if (!event) {
      return hasError('No X-Github-Event found on request')
    }

    if (!id) {
      return hasError('No X-Github-Delivery found on request')
    }

    if (events && events.indexOf(event) === -1) {
      return hasError('X-Github-Event is not acceptable')
    }

    // github 发起的请求中，form 比 json 方式多包一层 payload
    const mimePattern = /^application\/x-www-form-urlencoded(;.*)?$/;
    let { body } = req;
    if (mimePattern.test(contentType)) {
      body = JSON.parse(body.payload)
    }

    // 令牌校验
    if (!verify(sig, body, options.secret)) {
      return hasError('X-Hub-Signature does not match blob signature')
    }

    const emitData = {
      event,
      id,
      payload: body,
      protocol: req.protocol,
      host: req.headers.host,
      url: req.url,
      path: options.path
    }

    handler.emit(event, emitData)
    handler.emit('event', emitData)
    return { code: 200, message: 'success' }
  }

  // make it an EventEmitter
  Object.setPrototypeOf(handler, EventEmitter.prototype)
  EventEmitter.call(handler)

  handler.sign = sign
  handler.verify = verify

  return handler;
}

