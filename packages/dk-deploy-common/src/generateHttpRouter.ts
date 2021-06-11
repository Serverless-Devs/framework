import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { Logger, getYamlContent } from '@serverless-devs/core';
import { transformCodeUriToS } from './utils';

const logger = new Logger('dk-deploy-common');

interface IOptions {
  codeUri: string;
  routePath: string;
  projectName: string;
}

async function generateHttpRouter(options: IOptions) {
  logger.debug(`函数 generateHttpRouter 入参: ${JSON.stringify(options, null, 2)}`);
  const { codeUri, routePath, projectName } = options;
  const filePath = transformCodeUriToS(codeUri);
  const indexPath = path.join(filePath, 'index.js');
  logger.debug(`indexPath ${indexPath}`);
  const content = fs.readFileSync(indexPath, 'utf8');
  const ast = parser.parse(content);
  const bolList = [];
  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      body.forEach((item) => {
        if (t.isVariableDeclaration(item)) {
          item.declarations?.forEach((declarations) => {
            if (t.isVariableDeclarator(declarations)) {
              if (t.isCallExpression(declarations.init)) {
                if (t.isIdentifier(declarations.init.callee)) {
                  // dk
                  if (declarations.init.callee.name === 'dk') {
                    declarations.init.arguments?.forEach((arg) => {
                      bolList.push(t.isObjectExpression(arg));
                    });
                  }
                }
                if (t.isMemberExpression(declarations.init.callee)) {
                  // http
                  const http = declarations.init.callee.object;
                  const onRequest = declarations.init.callee.property;
                  if (t.isIdentifier(http) && t.isIdentifier(onRequest)) {
                    if (http.name === 'http' && onRequest.name === 'onRequest') {
                      declarations.init.arguments?.forEach((arg) => {
                        // arg为object, 则判断object.handler
                        if (t.isObjectExpression(arg)) {
                          arg.properties?.forEach((properties) => {
                            if (t.isObjectProperty(properties)) {
                              if (t.isIdentifier(properties.key)) {
                                if (properties.key.name === 'handler') {
                                  bolList.push(t.isObjectExpression(properties.value));
                                }
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      });
    },
  });
  const filterList = bolList.filter((item) => item);
  if (filterList.length === 0) return;
  const sYmlName = checkYml();
  const spath = path.resolve('./.s', sYmlName);
  if (!fs.existsSync(spath)) {
    fs.copyFileSync(path.resolve(sYmlName), spath);
  }
  const sYmlContent = await getYamlContent(spath);
  const route = sYmlContent.services[projectName].props.route;
  const insertRoute = `/${routePath}/*`;
  if (!route.includes(insertRoute)) {
    sYmlContent.services[projectName].props.route = route.concat(`/${routePath}/*`);
    fs.writeFileSync(spath, yaml.dump(sYmlContent));
  }
}

function checkYml() {
  return fs.existsSync(path.resolve('s.yml')) ? 's.yml' : 's.yaml';
}

export = generateHttpRouter;
