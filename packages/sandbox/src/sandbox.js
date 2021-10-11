const fs = require('fs-extra');
const path = require('path');
const core = require('@serverless-devs/core');
const express = require('express');
const { portIsOccupied } = require('@serverless-devs/dk-util');
const app = express();
const get = require('lodash.get');

const sandbox = async () => {
  const args = process.env;
  let port = args.p || args.port || 7001;
  port = await portIsOccupied(port);
  const cwd = path.resolve('..');
  const currentPath = path.resolve(cwd);
  const spath = path.join(currentPath, './s.yml');
  const content = await core.getYamlContent(spath);

  if (!content) {
    throw new Error(`${cwd}路径下不存在s.[yaml|yml]文件`);
  }

  process.env.templateFile = path.join(currentPath, fs.existsSync(spath) ? './s.yml' : './s.yaml');

  // 获取密钥
  let credentials = await core.getCredential(content.access);
  credentials = {
    accessKeyId: credentials.AccessKeyID,
    accessKeySecret: credentials.AccessKeySecret,
  };

  const findKey = args.projectName || Object.keys(content.services)[0];
  const { props } = content.services[findKey];
  const environmentVariables = get(props, 'function.environmentVariables', {});

  // 添加环境变量
  for (const i in environmentVariables) {
    process.env[i] = environmentVariables[i]
  }
  // todo 暂时用的是 devsapp/fc 组件，后续用jamstack-api 后 codeUri 需要改成 sourceCode
  const { codeUri } = props.function;
  fs.ensureSymlinkSync(
    path.join(currentPath, codeUri),
    path.join(currentPath, '.s', codeUri),
  );

  /**
   * 启动服务
   */
  app
    .use((req, res, next) => {
      process.env.FC_FUNC_CODE_PATH = 'true';
      next();
    })
    .use('/', async (req, res) => {
      const fileModule = require(path.join(currentPath, '.s', codeUri, '/index'));
      const context = { credentials };
      if (fileModule.initializer) {
        await fileModule.initializer(context, () => { });
      }
      fileModule.handler(req, res, context);
    });
  app.listen(port, () => {
    const url = `http://localhost:${port}`
    console.log(`the server listening at ${url}`);
  });
};

sandbox();
