import { github } from '../src';

describe('github 测试', () => {
  test('github.onEvent 测试', async () => {
    github.onEvent({
      handler: (ctx) => {
        return { json: { a: ctx.req.github } }
      },
      config: {
        path: '/webhooks',
        secret: 'my_secret'
      },
    });
  });
});
