import { mockContext, mockResponse } from './fixtures/mock-data';

const { oss } = require('../src/index');

describe('事件函数', () => {
  test('测试OSS 事件', async () => {
    const handler = oss.onObjectCreated('my-bukect', (request) => {
      return {
        success: 'true',
      };
    });

    await handler({ method: 'GET' }, mockResponse, mockContext);
  });
});
