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

请前往[Tablestore 数据库](/docs/tutorial-quickstart/database/tablestore)体验
