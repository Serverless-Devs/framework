import { http } from '../src';

describe('http测试', () => {
  test('onRequest 事件', async () => {
    http.onRequest();
  });
});
