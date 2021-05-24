import dk from '@serverless-devs/dk';
import { isFcEnv, generateConfig } from './util';

interface IHttpConfig {
  http?: { authType?: string; methods?: string[] }[];
  handler?: (arg0: any) => any;
}

const onRequest = (
  config: IHttpConfig = {
    http: [{ authType: 'anonymous', methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'] }],
  },
) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('http', config);
};

export const http = {
  onRequest,
};
