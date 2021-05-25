import { http } from '../src';

describe('http测试', () => {
  test('onRequest 事件', async () => {
    http.onRequest({
      handler: (request) => {
        console.log(request);
        return {
          json: { result: 'ok' },
        };
      },
    });
  });
});
