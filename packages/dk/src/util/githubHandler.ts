// https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks
// https://github.com/rvagg/github-webhook-handler
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

  if (typeof options.secret !== 'string') {
    throw new TypeError('must provide a \'secret\' option')
  }
}

// 生成令牌
function sign(data, secret) {
  return `sha1=${crypto.createHmac('sha1', secret).update(data).digest('hex')}`
}
// 校验令牌
function verify(signature, data, secret) {
  const sig = Buffer.from(signature)
  const signed = Buffer.from(sign(data, secret))
  if (sig.length !== signed.length) {
    return false
  }
  return crypto.timingSafeEqual(sig, signed)
}

export interface IHandler {
  sign: (data: any, secret: string) => string;
  verify: (signature: any, data: any, secret: string) => boolean;
  on?: Function;
  emit?: Function
  (ctx: any, callback: any): any;
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

  const handler: IHandler = (ctx, callback) => {
    let events

    options = findHandler(ctx.req.url, initOptions)

    if (typeof options.events === 'string' && options.events !== '*') {
      events = [options.events]
    } else if (Array.isArray(options.events) && options.events.indexOf('*') === -1) {
      events = options.events
    }

    if (ctx.req.url !== options.path || ctx.req.method !== 'POST') {
      return callback()
    }

    function hasError(msg) {
      const err = new Error(msg);
      handler.emit('error', err, ctx.req);
      callback(err)
    }

    const sig = ctx.req.headers['x-hub-signature']
    const event = ctx.req.headers['x-github-event']
    const id = ctx.req.headers['x-github-delivery']

    if (!sig) {
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

    // todo 令牌校验
    // console.log('verify(sig, data)-----0', sig)
    // if (!verify(sig, Buffer.from(ctx.req.body), options.secret)) {
    //   console.log('verify(sig, data)-----2', sig)
    //   return hasError('X-Hub-Signature does not match blob signature')
    // }
    const emitData = {
      event,
      id,
      payload: ctx.req.body,
      protocol: ctx.req.protocol,
      host: ctx.req.headers.host,
      url: ctx.req.url,
      path: options.path
    }

    handler.emit(event, emitData)
    handler.emit('event', emitData)
  }

  // make it an EventEmitter
  Object.setPrototypeOf(handler, EventEmitter.prototype)
  EventEmitter.call(handler)

  handler.sign = sign
  handler.verify = verify

  return handler;
}

