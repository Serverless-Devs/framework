import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import prettier from 'prettier';
import fs from 'fs-extra';
import path from 'path';

interface IOption {
  initializer?: string;
}
function insertTablestoreinitializer(codeUri: string, option?: IOption) {
  const { initializer = 'initializer' } = option || {};
  const filepath = path.resolve(codeUri);
  const content = fs.readFileSync(path.join(filepath, 'index.js'), 'utf8');
  const ast = parser.parse(content);
  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      body.forEach((item) => {
        if (t.isExpressionStatement(item)) {
          if (t.isCallExpression(item.expression)) {
            if (t.isMemberExpression(item.expression.callee)) {
              if (t.isIdentifier(item.expression.callee.property)) {
                if (item.expression.callee.property.name === 'use') {
                  item.expression.arguments.forEach((obj) => {
                    if (t.isCallExpression(obj)) {
                      if (t.isIdentifier(obj.callee)) {
                        if (obj.callee.name === 'tablestoreInitialzerPlugin') {
                          const newImport = t.expressionStatement(
                            t.assignmentExpression(
                              '=',
                              t.memberExpression(
                                t.identifier('exports'),
                                t.identifier(initializer),
                              ),
                              t.memberExpression(
                                t.identifier('handler'),
                                t.identifier('initializerHandler'),
                              ),
                            ),
                          );
                          body.splice(body.length - 1, 0, newImport);
                        }
                      }
                    }
                  });
                }
              }
            }
          }
        }
      });
    },
  });
  const newCode = generate(ast).code;
  return prettier.format(newCode, {
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 100,
  });
}

export = insertTablestoreinitializer;
