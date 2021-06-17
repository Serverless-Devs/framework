import { generateTablestoreInitializer } from '@serverless-devs/dk-deploy-common';
import fs from 'fs-extra';
import path from 'path';
import { getYamlContent, getCredential, Logger } from '@serverless-devs/core';
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const router = express.Router();
const noop = () => {};
const logger = new Logger('sandbox');

interface IConfig {
  cwd?: string;
  port?: number;
}

const sandbox = async (config: IConfig = {}) => {
  const result = dotenv.config();
  if (result.parsed) {
    logger.debug(`获取env文件的环境变量: ${JSON.stringify(result.parsed, null, 2)}`);
  }

  const { cwd = path.resolve('..'), port = 3000 } = config;
  const currentPath = path.resolve(cwd);
  const content = await getYamlContent(path.join(currentPath, './s.yml'));
  if (!content) {
    throw new Error(`${cwd}路径下不存在s.yml文件`);
  }
  // 获取密钥
  let credentials = await getCredential(content.access);
  credentials = {
    accessKeyId: credentials.AccessKeyID,
    accessKeySecret: credentials.AccessKeySecret,
  };

  // middleware that is specific to this router
  router.use(function (req, res, next) {
    process.env.FC_FUNC_CODE_PATH = 'true';

    next();
  });

  for (const key in content.services) {
    const { props } = content.services[key];
    const { sourceCode } = props;
    fs.ensureSymlinkSync(
      path.resolve(sourceCode, 'node_modules'),
      path.resolve('.s', sourceCode, 'node_modules'),
    );

    for (const route of props.route) {
      const indexRoute = route === '/' ? '/index' : route;
      logger.info(`http://localhost:${port}${route}`);
      const sourceCodePath = path.resolve(props.sourceCode);
      const codeUri = path.join(sourceCodePath, indexRoute);
      await generateTablestoreInitializer({ codeUri, sourceCode: props.sourceCode });
      router.all(route, function (req, res) {
        req.queries = req.query;
        const fileModule = require(path.join(currentPath, '.s', props.sourceCode, indexRoute));
        if (fileModule.initializer) {
          fileModule.initializer({ credentials }, noop);
        }
        fileModule.handler(req, res, { credentials });
      });
    }
  }

  app.use('/', router);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = sandbox;
