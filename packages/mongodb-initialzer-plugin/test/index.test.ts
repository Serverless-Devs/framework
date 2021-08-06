import dk from '@serverless-devs/dk-core';
import MongoDBInitialzerPlugin from '../src/index';
import { mockContext, mockCallback } from './fixtures/mock-data';

describe('tablestore-initialzer-plugin测试', () => {
  test('table client 连接', async () => {
    const handler = dk((request) => {
      console.log('request.internal', request.internal);
      return request.internal.tableClient;
    });

    process.env.MONGO_URL = 'mongodb://127.0.0.1:27017';
    process.env.dbName = 'admin';
    handler.use(MongoDBInitialzerPlugin());

    await handler.initializerHandler(mockContext, mockCallback);
    const event = { body: 'hello world' };
    await handler(event, mockContext, (err, result) => {
      expect(result).not.toBeNull();
    });
  });
});

// import dk from '@serverless-devs/dk-core';
// import rdsMongodbInitialzerPlugin from '../src/index';
// import { mockContext, mockCallback } from './fixtures/mock-data';

// describe('mongodb-initialzer-plugin测试', () => {
//   test('mongodb 连接', async () => {
//     expect('abc').not.toBeNull();
// const handler = dk((request) => {
//   return request.internal.tableClient;
// });

// process.env.MONGO_URL = 'mongodb://localhost:27017';
// handler.use(rdsMongodbInitialzerPlugin());

// const data = await handler.initializerHandler(mockContext, mockCallback);
// const { dbClient } = data.internal;

// try {
//   await dbClient.connect();
//   const db = dbClient.db('hfs'); // 切换数据库
//   const inventory = db.collection('inventory'); // 选择集合
//   await inventory.insertOne({ name: 'name', age: 12 }); // 插入数据
//   const res = await inventory.findOne({ name: 'name' }); // 查找数据
//   console.log('------res--------', res);
// } catch (err) {
//   console.log(err);
// } finally {
//   dbClient.close()
// }
//   });
// });
