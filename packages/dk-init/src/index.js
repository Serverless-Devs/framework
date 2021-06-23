const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');
const core = require('@serverless-devs/core');
const express = require('express');
const { portIsOccupied } = require('@serverless-devs/dk-util');
const { getYamlPath, getTemplatekey, getAllCredentials } = require('./utils');
const os = require('os');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const noop = () => {};
const logger = new core.Logger('sandbox');

const sandbox = async () => {
  const args = minimist(process.argv.slice(2));
  const cwd = process.cwd();
  let port = args.p || args.port || 3000;
  port = await portIsOccupied(port);
  console.log(port);
  const spath = getYamlPath(cwd, 's');
  console.log(spath);
  if (!spath) return;

  const templateKeys = [];
  // s.yml
  const sKeys = getTemplatekey(fs.readFileSync(spath, 'utf-8'));
  sKeys.forEach((item) => {
    if (item) {
      templateKeys.push({ ...item, type: 's' });
    }
  });
  // .env.example
  const envExampleFilePath = path.resolve(cwd, '.env.example');
  if (!fs.existsSync(envExampleFilePath)) return;
  const envKeys = getTemplatekey(fs.readFileSync(envExampleFilePath, 'utf-8'));

  envKeys.forEach((item) => {
    if (item) {
      templateKeys.push({ ...item, type: 'env' });
    }
  });
  if (templateKeys.length === 0) return;
  app.get('/', async (req, res) => {
    const accessList = await getAllCredentials();
    res.render('index', {
      templateKeys: JSON.stringify(templateKeys),
      port,
      accessList: JSON.stringify(accessList),
    });
  });

  app.listen(port, () => {
    console.log(`the server listening at http://localhost:${port}`);
  });
};

sandbox();
