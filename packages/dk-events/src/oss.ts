import { isFcEnv, generateConfig } from './util';
import dk from '@serverless-devs/dk';

interface IOSSConfig {
  bucketName: string;
  handler: (arg0: any) => any;
  events?: string[];
  filter?: {
    prefix: string;
    suffix: string;
    target: string;
  };
}

const onEvent = (config: IOSSConfig) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('oss', config);
};

const onObjectCreated = (config: IOSSConfig) => {
  return onEvent(Object.assign({ events: ['oss:ObjectCreated:*'] }, config));
};

const onObjectRemoved = (config: IOSSConfig) => {
  const defaultEvents = [
    'oss:ObjectRemoved:DeleteObject',
    'oss:ObjectRemoved:DeleteObjects',
    'oss:ObjectRemoved:AbortMultipartUpload',
  ];
  return onEvent(Object.assign({ events: defaultEvents }, config));
};

export const oss = {
  onEvent,
  onObjectCreated,
  onObjectRemoved,
};
