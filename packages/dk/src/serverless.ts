
import dk from './dk';
import { serverlessHandler } from './util';


interface IOpts {
  basePath?: string,
  request?: Function,
  response?: Function,
}

const serverless = (app, opts: IOpts) => {
  const handler = serverlessHandler(app, opts);
  const handle: any = dk(async (ctx) => {
    const Data = await handler(ctx.req);
    return { json: Data }
  })

  handle.onEvent = (callback) => {
    return dk(async (ctx) => {
      const Data = await handler(ctx.req);
      return callback(Data);
    })
  }
  return handle
}

export default serverless;