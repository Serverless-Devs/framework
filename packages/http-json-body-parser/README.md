## 设计原则

Fc 函数计算的参数格式为`(req, res, context)`。第一个参数 req 的参数类型为 readable Stream。将 req 转换为 JSON Object 的类型

## 基础使用方式

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const jsonBodyParser = require('@serverless-devs/http-json-body-parser');

const handler = dk((request) => {
  return { body: 'hello world' };
});

handler.use(jsonBodyParser());

exports.handler = handler;
```

## 高级使用方式
