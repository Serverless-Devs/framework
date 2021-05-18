import { oss } from '../src';

describe('事件函数', () => {
  test('测试OSS 事件', async () => {
    oss.onObjectCreated({
      bucketName: 'my-bukect',
      handler: (request) => {
        return {
          success: 'true',
        };
      },
      filterPrefix: 'source/',
      filterSuffix: '.png',
    });
  });
});
