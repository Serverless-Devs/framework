import dk from '@serverless-devs/dk-core';
import rdsMongodbInitialzerPlugin from '../src/index';
import { mockContext, mockCallback } from './fixtures/mock-data';

describe('rds-mongodb-initialzer-plugin测试', () => {
  test('mongodb 连接', async () => {
    const handler = dk((request) => {
      return request.internal.tableClient;
    });

    process.env.MONGO_URL = 'mongodb://localhost:27017';
    handler.use(rdsMongodbInitialzerPlugin());

    const data = await handler.initializerHandler(mockContext, mockCallback);
    const { dbClient } = data.internal;

    try {
      await dbClient.connect();
      const db = dbClient.db('hfs'); // 切换数据库
      const inventory = db.collection('inventory'); // 选择集合
      await inventory.insertOne({ name: 'name', age: 12 }); // 插入数据
      const res = await inventory.findOne({ name: 'name' }); // 查找数据
      console.log('------res--------', res);
    } catch (err) {
      console.log(err);
    } finally {
      dbClient.close()
    }
  });
});