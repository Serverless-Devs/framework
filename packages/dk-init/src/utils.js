const path = require('path');
const fs = require('fs-extra');

const getYamlPath = (prePath, name) => {
  const S_PATH1 = path.join(prePath, `${name}.yaml`);
  const S_PATH2 = path.join(prePath, `${name}.yml`);

  const S_PATH = fs.existsSync(S_PATH1) ? S_PATH1 : fs.existsSync(S_PATH2) ? S_PATH2 : undefined;
  return S_PATH;
};

function getTemplatekey(str) {
  const reg = /\{\{(.*?)\}\}/g;
  const arr = str.match(reg);
  if (!arr) {
    return [];
  }
  return arr
    .filter((result) => result)
    .map((matchValue) => {
      let keyContent = matchValue.replace(/{{|}}/g, '');
      let [name, desc] = keyContent.split('|');
      return {
        name: name?.trim(),
        desc: desc?.trim(),
      };
    });
}

module.exports = {
  getYamlPath,
  getTemplatekey,
};