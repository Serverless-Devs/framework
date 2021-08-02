import generateTablestoreInitializer from './generateTablestoreInitializer';
import generateOssEvent from './generateOssEvent';
import { each } from 'lodash';

interface IOptions {
  codeUri: string;
  sourceCode: string;
  app: { [key: string]: any };
}
async function generateFile(options: IOptions) {
  const middlewares = [generateTablestoreInitializer, generateOssEvent];
  each(middlewares, async (item) => {
    await item(options);
  });
}

export = generateFile;
