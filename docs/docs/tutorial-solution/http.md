---
sidebar_position: 4
title: dk-http 服务
---
# fc-http

此模块集成了 koa 服务框架，支持以 `nodejs runtime` 的形式在阿里云函数计算上运行。
- 支持 async/await
- Node版本 8+

## 快速体验
```
$ s init dk-http
```
- 基本示例
```
const { http } = require('@serverless-devs/dk');

http
  .get("/http", (ctx) => {
    ctx.body = 'Hello Http!';
  })
  .get("/", async (ctx,next) => {
    ctx.body = "Hello World!";
  })
 
http.app.use(http.routes());

exports.handler = http();

```
## 部署
```
$ s deploy
```

更多内容见 [HTTP 设计](/docs/tutorial-dk/intro/http)