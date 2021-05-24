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
  if (!fs.existsSync(filePath)) {
    throw new Error(`${process.cwd()}路径下不存在config.yml文件`);
  }
  const content = yaml.load(fs.readFileSync(filePath, 'utf8'));
  // oss配置
  content.oss = [];
  if (type === 'oss') {
    args.oss.forEach((item) => {
      const obj: any = {
        bucketName: item.bucketName,
        events: item.events,
      };
      if (item.filter) {
        obj.filter = {
          key: {
            Prefix: item.filter.prefix,
            Suffix: item.filter.suffix,
            Target: item.filter.target,
          },
        };
      }
      content.oss.push(obj);
    });
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
