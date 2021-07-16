---
sidebar_position: 1
title: tablestore数据库连接
---

## 介绍

表格存储（Tablestore）是构建在阿里云飞天分布式系统之上的 NoSQL 数据存储服务，提供海量结构化数据的存储和实时访问。更多详情可前往阿里云[tablestore](https://otsnext.console.aliyun.com/)控制台查看。

## 基本使用方法

```js
const { dk, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const baseHandler = async (ctx) => {
  const { tableClient } = ctx.internal;
  const data = await tableClient.listTable();
  return { json: data };
};

const handler = dk(baseHandler);
handler.use(tablestoreInitialzerPlugin());
exports.handler = handler;
```

- baseHandler 函数里，通过 `ctx.req` 获取入参信息。
- 通过 `.use(tablestoreInitialzerPlugin())` 后，baseHandler 函数里，通过 `ctx.internal` 获取 `tableClient` 和 `Tablestore`。
- 对于 `tableClient` 和 `Tablestore` 的更多使用方法可前往[aliyun-tablestore-nodejs-sdk](https://github.com/aliyun/aliyun-tablestore-nodejs-sdk)查看。

## 高级使用方法

```js
const { dk, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const baseHandler = {
  'GET /info': async (ctx) => {
    const { tableName } = ctx.req.queries;
    const { tableClient, TableStore } = ctx.internal;
    const params = {
      tableName,
      direction: TableStore.Direction.FORWARD,
      maxVersions: 10,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MAX }],
      limit: 2,
    };
    let resultRows = [];
    const getRange = async function () {
      const data = await tableClient.getRange(params);
      resultRows = resultRows.concat(data.rows);
      //如果data.next_start_primary_key不为空，说明需要继续读取
      if (data.nextStartPrimaryKey) {
        params.inclusiveStartPrimaryKey = [{ id: data.nextStartPrimaryKey[0].value }];
        await getRange();
      }
    };
    await getRange();
    return {
      json: resultRows,
    };
  },
  'POST /info': async (ctx) => {
    const { name, age, tableName } = ctx.req.body;
    const { tableClient, TableStore } = ctx.internal;
    const Long = TableStore.Long;
    var currentTimeStamp = Date.now();
    const params = {
      tableName,
      //不管此行是否已经存在，都会插入新数据，如果之前有会被覆盖。condition的详细使用说明，请参考conditionUpdateRow.js
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(currentTimeStamp) }],
      attributeColumns: [{ name }, { age: Long.fromNumber(age) }],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    await tableClient.putRow(params);
    return {
      json: {
        data: { name, age },
        message: '数据创建成功',
      },
    };
  },
  'PUT /info': async (ctx) => {
    const { id, name, age, tableName } = ctx.req.body;
    const { tableClient, TableStore } = ctx.internal;
    const Long = TableStore.Long;
    var params = {
      tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(id) }],
      updateOfAttributeColumns: [
        {
          PUT: [{ name }, { age }],
        },
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    };
    await tableClient.updateRow(params);
    return {
      json: {
        data: { id, name, age },
        message: '数据更成功',
      },
    };
  },
  'DELETE /info': async (ctx) => {
    const { id, tableName } = ctx.req.queries;
    const { tableClient, TableStore } = ctx.internal;
    const Long = TableStore.Long;
    var params = {
      tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id: Long.fromNumber(id) }],
    };
    await tableClient.deleteRow(params);
    return {
      json: {
        id,
        message: '数据删除成功',
      },
    };
  },
};

const handler = dk(baseHandler);

handler.use(tablestoreInitialzerPlugin());

exports.handler = handler;
```

## 示例

- 下载命令行工具

```base npm2yarn
npm install @serverless-devs/s -g
```

- 初始化一个模版项目：`s init devsapp/dk-tablestore`
- 下载完成后请输入 tablestore 的实例名称和公网地址，可前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例， 在实例详情页面可以看到 `实例名称` 和 `公网地址`

![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)

- 请手动更改 `functions/index/index.html` 和 `functions/index/info.html` 的 `baseURL`

![image](https://img.alicdn.com/imgextra/i1/O1CN01OfiqiY1GoReRnA0Sj_!!6000000000669-2-tps-895-113.png)

- 部署函数

```
s deploy
```

- 部署成功后访问 `域名` 就可以了

![image](https://img.alicdn.com/imgextra/i2/O1CN01Ra3NeY1TGB1b8IBFh_!!6000000002354-2-tps-1001-335.png)

### 本地调试

在 `sourceCode指定路径` 下执行 `npm run serve` 即可访问 `http://localhost:7001` 了

### curl 测试

- 创建数据表

```shell
  curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "tableName": "dk_user"
  }'
```

返回数据

```json
{
  "success": true,
  "message": "dk_user表已创建成功"
}
```

- 获取所有表

```shell
curl --location --request GET 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/'
```

返回数据

```json
{
  "tableNames": ["dk_user"]
}
```

- 删除数据表

```shell
curl --location --request DELETE 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/?tableName=dk_user'
```

数据返回

```json
{
  "success": true,
  "message": "dk_user表已删除成功"
}
```

#### 以 dk_user 表为例进行增删改查

- 创建

```shell
curl --location --request POST 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/' \
--header 'Content-Type: application/json' \
--data-raw '{
"tableName": "dk_user",
"name": "shl",
"age": 20
}'
```

数据返回

```json
{
  "data": {
    "name": "shl",
    "age": 20
  },
  "message": "数据创建成功"
}
```

- 更新

```shell
curl --location --request PUT 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/' \
--header 'Content-Type: application/json' \
--data-raw '{
"tableName": "dk_user",
"id": 1622604175120,
"age": 21,
"name": "dk"
}'
```

数据返回

```json
{
  "data": {
    "id": 1622604175120,
    "name": "dk",
    "age": 21
  },
  "message": "数据更成功"
}
```

- 查寻

```shell
curl --location --request GET 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/?tableName=dk_user'
```

数据返回

```js
[
  {
    primaryKey: [
      {
        name: 'id',
        value: 1622604175120,
      },
    ],
    attributes: [
      {
        columnName: 'age',
        columnValue: 21,
        timestamp: 1622604557591,
      },
      {
        columnName: 'name',
        columnValue: 'dk',
        timestamp: 1622604557591,
      },
    ],
  },
];
```

- 删除

```shell
curl --location --request DELETE 'https://1694024725952210.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/?id=1622604175120&tableName=dk_user'
```

数据返回

```json
{
  "id": "1622604175120",
  "message": "数据删除成功"
}
```
