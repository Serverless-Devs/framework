import fs from 'fs-extra';
import path from 'path';
import { getYamlContent, modifyProps } from '@serverless-devs/core';
import { get, concat, uniq } from 'lodash';

interface IOptions {
  codeUri: string;
  sourceCode: string;
  app: { [key: string]: any };
}

async function generateOssEvent(options: IOptions) {
  const { templateFile } = process.env;
  if (templateFile === 'null') return;
  const { app } = options;
  const spath = path.join(path.resolve(templateFile, '..'), '.s');
  const filePath = path.join(spath, options.sourceCode, path.basename(options.codeUri));
  const configPath = path.join(filePath, 'config.yml');
  if (fs.existsSync(configPath)) {
    const configContent = await getYamlContent(configPath);
    if (configContent.hasOwnProperty('oss') && !get(app, 'role')) {
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
              policies: getPolicies(sprops),
            },
          },
        },
        sspath,
      );
    }
  }
}

function getPolicies(sprops) {
  const policies = concat(get(sprops, 'app.role.policies', []), [
    'AliyunECSNetworkInterfaceManagementAccess',
    'AliyunOSSFullAccess',
  ]);
  return uniq(policies);
}

export = generateOssEvent;
