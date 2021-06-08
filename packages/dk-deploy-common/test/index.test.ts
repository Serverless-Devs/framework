import { insertTablestoreinitializer } from '../src/index';
import path from 'path';

describe('dk-deploy-common', () => {
  test('测试 insertTablestoreinitializer', async () => {
    const result = insertTablestoreinitializer(path.resolve(__dirname, './src/index'));
    // console.log(result)
    expect(result).toBeTruthy();
  });
});
