## 设计原则

Fc 函数计算的参数格式为`(req, res, context)`。第一个参数 req 的参数类型为 readable Stream。将 req 转换为 JSON Object 的类型

## 基础使用方式
请求报错时，可以正常返回报错信息
```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const httpErrorHandler = require('@serverless-devs/http-error-handler');

const handler = dk((request) => {
  throw new Error();
});

handler.use(httpErrorHandler());

exports.handler = handler;
```

## 高级使用方式
