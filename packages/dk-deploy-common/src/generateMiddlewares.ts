import * as parser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import fs from 'fs-extra';
import path from 'path';
import { getYamlContent, modifyProps } from '@serverless-devs/core';
import { get, concat, uniq } from 'lodash';

interface IOptions {
  codeUri: string;
  sourceCode: string;
  app?: { [key: string]: any };
}

const middlewares = [
  {
    name: 'cookiesMiddleware',
    policies: ['AliyunECSNetworkInterfaceManagementAccess', 'AliyunOTSFullAccess'],
  },
  {
    name: 'cookieSessionMiddleware',
    policies: ['AliyunECSNetworkInterfaceManagementAccess', 'AliyunOTSFullAccess'],
  },
];

async function generateMiddlewares(options: IOptions) {
  const { codeUri } = options;
  const filepath = path.resolve(codeUri);
  const indexPath = path.join(filepath, 'index.js');
  const content = fs.readFileSync(indexPath, 'utf8');
  const ast = parser.parse(content);

  traverse(ast, {
    Program({ node }) {
      const { body } = node;
      body.forEach((item) => {
        if (t.isExpressionStatement(item)) {
          if (t.isCallExpression(item.expression)) {
            if (t.isMemberExpression(item.expression.callee)) {
              if (t.isIdentifier(item.expression.callee.property)) {
                for (const mid of middlewares) {
                  if (item.expression.callee.property.name === 'use') {
                    item.expression.arguments.forEach(async (obj) => {
                      if (t.isCallExpression(obj)) {
                        if (t.isIdentifier(obj.callee)) {
                          if (obj.callee.name === mid.name) {
                            await generateRole(options, mid.policies);
                          }
                        }
                      }
                    });
                  }
                }
              }
            }
          }
        }
      });
    },
  });
}

async function generateRole(options: IOptions, policies) {
  const { app } = options;
  if (!get(app, 'role')) {
    const { templateFile } = process.env;
    const spath = path.join(path.resolve(templateFile, '..'), '.s');
    const sspath = path.join(spath, path.basename(templateFile));
    if (!fs.existsSync(sspath)) {
      fs.copyFileSync(templateFile, sspath);
    }
    const content = await getYamlContent(sspath);
    let appName: string;
    let sprops: object;
    for (const key in content.services) {
      if (content.services[key].component.endsWith('jamstack-api')) {
        appName = key;
        sprops = content.services[key].props;
      }
    }
    await modifyProps(
      appName,
      {
        app: {
          ...app,
          role: {
            name: `fcdeploydefaultrole-${get(app, 'name')}`,
            policies: getPolicies(sprops, policies),
          },
        },
      },
      sspath,
    );
  }
}

function getPolicies(sprops, policies) {
  const config = concat(get(sprops, 'app.role.policies', []), policies);
  return uniq(config);
}

export = generateMiddlewares;
