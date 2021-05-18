import noah from '@serverless-devs/noah';
import { isFcEnv, generateConfig } from './util';

interface IHttpConfig {
  authType?: string;
  methods?: string[];
  handler?: (arg0: any) => any;
}

const onRequest = (
  config: IHttpConfig = {
    authType: 'anonymous',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  },
) => {
  if (isFcEnv) return noah(config.handler);
  generateConfig('http', config);
};

export const http = {
  onRequest,
};
