import dk from './dk';
import { isFcEnv, generateConfig } from './util';

interface IHttpConfig {
  http?: { authType?: string; methods?: string[] }[];
  handler?: (arg0: any) => any;
}

const onRequest = (config: IHttpConfig) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('http', {
    http: [{ authType: 'anonymous', methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'] }],
    ...config,
  });
};

export const http = {
  onRequest,
};
