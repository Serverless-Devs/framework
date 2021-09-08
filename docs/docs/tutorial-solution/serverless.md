---
sidebar_position: 5
title: dk-serverless 服务
---
# fc-http

此模块可以方便的将传统的 web 框架使用 `nodejs runtime` 的形式在阿里云函数计算上运行。
- 支持 async/await
- Node版本 8+

## 框架支持
(`*` 代表暂时不完全支持)
- Connect
- Express
- Koa
- Restana
- Nuxt *
- Sails *
- Hapi *
- Fastify *
- Restify *
- Polka *
- Loopback *

## 快速体验
```
$ s init dk-serverless
```
- 基本示例
```
const { serverless } = require('@serverless-devs/dk');
const Koa = require('koa');
const Router = require("koa-router");
const router = new Router();
const app = new Koa();

router
  .get("/koa", (ctx) => {
    ctx.body = 'Hello Koa!';
  })
  .get("/", async (ctx) => {
    ctx.body = "Hello World!";
  })
app.use(router.routes());

exports.handler = serverless(app);
```

更多例子见 [Examples](https://github.com/Serverless-Devs/fc-http/tree/main/examples)

## 部署
```
$ s deploy
```

更多内容见 [HTTP 设计](/docs/tutorial-dk/intro/http)
