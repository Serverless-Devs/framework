/**
 *  koa-body 内部的 declare module "koa"，构建报错
 *  报错内容： Invalid module name in augmentation. Module 'koa' resolves to an untyped module at
 *  官方 issue：https://github.com/koajs/koa-body/issues/182，----- 未解决
 * 
 *  尝试解决：tsconfig.json 添加 "skipLibCheck": true, ----- 解决，无报错
 * */
import serverless from '@serverless-devs/fc-http';
import Koa from 'koa';
import Router from "koa-router";
import koaBody from 'koa-body';

export interface IOptions {
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

export { http, serverless };