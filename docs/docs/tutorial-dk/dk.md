---
sidebar_position: 2
title: DK使用
---

## 使用方法

```js
const { dk, validator } = require('@serverless-devs/dk');

const schema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      properties: {
        string: {
          type: 'string',
        },
        boolean: {
          type: 'boolean',
        },
        integer: {
          type: 'integer',
        },
        number: {
          type: 'number',
        },
      },
    },
  },
};

const handler = dk((ctx) => {
  // ctx 包含 ctx.req 可获取入参信息
  return {
    json: { title: 'hello serverless devs' },
  };
});

handler.use(
  validator({
    eventSchema: schema,
  }),
);

exports.handler = handler;
```

`.use()` 采用单个中间件或一组中间件，因此您可以在一次调用中附加多个中间件。

## 工作原理

dk 采用经典的洋葱模型
![avatar](https://img.alicdn.com/imgextra/i2/O1CN01DtNyAf1Mg68Te52hq_!!6000000001463-2-tps-672-556.png)

通过上面的请求-响应的模型，在每个步骤中提供修改当前请求或者上下文响应的机会。

#### 执行顺序

中间件有两个执行阶段 `before` 和 `after`。 <br />
`before` 阶段发生在处理程序执行之前，在此代码中，尚未创建响应，只能处理访问请求。<br />
`after` 阶段发生在处理程序执行之后，在此代码中，可以访问请求和响应。

如果您使用了三个中间件，则预期的执行顺序为：

```
middleware1 (before)
middleware2 (before)
middleware3 (before)
handler
middleware3 (after)
middleware2 (after)
middleware1 (after)
```

## 内置中间件

#### Request 转换

1. http-form-body-parser: 自动解析内容类型为 application/x-www-form-urlencoded 的 HTTP 请求，并将正文转换为对象。
2. http-json-body-parser: 自动解析内容类型为 application/json 的 HTTP 请求，并将正文转换为对象。

#### Response 转换

1. http-response-parser: HTTP response 响序列化

- html: 'xxx' => {header: 'content-type:text/html; charset=utf8', body: 'xxx'}
- css: 'xxx' => {header: 'content-type:text/css; charset=utf8', body: 'xxx'}
- text: 'xxx' => {header: 'content-type:text/plain; charset=utf8', body: 'xxx'}
- js: 'xxx' => {header: 'content-type:text/javascript; charset=utf8', body: 'xxx'}
- json: 'xxx' => {header: 'content-type:application/json; charset=utf8', body: 'xxx'}
- xml: 'xxx' => {header: 'content-type:application/xml; charset=utf8', body: 'xxx'}

2. http-error-handler: 异常报错时，添加默认值 { code: 500, message: 'server error' }

## 高级特性

#### 路由能力
