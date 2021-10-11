const dotenv = require('dotenv');
const { Logger } = require('@serverless-devs/core');

const logger = new Logger('dk-sandbox');

const getEnvs = (config) => {
  const result = dotenv.config(config);
  if (result.parsed) {
    logger.debug(`获取env文件的环境变量: ${JSON.stringify(result.parsed, null, 2)}`);
  }
  return result.parsed;
}

module.exports = {
  getEnvs
}

