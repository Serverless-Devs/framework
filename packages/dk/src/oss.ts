import { isFcEnv, generateConfig } from './util';
import dk from './dk';

interface IOnEvent {
  bucketName: string;
  events: string[];
  filter: {
    prefix: string;
    suffix: string;
  };
}

interface IOnObject {
  bucketName: string;
  events?: string[];
  filter: {
    prefix: string;
    suffix: string;
  };
}
interface IOSSConfig<IOss> {
  handler: Function | Object;
  oss: IOss;
}

const onEvent = (config: IOSSConfig<IOnEvent>) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('oss', config);
  return dk(config.handler);
};

const onObjectCreated = (config: IOSSConfig<IOnObject>) => {
  return onEvent({
    ...config,
    oss: {
      events: ['oss:ObjectCreated:*'],
      ...config.oss,
    },
  });
};

const onObjectRemoved = (config: IOSSConfig<IOnObject>) => {
  const defaultEvents = [
    'oss:ObjectRemoved:DeleteObject',
    'oss:ObjectRemoved:DeleteObjects',
    'oss:ObjectRemoved:AbortMultipartUpload',
  ];
  return onEvent({
    ...config,
    oss: {
      events: defaultEvents,
      ...config.oss,
    },
  });
};

export const oss = {
  onEvent,
  onObjectCreated,
  onObjectRemoved,
};
