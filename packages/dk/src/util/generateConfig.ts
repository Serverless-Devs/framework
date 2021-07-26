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

type ConfigType = 'oss' | 'http' | 'scheduler';
export const generateConfig = (type: ConfigType, args: any) => {
  const filePath = path.resolve(process.cwd(), 'config.yml');
  fs.ensureFileSync(filePath);
  const content = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
  // oss配置
  if (type === 'oss') {
    const { oss } = args;
    oss.filter = {
      Key: {
        Prefix: oss.filter.prefix,
        Suffix: oss.filter.suffix,
      },
    };
    content.oss = oss;
  }
  // http配置
  if (type === 'http') {
    content.http = args.http;
  }

  // scheduler配置
  if (type === 'scheduler') {
    content.scheduler = args.scheduler;
  }

  // 配置写入config.yml文件
  fs.writeFileSync(filePath, yaml.dump(content));
};
