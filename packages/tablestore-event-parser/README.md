## 设计原则

Fc 函数计算的 事件函数 参数格式为`(event, context, callback)`。第一个参数 event 的参数类型为 buffer 对象, tablestore-event-parser 会将其转换为 json 格式

## 基础使用方式

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const otsEventParse = require('@serverless-devs/tablestore-event-parser');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const handler = dk((request) => {
  console.log(request.event);
});

handler.use(tableStorePlugin()).use(otsBodyParse());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
```

## 高级使用方式
