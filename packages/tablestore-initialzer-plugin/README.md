## 使用说明

`@serverless-devs/tablestore-initialzer-plugin` 插件是基于 [Aliyun TableStore SDK](https://github.com/aliyun/aliyun-tablestore-nodejs-sdk)开发，使用该插件需要在环境变量里设置 `tablestore_endpoint` 和 `tablestore_instanceName` 两个参数, 然后你可以在 `baseHandler` 里 通过 `request.internal` 里拿到 `tableClient` 和 `TableStore`

## `tablestore_endpoint` 和 `tablestore_instanceName` 参数 是什么？

请前往 [Tablestore 控制台](https://otsnext.console.aliyun.com/) 创建实例，在实例列表页面，可看到 `tablestore_endpoint`(实例访问地址公网)和`tablestore_instanceName`(实例名称)

## 基本使用

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const handler = dk((request) => {
  console.log('internal', request.internal.tableClient);
  return { body: 'hello world' };
});

handler.use(tableStorePlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
```
