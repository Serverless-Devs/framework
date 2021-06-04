const path = require('path');
const core = require('@serverless-devs/core');
const express = require('express');
const app = express();
const router = express.Router();
const noop = () => {};
const logger = new core.Logger('sandbox');

interface IConfig {
  cwd?: string;
  port?: number;
}

const sandbox = async (config: IConfig = {}) => {
  const { cwd = process.cwd(), port = 3000 } = config;
  const currentPath = path.resolve(cwd);
  const content = await core.getYamlContent(path.join(currentPath, './s.yml'));
  if (!content) {
    throw new Error(`${cwd}路径下不存在s.yml文件`);
  }
  // 获取密钥
  let credentials = await core.getCredential(content.access);
  credentials = {
    accessKeyId: credentials.AccessKeyID,
    accessKeySecret: credentials.AccessKeySecret,
  };
  // 获取环境变量
  let environmentVariables = {};

  for (const key in content.services) {
    const { props } = content.services[key];
    // 读取通用配置
    const commonConfig = await core.getYamlContent(
      path.join(currentPath, props.sourceCode, './config.yml'),
    );
    environmentVariables = { ...environmentVariables, ...commonConfig.app.environmentVariables };
    // 读取单个配置
    for (const route of props.route) {
      const routeConfig = await core.getYamlContent(
        path.join(currentPath, props.sourceCode, route, './config.yml'),
      );
      environmentVariables = {
        ...environmentVariables,
        ...routeConfig.function.environmentVariables,
      };
    }
  }

  logger.debug(`环境变量environmentVariables： ${JSON.stringify(environmentVariables, null, 2)}`);

  // middleware that is specific to this router
  router.use(function (req, res, next) {
    process.env.FC_FUNC_CODE_PATH = 'true';
    for (const key in environmentVariables) {
      process.env[key] = environmentVariables[key];
    }
    next();
  });

  for (const key in content.services) {
    const { props } = content.services[key];
    for (const route of props.route) {
      logger.info(`http://localhost:${port}/api${route}`);
      router.all(route, function (req, res) {
        req.queries = req.query;
        const fileModule = require(path.join(currentPath, props.sourceCode, route));
        if (fileModule.initializer) {
          fileModule.initializer({ credentials }, noop);
        }
        fileModule.handler(req, res, { credentials });
      });
    }
  }

  app.use('/api', router);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = sandbox;
