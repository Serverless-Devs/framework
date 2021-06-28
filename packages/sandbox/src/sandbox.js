const { generateTablestoreInitializer, getEnvs, generateSwaggerUI } = require('@serverless-devs/dk-deploy-common');
const fs = require('fs-extra');
const path = require('path');
const core = require('@serverless-devs/core');
const express = require('express');
const { portIsOccupied } = require('@serverless-devs/dk-util');
const app = express();
const router = express.Router();
const noop = () => { };
const logger = new core.Logger('sandbox');

const sandbox = async () => {

  const args = process.env;
  let port = args.p || args.port || 3000;
  port = await portIsOccupied(port);

  const cwd = path.resolve('..');
  getEnvs({ path: path.resolve('..', '.env') });
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

  // middleware that is specific to this router
  router.use(function(req, res, next) {
    process.env.FC_FUNC_CODE_PATH = 'true';

    next();
  });
  const findKey = args.projectName || Object.keys(content.services)[0];
  const { props } = content.services[findKey];
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

    router.all(route, function(req, res) {
      req.queries = req.query;
      const fileModule = require(path.join(currentPath, '.s', props.sourceCode, indexRoute));
      if (fileModule.initializer) {
        fileModule.initializer({ credentials }, noop);
      }
      fileModule.handler(req, res, { credentials });
    });
  }

  /** 创建 UI 配置 --- 开始 */
  const uiSourcePath = path.join(currentPath, '.s', props.sourceCode, 'ui');
  fs.copySync(
    path.resolve(__dirname, `ui`),
    path.join(uiSourcePath),
  )
  await generateSwaggerUI({
    routes: props.route,
    sourceCode: props.sourceCode,
    cwd: currentPath,
    port,
  });
  const dbJson = fs.readJsonSync(path.join(uiSourcePath, 'db.json'));
  // 判断是否存在 http api，存在的话，才添加 ui 路由
  if (Object.keys(dbJson.paths)) {
    logger.info(`http://localhost:${port}/ui`);
    app.get('/db.json', (req, res) => {
      res.json(dbJson);
    });
    router.all('/ui', (req, res) => {
      const fileModule = require(uiSourcePath);
      fileModule.handler(req, res, { credentials });
    });
  }
  /** 创建 UI 配置 --- 结束 */


  app.use('/', router);

  app.listen(port, () => {
    console.log(`the server listening at http://localhost:${port}`);
  });
};

sandbox();
