## 设计原则
Fc函数计算的参数格式为`(req, res, context)`。第一个参数req的参数类型为 readable Stream。将req转换为JSON Object的类型

## 基础使用方式


```javascript
'use strict';
const noah = require('@serverless-devs/noah-core');
const jsonBodyParser = require('@serverless-devs/http-json-body-parser');

const handler = noah((request) => {
  return { body: 'hello world' };
});

handler.use(jsonBodyParser());

exports.handler = handler;
```
## 高级使用方式
