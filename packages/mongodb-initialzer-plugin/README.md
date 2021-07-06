## 使用说明

`@serverless-devs/mongodb-initialzer-plugin` 插件，使用该插件需要在环境变量里设置 `mongo_url` 参数, 然后你可以在 `baseHandler` 里 通过 `request.internal` 里拿到 `dbClient` 和 `MongoClient`

## `mongo_url` 参数 是什么？

mongodb 服务地址，如本地 `mongodb://localhost:27017`
 
## 基本使用

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const rdsMongodbInitialzerPlugin = require('@serverless-devs/mongodb-initialzer-plugin');

const handler = dk((request) => {
  console.log('internal', request.internal.dbClient);
  return { body: 'hello world' };
});

handler.use(rdsMongodbInitialzerPlugin());

exports.initializer = handler.initializerHandler;

exports.handler = handler;
```
