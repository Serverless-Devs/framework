import dk from '@serverless-devs/dk-core';
import tablestoreInitialzerPlugin from '../src/index';
import { mockContext, mockCallback } from './fixtures/mock-data';

describe('tablestore-initialzer-plugin测试', () => {
  test('table client 连接', async () => {
    const handler = dk((request) => {
      return request.internal.tableClient;
    });

    process.env.tablestore_endpoint = 'https://s-table-01.cn-hangzhou.ots.aliyuncs.com';
    process.env.tablestore_instanceName = 's-table-01';

    handler.use(tablestoreInitialzerPlugin());

    await handler.initializerHandler(mockContext, mockCallback);
    const event = { body: 'hello world' };
    await handler(event, mockContext, (err, result) => {
      expect(result).not.toBeNull();
    });
  });
});
