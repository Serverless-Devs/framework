## 设计原则

1. 正常情况下一个函数处理一个业务，比如对于应用来说一个函数获取应用列表。
2. 假设我们需要对一个实体对象 app 进行 crud 操作

## 基础使用方式

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const routeParser = require('@serverless-devs/http-route-parser');

const route = {
  '/user': {
    GET: (config) => console.log('GET', config.req.match),
    POST: (config) => console.log('POST', config.req.match),
  },
  '/user/:id': {
    GET: (config) => console.log('GET', config.req.match),
    POST: (config) => console.log('POST', config.req.match),
  },
};
const handler = dk((request) => {
  return { body: 'hello world' };
});

handler.use(routeParser(route));

exports.handler = handler;
```

## 高级使用方式
