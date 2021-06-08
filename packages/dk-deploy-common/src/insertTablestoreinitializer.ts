import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import get from 'lodash.get';

interface IOption {
  initializer?: string;
}
// 修改index.js和config.yml内容，并返回
function insertTablestoreinitializer(codeUri: string, option?: IOption) {
  const { initializer = 'initializer' } = option || {};
  const filepath = path.resolve(codeUri);
  const indexPath = path.join(filepath, 'index.js');
  const content = fs.readFileSync(indexPath, 'utf8');
  const ast = parser.parse(content);
  const { useTableStorePlugin, useExportInitializer, initializerName } = useTableStore(ast);
  const configYml = insertTablestoreinitializerYml({ filepath, initializerName });

  if (!useTableStorePlugin) return { configYml, indexJs: content };
  // 如果使用tablestore但已经自定义initializer，直接返回原内容
  if (useTableStorePlugin && useExportInitializer) return { configYml, indexJs: content };
  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      const newImport = t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.memberExpression(t.identifier('exports'), t.identifier(initializer)),
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

// 检查是否使用use(tablestore) 和是否已经export.initializer
function useTableStore(ast: t.File) {
  let icount = 0;
  let tcount = 0;
  let initializerName: string;
  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      body.forEach((item) => {
        // 是否使用tablestore
        if (t.isExpressionStatement(item)) {
          if (t.isCallExpression(item.expression)) {
            if (t.isMemberExpression(item.expression.callee)) {
              if (t.isIdentifier(item.expression.callee.property)) {
                if (item.expression.callee.property.name === 'use') {
                  tcount++;
                  item.expression.arguments.forEach((obj) => {
                    if (t.isCallExpression(obj)) {
                      if (t.isIdentifier(obj.callee)) {
                        if (obj.callee.name === 'tablestoreInitialzerPlugin') {
                          tcount++;
                        }
                      }
                    }
                  });
                }
              }
            }
          }
        }
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
    useTableStorePlugin: tcount === 2,
    useExportInitializer: icount === 3,
    initializerName,
  };
}

// config.yml配置初始化
function insertTablestoreinitializerYml({ filepath, initializerName }) {
  const configPath = path.join(filepath, 'config.yml');
  const result = yaml.load(fs.readFileSync(configPath, 'utf8'));
  if (!get(result, 'function.initializer')) {
    result.function.initializer = `index.${initializerName}`;
  }
  if (!get(result, 'function.initializationTimeout')) {
    result.function.initializationTimeout = 60;
  }
  return result;
}

export = insertTablestoreinitializer;
