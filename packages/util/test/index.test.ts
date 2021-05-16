import { isPlainObject } from '../src/index';

describe('工具函数测试', () => {
  test('测试 isPlainObject', async () => {
    expect(isPlainObject({})).toBeTruthy();
  });
});
