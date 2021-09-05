import serverless from '@serverless-devs/fc-http';
import Koa from 'koa';
import Router from "koa-router";
import koaBody from 'koa-body';

interface IOptions {
  basePath?: string;
  request?: Function;
  response?: Function;
  binary?: Boolean | Function | Object[]; // 二进制 Binary Mode
}

const router = new Router()
const app = new Koa();

app.use(koaBody());

const http = (options?: IOptions) => serverless(app, options);
http.app = app;
Object.setPrototypeOf(http, router);

export { http, serverless, IOptions };