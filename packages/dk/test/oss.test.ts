import { oss } from '../src';

describe('oss测试', () => {
  test('onObjectCreated 测试', async () => {
    oss.onObjectCreated({
      handler: (ctx) => {
        console.log(ctx.event);
      },
      oss: {
        bucketName: 'my-bukect-01',
        filter: {
          prefix: 'source/',
          suffix: '.png',
        },
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
