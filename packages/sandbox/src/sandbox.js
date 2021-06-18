const { generateTablestoreInitializer, getEnvs } = require('@serverless-devs/dk-deploy-common');
const fs = require('fs-extra');
const path = require('path');
const core = require('@serverless-devs/core');
const express = require('express');
const app = express();
const router = express.Router();
const noop = () => {};
const logger = new core.Logger('sandbox');

const sandbox = async () => {
  const cwd = path.resolve('..');
  const port = 3000;
  getEnvs({ path: path.resolve('..', '.env') });
  const currentPath = path.resolve(cwd);
  const content = await core.getYamlContent(path.join(currentPath, './s.yml'));
  if (!content) {
    throw new Error(`${cwd}路径下不存在s.yml文件`);
  }
  // 获取密钥
  let credentials = await core.getCredential(content.access);
  console.log(credentials);

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
      path.join(currentPath, sourceCode, 'node_modules'),
      path.join(currentPath, '.s', sourceCode, 'node_modules'),
    );

    for (const route of props.route) {
      const indexRoute = route === '/' ? '/index' : route;
      logger.info(`http://localhost:${port}${route}`);
      const sourceCodePath = path.join(currentPath, props.sourceCode);
      const codeUri = path.join(sourceCodePath, indexRoute);
      await generateTablestoreInitializer({
        codeUri,
        sourceCode: props.sourceCode,
        cwd: currentPath,
      });
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

sandbox();
