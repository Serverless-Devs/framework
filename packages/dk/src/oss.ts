import { isFcEnv, generateConfig } from './util';
import dk from './dk';

interface IOSSConfig {
  handler: Function | Object;
  oss: {
    bucketName: string;
    events?: string[];
    filter?: {
      prefix: string;
      suffix: string;
      target: string;
    };
  }[];
}

const onEvent = (config: IOSSConfig) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('oss', config);
  return dk(config.handler);
};

const onObjectCreated = (config: IOSSConfig) => {
  return onEvent({
    ...config,
    oss: config.oss.map((item) => ({
      events: ['oss:ObjectCreated:*'],
      ...item,
    })),
  });
};

const onObjectRemoved = (config: IOSSConfig) => {
  const defaultEvents = [
    'oss:ObjectRemoved:DeleteObject',
    'oss:ObjectRemoved:DeleteObjects',
    'oss:ObjectRemoved:AbortMultipartUpload',
  ];
  return onEvent({
    ...config,
    oss: config.oss.map((item) => ({
      events: defaultEvents,
      ...item,
    })),
  });
};

export const oss = {
  onEvent,
  onObjectCreated,
  onObjectRemoved,
};
