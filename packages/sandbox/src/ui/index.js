const { dk } = require('@serverless-devs/dk');
const fs = require('fs-extra');
const path = require('path');

const baseHandler = () => {
  const filePath = path.resolve(__dirname, './index.html');
  return { html: fs.readFileSync(filePath, 'utf8') };
};

const handler = dk(baseHandler);

exports.handler = handler;
