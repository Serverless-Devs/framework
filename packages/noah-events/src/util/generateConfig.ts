/**
 * 生成config文件
 * config文件 按照规范是在和当前文件同级的地方。
 * - config.yml
 * - index.js
 */

/**
 *  config.yml 配置如下
 ```
 function:
 runtime: nodejs12
 # memory: 1152
 # timeout: 60
 # concurrency: 1
 oss:
 bucketName: my-bukect
 events:
 - oss:ObjectCreated:*
 - oss:ObjectRemoved:DeleteObject
 filter:
 Key:
 Prefix: source/
 Suffix: .png
 ```
 如果代码和配置文件同时，这时候配置文件会优先于代码。
 */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

type ConfigType = 'oss';
export const generateConfig = (type: ConfigType, args: any) => {
  console.log(args);
  const filePath = path.resolve(process.cwd(), 'config.yml');
  if (!fs.existsSync(filePath)) {
    throw new Error(`${process.cwd()}路径下不存在config.yml文件`);
  }
  const content = yaml.load(fs.readFileSync(filePath, 'utf8'));
  console.log(content);
  // 写入oss配置
  if (type === 'oss') {
    content.oss = {
      bucketName: args.bucketName,
      events: args.events,
    };
    if (args.filterPrefix && args.filterSuffix) {
      content.oss.filter = {
        key: {
          Prefix: args.filterPrefix,
          Suffix: args.filterSuffix,
        },
      };
    }
    fs.writeFileSync(filePath, yaml.dump(content));
  }
};
