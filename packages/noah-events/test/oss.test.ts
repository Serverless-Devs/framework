import { oss } from '../src';

describe('oss测试', () => {
  test('onObjectCreated 测试', async () => {
    oss.onObjectCreated({
      bucketName: 'my-bukect-01',
      handler: (request) => {
        return {
          success: 'true',
        };
      },
      filter: {
        prefix: 'source/',
        suffix: '.png',
        target: 'target/',
      },
    });
  });
  // test('onObjectRemoved 测试', async () => {
  //   oss.onObjectRemoved({
  //     bucketName: 'my-bukect-01',
  //     handler: (request) => {
  //       return {
  //         success: 'true',
  //       };
  //     },
  //   });
  // });
});
