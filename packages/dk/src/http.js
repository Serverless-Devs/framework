/**
 * 写在前面
 * 
 * koa-body 内部的 declare module "koa"， 结合当前 ts 文件 npm run build 会引起报错，所以这个文件用 js.
 *  报错内容： Invalid module name in augmentation. Module 'koa' resolves to an untyped module at
 *  
 * */
import serverless from '@serverless-devs/fc-http';
import Koa from 'koa';
import Router from "koa-router";
import koaBody from 'koa-body';

// interface IOptions {
//   basePath?: string;
//   request?: Function;
//   response?: Function;
//   binary?: Boolean | Function | Object[]; // 二进制 Binary Mode
// }

const router = new Router()
const app = new Koa();

app.use(koaBody());

const http = (options) => serverless(app, options);
http.app = app;

Object.setPrototypeOf(http, router);

export { http, serverless };