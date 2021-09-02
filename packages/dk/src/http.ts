const serverless = require('@serverless-devs/fc-http');
const Koa = require('koa');
const Router = require("koa-router");

const router = new Router()
const app = new Koa();

const http = (options) => (req, res, context) => serverless(app, options)(req, res, context);
http.app = app;
Object.setPrototypeOf(http, router);

export { http, serverless };