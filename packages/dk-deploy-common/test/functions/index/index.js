const { dk, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const baseHandler = {
  'GET /list': async (ctx) => {
    const { tableClient } = ctx.internal;
    // 1.查询表
    const data = await tableClient.listTable();
    return { json: data };
  },
  'POST /list': async (ctx) => {
    const { tableName } = ctx.req.body;
    const { tableClient } = ctx.internal;
    const params = {
      tableMeta: {
        tableName,
        primaryKey: [
          {
            name: 'id',
            type: 'INTEGER',
          },
        ],
      },
      reservedThroughput: {
        capacityUnit: {
          read: 0,
          write: 0,
        },
      },
      tableOptions: {
        timeToLive: -1, // 数据的过期时间, 单位秒, -1代表永不过期. 假如设置过期时间为一年, 即为 365 * 24 * 3600.
        maxVersions: 1, // 保存的最大版本数, 设置为1即代表每列上最多保存一个版本(保存最新的版本).
      },
      streamSpecification: {
        enableStream: true, //开启Stream
        expirationTime: 24, //Stream的过期时间，单位是小时，最长为168，设置完以后不能修改
      },
    };
    await tableClient.createTable(params);
    return {
      json: {
        success: true,
        message: `${tableName}表已创建成功`,
      },
    };
  },
  'DELETE /list': async (ctx) => {
    const { tableName } = ctx.req.queries;
    const { tableClient } = ctx.internal;
    const params = {
      tableName,
    };
    await tableClient.deleteTable(params);
    return {
      json: {
        success: true,
        message: `${tableName}表已删除成功`,
      },
    };
  },
};

const handler = dk(baseHandler);

handler.use(tablestoreInitialzerPlugin());

exports.handler = handler;
