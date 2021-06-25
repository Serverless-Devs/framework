const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');
const core = require('@serverless-devs/core');
const express = require('express');
const { portIsOccupied } = require('@serverless-devs/dk-util');
const bodyParser = require('body-parser');
const open = require('open');
const { getYamlPath, getTemplatekey, getAllCredentials, replaceFun } = require('./utils');
const app = express();
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const logger = new core.Logger('dk-init');

const dkInit = async () => {
  const args = minimist(process.argv.slice(2));
  const currentPath = process.cwd();
  let port = args.p || args.port || 3000;
  port = await portIsOccupied(port);
  const spath = getYamlPath(currentPath, 's');
  if (!spath) {
    return logger.debug(`${currentPath} 路径下不存在 s.[yml | yaml] 文件`);
  }

  const templateKeys = [];
  // s.yml
  const sContent = fs.readFileSync(spath, 'utf8');
  const sKeys = getTemplatekey(sContent);

  sKeys.forEach((item) => {
    if (item) {
      templateKeys.push({ ...item, type: 's' });
    }
  });
  // .env.example
  const envExampleFilePath = path.resolve(currentPath, '.env.example');
  let envContent = {};
  if (fs.existsSync(envExampleFilePath)) {
    envContent = fs.readFileSync(envExampleFilePath, 'utf8');
    const envKeys = getTemplatekey(envContent);
    envKeys.forEach((item) => {
      if (item) {
        templateKeys.push({ ...item, type: 'env' });
      }
    });
  } else {
    logger.debug(`${currentPath} 路径下不存在 .env.example 文件`);
  }
  logger.debug(`获取到的变量信息： ${JSON.stringify(templateKeys, null, 2)}`);
  if (templateKeys.length === 0) return;
  app.get('/', async (req, res) => {
    const accessList = await getAllCredentials();
    logger.debug(`获取所有的密钥： ${JSON.stringify(accessList, null, 2)}`);
    res.render('index', {
      templateKeys: JSON.stringify(templateKeys),
      port,
      accessList: JSON.stringify(accessList),
    });
  });

  app.post('/api', async (req, res) => {
    logger.debug(`/api接口接收的参数： ${JSON.stringify(req.body, null, 2)}`);
    try {
      const { sconfig, envconfig } = req.body;
      if (sconfig) {
        const result = replaceFun(sContent, sconfig);
        fs.writeFileSync(spath, result);
      }
      if (envconfig) {
        const result = replaceFun(envContent, envconfig);
        fs.unlink(envExampleFilePath);
        fs.writeFileSync(path.resolve(currentPath, '.env'), result);
      }
      res.send({
        code: 200,
        success: true,
        data: req.body,
        message: '项目初始化成功, 3s之后将会关闭当前服务',
      });
      setTimeout(() => {
        process.exit(1);
      }, 3000);
    } catch (error) {
      res.send({
        code: 200,
        success: false,
        data: req.body,
        message: '项目初始化失败',
      });
    }
  });

  app.listen(port, () => {
    console.log(`the server listening at http://localhost:${port}`);
    open(`http://localhost:${port}`);
  });
};

dkInit();
module.exports = path.resolve(__dirname, './index.js');
