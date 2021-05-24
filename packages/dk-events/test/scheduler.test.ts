import { scheduler } from '../src';

describe('scheduler测试', () => {
  test('onScheduler 事件', async () => {
    scheduler.onScheduler({
      cronExpression: '0 0 8 * * *',
      enable: true,
      payload: 'awesome-fc',
    });
  });
});
