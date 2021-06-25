const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const core = require('@serverless-devs/core');

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
      const defaultValueForReg = /\((.*?)\)/g;
      let defaultValue = name.match(defaultValueForReg);
      if (defaultValue) {
        defaultValue = defaultValue[0];
        name = name.replace(defaultValue, '');
      }
      return {
        defaultValue: defaultValue ? defaultValue.replace(/\(|\)/g, '') : undefined,
        name: name?.trim(),
        desc: desc ? 'please input' + desc?.trim() : undefined,
      };
    });
}

async function getAllCredentials() {
  const accessFilePath = path.join(os.homedir(), '.s', 'access.yaml');
  const result = await core.getYamlContent(accessFilePath);
  return result ? Object.keys(result) : [];
}

function replaceFun(str, obj) {
  const reg = /\{\{(.*?)\}\}/g;
  let arr = str.match(reg);
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      let keyContent = arr[i].replace(/{{|}}/g, '');
      let realKey = keyContent.split('|')[0];
      realKey = realKey?.trim();
      if (obj[realKey]) {
        str = str.replace(arr[i], obj[realKey]);
      }
    }
  }

  return str;
}

module.exports = {
  getYamlPath,
  getTemplatekey,
  getAllCredentials,
  replaceFun,
};
