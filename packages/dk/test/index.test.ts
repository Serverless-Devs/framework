import { mockResponse, mockContext } from './fixtures/mock-data';
const dk = require('../src');

describe('http-response-parser测试', () => {
  test('html', async () => {
    const mockRequest = { method: 'GET' };
    const handler = dk((request) => {
      return {
        json: { result: 'ok' },
      };
    });

    await handler(mockRequest, mockResponse, mockContext);
  });
});
