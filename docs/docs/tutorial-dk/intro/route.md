---
sidebar_position: 4
title: 路由配置
---

### 介绍
我们在初始化一个 Rest API 应用时，假设我们需要对此函数处理某一逻辑功能，如商品列表对，如商品列表的增删改查时，我们需要在 `handler` 函数中添加条件语句，用于监听并处理触发器触发的事件条件。如
```
const { dk } = require('@serverless-devs/dk');

const baseHandler = (ctx) => {
  const { method, path } = ctx.req;

  if (path === '/goods' && method === 'GET') {
    return {
      json: { title: 'get goods list' }
    }
  }
  if (path === '/goods' && method === 'POST') {
    return {
      json: { title: 'add goods' }
    }
  }
};

const handler = dk(baseHandler);

exports.handler = handler;
```

以上方式可读性非常低，且代码不雅观。 在 `dk` 工具，我们封装了一套路由规则，通过 `route` 我们可以非常方便的处理其中的逻辑，`dk` 方法支持以对象的形式接收参数，如下：

## 基本使用方法
```
const { dk } = require('@serverless-devs/dk');

const baseHandler = {
  'GET /goods': (ctx) => ({ json: { title: 'delete goods' } }),
  'POST /goods': (ctx) => ({ json: { title: 'delete goods' } }),
};

const handler = dk(baseHandler);

exports.handler = handler;
```
- `baseHandler` 函数里，通过 `ctx.req` 获取入参信息。
- 通过 `const { queries, body } = ctx.req;` 其中， `queries` 为拼接在接口上的参数， `body` 为接口的请求体。
- 兼容 `method` 大小写
## 高级使用方法

```
const { dk } = require('@serverless-devs/dk');

const baseHandler = {
  'GET /goods': (ctx) => ({ json: { title: 'get goods' } }),
  'POST /goods': (ctx) => ({ json: { title: 'add goods' } }),
  'DELETE /goods/:id': (ctx) => ({ json: { title: 'delete goods' } }),
  'PATCH /goods/:id': (ctx) => ({ json: { title: 'update goods info' } }),
  'GET /goods/:id': (ctx) => ({ json: { title: 'get goods info' } }),
};

const handler = dk(baseHandler);

exports.handler = handler;
```
- 当接口为 `/goods/:id` 时，可通过 `ctx.req.match` 获取 商品`id` 值
