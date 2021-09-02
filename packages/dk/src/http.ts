const serverless = require('@serverless-devs/fc-http');
const Koa = require('koa');
const Router = require("koa-router");

const router = new Router()
const app = new Koa();

const http = (req, res, context) => serverless(app)(req, res, context);
http.app = app;
Object.setPrototypeOf(http, router);

export { http, serverless };