
const express = require('express');
const path = require('path');
const fs = require('fs-extra');

const router = express.Router();

const basePath = path.join(process.cwd(), './functions');
const files = fs.readdirSync(basePath, 'utf8');

for (const filePath of files) {
  const file = path.join(basePath, filePath);
  const fileName = path.basename(file, path.extname(file))

  router.all(`/${fileName}`, (req, res) => {
    const fileModule = require(file);
    if (fileModule.handler) {
      fileModule.handler(req, res);
    }

    if (fileModule.initializer) {
      fileModule.initializer(req, res);
    }
  });
}

module.exports = router;
