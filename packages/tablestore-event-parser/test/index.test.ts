import dk from '@serverless-devs/dk-core';
import tablestoreInitialzerPlugin from '@serverless-devs/tablestore-initialzer-plugin';
import { mockContext, mockCallback } from './fixtures/mock-data';
import tablestoreEventParser from '../src/index';

describe('tablestore-event-parser 测试', () => {
  test('table client 连接', async () => {
    const handler = dk((request) => {
      return request.internal.tableClient;
    });

    process.env.tablestore_endpoint = 'https://s-table-01.cn-hangzhou.ots.aliyuncs.com';
    process.env.tablestore_instanceName = 's-table-01';

    handler.use(tablestoreInitialzerPlugin()).use(tablestoreEventParser());

    await handler.initializerHandler(mockContext, mockCallback);

    await handler(Buffer.from('61626364', 'hex'), mockContext, (err, result) => {
      expect(result).not.toBeNull();
    });
  });
});
