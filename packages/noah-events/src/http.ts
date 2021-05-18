import noah from '@serverless-devs/noah';
import { isFcEnv, noop, generateConfig } from './util';

interface IHttpConfig {
  authType?: string;
  methods?: string[];
  handler: (arg0: any) => any;
}

const onRequest = (
  config: IHttpConfig = {
    authType: 'anonymous',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    handler: noop,
  },
) => {
  if (isFcEnv) return noah(config.handler);
  generateConfig('oss', config);
};

export const http = {
  onRequest,
};
