import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';
import { getYamlContent, Logger, modifyProps } from '@serverless-devs/core';
import { get } from 'lodash';
import yaml from 'js-yaml';

const logger = new Logger('dk-deploy-common');

interface IOptions {
  codeUri: string;
  sourceCode: string;
  app?: { [key: string]: any };
}

async function generateTablestoreInitializer(options: IOptions) {
  logger.debug(`函数 generateTablestoreInitializer 入参: ${JSON.stringify(options, null, 2)}`);
  const { templateFile } = process.env;

  if (templateFile === 'null') return;
  const spath = path.join(path.resolve(templateFile, '..'), '.s');
  const filePath = path.join(spath, options.sourceCode, path.basename(options.codeUri));
  fs.copySync(options.codeUri, filePath);
  const { indexJs, configYml } = await insertTablestoreInitializer(options);
  if (indexJs) {
    const indexPath = path.join(filePath, `index.js`);
    fs.ensureFileSync(indexPath);
    fs.writeFileSync(indexPath, indexJs);
  }
  if (configYml) {
    const configPath = path.join(filePath, `config.yml`);
    fs.ensureFileSync(configPath);
    fs.writeFileSync(configPath, yaml.dump(configYml));
  }
}

// 修改index.js和config.yml内容，并返回
async function insertTablestoreInitializer(options: IOptions) {
  const { codeUri } = options;
  const filepath = path.resolve(codeUri);
  const indexPath = path.join(filepath, 'index.js');
  const content = fs.readFileSync(indexPath, 'utf8');
  const ast = parser.parse(content);
  const useTableStorePlugin = getUseTableStorePlugin(indexPath);
  const { useExportInitializer, initializerName } = useTableStore(ast);
  logger.debug(`${codeUri}/index.js文件是否使用tablestore: ${useTableStorePlugin}`);
  logger.debug(`${codeUri}/index.js文件是否已经导出初始化函数: ${useExportInitializer}`);
  if (useExportInitializer) {
    logger.debug(`${codeUri}/index.js文件导出初始化函数名称: ${initializerName}`);
  }
  if (!useTableStorePlugin) return { indexJs: content };
  const configYml = await insertTablestoreinitializerYml({ filepath, initializerName });
  logger.debug(`${codeUri}/config.yml: ${JSON.stringify(configYml, null, 2)}`);

  // 如果使用tablestore，检查role
  if (useTableStorePlugin) {
    await generateTablestoreRole(options);
  }

  // 如果使用tablestore但已经自定义initializer，直接返回原内容
  if (useTableStorePlugin && useExportInitializer) {
    return { configYml, indexJs: content };
  }
  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      const newImport = t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.memberExpression(t.identifier('exports'), t.identifier('initializer')),
          t.memberExpression(t.identifier('handler'), t.identifier('initializerHandler')),
        ),
      );
      body.splice(body.length - 1, 0, newImport);
    },
  });
  const newCode = generate(ast).code;
  const indexJs = prettier.format(newCode, {
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 100,
  });

  return { configYml, indexJs };
}

// 检查是否使用use tablestore
function getUseTableStorePlugin(indexPath: string) {
  const tablestoreRegx = /.use\(tablestoreInitialzerPlugin\(\)\)/g;
  const content = fs.readFileSync(indexPath, 'utf8');
  return tablestoreRegx.test(content);
}

// 检查是否已经export.initializer
function useTableStore(ast: t.File) {
  let icount = 0;
  let initializerName: string;
  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      body.forEach((item) => {
        // 是否已经export.initializer
        if (t.isExpressionStatement(item)) {
          if (t.isAssignmentExpression(item.expression)) {
            if (t.isMemberExpression(item.expression.right)) {
              if (t.isIdentifier(item.expression.right.object)) {
                item.expression.right.object.name === 'handler' && icount++;
              }
              if (t.isIdentifier(item.expression.right.property)) {
                if (item.expression.right.property.name === 'initializerHandler') {
                  icount++;
                  if (t.isMemberExpression(item.expression.left)) {
                    if (t.isIdentifier(item.expression.left.object)) {
                      if (item.expression.left.object.name === 'exports') {
                        icount++;
                        if (t.isIdentifier(item.expression.left.property)) {
                          initializerName = item.expression.left.property.name;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    },
  });
  return {
    useExportInitializer: icount === 3,
    initializerName,
  };
}

// config.yml配置初始化
async function insertTablestoreinitializerYml({ filepath, initializerName = 'initializer' }) {
  const configPath = path.join(filepath, 'config.yml');
  if (fs.existsSync(configPath)) {
    const result = await getYamlContent(configPath);
    if (!get(result, 'function.initializer')) {
      result.function.initializer = `index.${initializerName}`;
    }
    if (!get(result, 'function.initializationTimeout')) {
      result.function.initializationTimeout = 60;
    }
    return result;
  }
  return {
    function: {
      initializer: `index.${initializerName}`,
      initializationTimeout: 60,
    },
  };
}

// 检测 s.yml 是否存在 role
async function generateTablestoreRole(options: IOptions) {
  const { app } = options;
  if (!get(app, 'role')) {
    const { templateFile } = process.env;
    const spath = path.join(path.resolve(templateFile, '..'), '.s');
    const sspath = path.join(spath, path.basename(templateFile));
    fs.copyFileSync(templateFile, sspath);
    const content: any = await getYamlContent(templateFile);
    let appName: string;
    for (const key in content.services) {
      if (content.services[key].component.endsWith('jamstack-api')) {
        appName = key;
      }
    }
    await modifyProps(
      appName,
      {
        app: {
          ...app,
          role: {
            name: `fcdeploydefaultrole-${get(app, 'name')}`,
            policies: ['AliyunECSNetworkInterfaceManagementAccess', 'AliyunOTSFullAccess'],
          },
        },
      },
      sspath,
    );
  }
}

export = generateTablestoreInitializer;
