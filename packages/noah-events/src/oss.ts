// @ts-ignore

import { isDeployStage, noop, generateConfig } from './util';
import noah from '@serverless-devs/noah-core';

interface IOSSConfig {
  bucketName: string;
  handler: (...any) => any;
  events?: string[];
  filterPrefix?: string;
  filterSuffix?: string;
}

const onEvent = (
  config: IOSSConfig = {
    bucketName: '',
    handler: noop,
  },
) => {
  if (isDeployStage) return noah(config.handler);
  generateConfig(config);
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