import noah from '@serverless-devs/noah-core';
import { isFcEnv, noop, generateConfig } from './util';

interface IHttpConfig {
  authType?: string;
  methods?: string[];
  handler: (...any) => any;
}

const onRequest = (
  config: IHttpConfig = {
    authType: 'anonymous',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    handler: noop,
  },
) => {
  if (isFcEnv) return noah(config.handler);
  generateConfig(config);
};

export const http = {
  onRequest,
};
