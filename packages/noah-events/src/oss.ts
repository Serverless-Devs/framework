// @ts-ignore

import noah from '@serverless-devs/noah-core';

interface IOSSConfig {
  event?: string;
  events?: string[];
  filterPrefix?: string;
  filterSuffix?: string;
}

const onEvent = (bucketName: string, handler: (...any) => any, config?: IOSSConfig) => {
  config = config || {};
  const { events, filterPrefix, filterSuffix } = config;
  const argsCopy = {
    filterPrefix,
    filterSuffix,
    events,
  };
  console.log(argsCopy);
  // 或者直接执行部署操作?
  // 解析出需要的资源等信息
  return noah(handler);
};

const onObjectCreated = (bucketName: string, handler: (...any) => any, config?: IOSSConfig) => {
  config = config || {};
  const { event = '*', filterPrefix, filterSuffix } = config;
  const argsCopy = {
    filterPrefix,
    filterSuffix,
    events: [`oss:ObjectCreated:${event}`],
  };
  return onEvent(bucketName, handler, argsCopy);
};

const onObjectRemoved = (bucketName: string, handler: (...any) => any, config?: IOSSConfig) => {
  config = config || {};
  const { event, filterPrefix, filterSuffix } = config;
  const argsCopy = {
    filterPrefix,
    filterSuffix,
    events: event
      ? [`oss:ObjectRemoved:${event}`]
      : [
          'oss:ObjectRemoved:DeleteObject',
          'oss:ObjectRemoved:DeleteObjects',
          'oss:ObjectRemoved:AbortMultipartUpload',
        ],
  };
  return onEvent(bucketName, handler, argsCopy);
};

export const oss = {
  onEvent,
  onObjectCreated,
  onObjectRemoved,
};
