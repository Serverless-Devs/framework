import { generateTablestoreInitializer } from '../src/index';
import path from 'path';

describe('dk-deploy-common', () => {
  test('测试 generateTablestoreInitializer', async () => {
    const result = generateTablestoreInitializer({
      codeUri: path.resolve(__dirname, 'functions/index'),
      sourceCode: 'functions',
      cwd: path.resolve(process.cwd(), 'test'),
      app: {},
    });
    expect(result).toBeTruthy();
  });
});
