import { generateTablestoreInitializer } from '../src/index';
import path from 'path';

describe('dk-deploy-common', () => {
  test('测试 generateTablestoreInitializer', async () => {
    const result = generateTablestoreInitializer({
      codeUri: path.resolve(__dirname, 'functions/index'),
      sourceCode: 'functions',
      app: {},
    });
    expect(result).toBeTruthy();
  });
});
