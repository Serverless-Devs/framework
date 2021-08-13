import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { Logger } from '@serverless-devs/core';
import path from 'path';
import fs from 'fs-extra';

const logger = new Logger('dk-deploy-common');
interface IOptions {
  route: string;
  sourceCode: string;
  cwd?: string;
}
async function generateGithub(options: IOptions) {
  logger.debug(`函数 generateGithub 入参: ${JSON.stringify(options, null, 2)}`);
  const { route, cwd = process.cwd(), sourceCode } = options;
  const sourceCodePath = path.join(cwd, '.s', sourceCode);


  const indexRoute = route === '/' ? '/index' : route;
  const filepath = path.join(sourceCodePath, indexRoute);
  return await insertGithub({ filepath });
}


// 读取 index.js 下的 http api
const insertGithub = async ({ filepath }) => {
  logger.debug(`函数 insertSwaggerUI 解析：${filepath}`);

  const indexPath = path.join(filepath, 'index.js');
  const content = fs.readFileSync(indexPath, 'utf8');
  const ast = parser.parse(content);

  let hasGithub;
  traverse(ast, {
    VariableDeclarator: ({ node }) => {
      if (t.isObjectPattern(node.id) && t.isCallExpression(node.init)) {
        const { properties } = node.id
        for (const item of properties) {
          if (t.isProperty(item) && t.isIdentifier(item.key, { name: 'github' })) {
            hasGithub = true;
          }
        }
      }
    },
  });
  return hasGithub;
};

export = generateGithub;
