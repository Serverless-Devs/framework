import dotenv, { DotenvConfigOptions } from 'dotenv';
import { Logger } from '@serverless-devs/core';
const logger = new Logger('dk-deploy-common');

function getEnvs(config?: DotenvConfigOptions) {
  const result = dotenv.config(config);
  if (result.parsed) {
    logger.debug(`获取env文件的环境变量: ${JSON.stringify(result.parsed, null, 2)}`);
  }
  return result.parsed;
}

export default getEnvs;
