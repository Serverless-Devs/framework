import noah from '@serverless-devs/noah-core';

interface IHttpConfig {
  authType?: string;
  methods?: string[];
}

const onRequest = (bucketName: string, handler: (...any) => any, config?: IHttpConfig) => {
  const defaultConfig = {
    authType: 'anonymous',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  };
  config = config || defaultConfig;
  const { authType, methods } = config;
  console.log(authType, methods);
  // 或者直接执行部署操作?
  // 解析出需要的资源等信息
  return noah(handler);
};

export const http = {
  onRequest,
};
