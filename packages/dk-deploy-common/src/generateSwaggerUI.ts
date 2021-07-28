import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { Logger } from '@serverless-devs/core';
import path from 'path';
import fs from 'fs-extra';
import { get, includes, split, set } from 'lodash';

const logger = new Logger('dk-deploy-common');
interface IOptions {
  routes: string;
  sourceCode: string;
  cwd?: string;
  pathUrl: string;
}
interface IUiJson {
  tags?: string[];
  paths?: { [key: string]: any };
}

async function generateSwaggerUI(options: IOptions) {
  logger.debug(`函数 generateSwaggerUI 入参: ${JSON.stringify(options, null, 2)}`);
  const { routes, cwd = process.cwd(), sourceCode, pathUrl } = options;
  const sourceCodePath = path.join(cwd, '.s', sourceCode);

  await ui({
    sourceCode,
    cwd,
    pathUrl,
  });

  for (const route of routes) {
    const indexRoute = route === '/' ? '/index' : route;
    const filepath = path.join(sourceCodePath, indexRoute);
    const uiJson = await insertSwaggerUI({ filepath, indexRoute });
    if (!Object.keys(uiJson).length) continue;
    const paths = get(uiJson, 'paths', {});
    const tags = get(uiJson, 'tags', []);
    const dbJSON = fs.readJsonSync(path.join(sourceCodePath, 'ui/db.json'));
    dbJSON.paths = Object.assign({}, dbJSON.paths, paths);
    dbJSON.tags = [...dbJSON.tags, ...tags];
    fs.outputJsonSync(path.join(sourceCodePath, 'ui/db.json'), dbJSON);
  }
}

// 修改 index.html, db.json
const ui = ({ sourceCode, cwd, pathUrl }) => {
  const sourceCodePath = path.join(cwd, '.s', sourceCode);
  let html = fs.readFileSync(path.join(sourceCodePath, 'ui/index.html'), 'utf8');
  html = html.replace('https://petstore.swagger.io/v2/swagger.json', `${pathUrl}/db.json`);
  fs.outputFileSync(path.join(sourceCodePath, 'ui/index.html'), html, 'utf8');
  const uiJson = fs.readJsonSync(path.join(sourceCodePath, 'ui/db.json'));
  const [, host] = split(pathUrl, '://');
  uiJson.host = host;
  fs.outputJsonSync(path.join(sourceCodePath, 'ui/db.json'), uiJson);
};

// 读取 index.js 下的 http api
const insertSwaggerUI = async ({ filepath, indexRoute }) => {
  logger.debug(`函数 insertSwaggerUI 解析：${filepath}`);

  const indexPath = path.join(filepath, 'index.js');
  const content = fs.readFileSync(indexPath, 'utf8');
  const ast = parser.parse(content);

  let httpApiName = '';
  let dkArguments = {};
  let uiJson = {};
  traverse(ast, {
    CallExpression({ node }) {
      if (t.isIdentifier(node.callee, { name: 'dk' }) && node.arguments && node.arguments.length) {
        dkArguments = node.arguments[0];
      }
    },
  });

  if (t.isIdentifier(dkArguments)) {
    httpApiName = dkArguments.name;
    if (!httpApiName) return uiJson;
    traverse(ast, {
      VariableDeclarator({ node }) {
        if (t.isIdentifier(node.id, { name: httpApiName }) && t.isObjectExpression(node.init)) {
          const { properties: apiObj } = node.init;
          uiJson = mapApi(apiObj, indexRoute);
        }
      },
    });
  } else if (t.isObjectExpression(dkArguments)) {
    const { properties: apiObj } = dkArguments;
    uiJson = mapApi(apiObj, indexRoute);
  }

  logger.debug(`函数 insertSwaggerUI 解析结果：${JSON.stringify(uiJson)}`);

  return uiJson;
};

const mapApi = (apiObj, indexRoute): IUiJson => {
  const paths = {};
  const tags = [];
  apiObj.forEach((api) => {
    // 单行模式
    if (
      t.isObjectProperty(api) &&
      t.isStringLiteral(api.key) &&
      (t.isArrowFunctionExpression(api.value) || t.isFunctionExpression(api.value))
    ) {
      const [apiMethod, apiKey] = split(api.key.value, ' ');
      if (!apiMethod || !apiKey) return;
      if (!includes(tags, indexRoute)) {
        tags.push(indexRoute);
      }
      // const hasBody = includes(['post', 'patch', 'put'], apiMethod.toLowerCase());
      // let parameters = [];
      // if (hasBody) {
      //   parameters = [
      //     {
      //       "in": "body",
      //       "name": "body",
      //       "description": "body 数据",
      //       "required": false,
      //       "schema": {
      //         "$ref": "#/definitions/DefaultBody"
      //       }
      //     }
      //   ]
      // };
      set(paths, `${apiKey}.${apiMethod.toLowerCase()}`, {
        tags: [indexRoute],
        operationId: `${apiMethod.toLowerCase()}-${apiKey}`,
        summary: '标题title',
        description: '描述',
        parameters: [],
        produces: ['application/json', 'application/xml'],
        responses: {},
      });
    }
    // 对象型
    if (t.isObjectProperty(api) && t.isStringLiteral(api.key) && t.isObjectExpression(api.value)) {
      const apiKey = api.key.value;
      if (!includes(tags, indexRoute)) {
        tags.push(indexRoute);
      }
      const { properties: methodObj } = api.value;
      methodObj.forEach((method) => {
        if (
          t.isObjectProperty(method) &&
          t.isIdentifier(method.key) &&
          (t.isArrowFunctionExpression(method.value) || t.isFunctionExpression(method.value))
        ) {
          const apiMethod = get(method.key, 'name');
          // const hasBody = includes(['post', 'patch', 'put'], apiMethod.toLowerCase());
          // let parameters = [];
          // if (hasBody) {
          //   parameters = [
          //     {
          //       "in": "body",
          //       "name": "body",
          //       "description": "body 数据",
          //       "required": true,
          //       "schema": {
          //         "$ref": "#/definitions/DefaultBody"
          //       }
          //     }
          //   ]
          // };
          set(paths, `${apiKey}.${apiMethod.toLowerCase()}`, {
            tags: [indexRoute],
            operationId: `${apiMethod.toLowerCase()}-${apiKey}`,
            summary: '标题title',
            description: '描述',
            parameters: [],
            produces: ['application/json', 'application/xml'],
            responses: {},
          });
        }
      });
    }
  });
  return { paths, tags };
};

export = generateSwaggerUI;
