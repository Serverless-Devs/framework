import { generateTablestoreInitializer } from '../src/index';
import path from 'path';

describe('dk-deploy-common', () => {
  test('测试 generateTablestoreInitializer', async () => {
    const result = generateTablestoreInitializer(path.resolve(__dirname, './src/index'));
    // console.log(result)
    expect(result).toBeTruthy();
  });
});
