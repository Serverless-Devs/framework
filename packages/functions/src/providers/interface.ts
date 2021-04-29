import { IncomingMessage } from 'http';

export interface IRequest {
  path: string;
  queries: { [key: string]: any };
  headers: { [key: string]: any };
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
  url: string;
  clientIP: string;
  body?: any;
}

export interface IReq extends IncomingMessage {
  path: string;
  queries: { [key: string]: any };
  headers: { [key: string]: any };
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
  url: string;
  clientIP: string;
  body?: any;
}

export interface IResponse {
  setStatusCode: Function;
  setHeader: Function;
  deleteHeader: Function;
  send: Function;
}

export interface IContext {
  requestId: string;
  credentials: {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
  };
  function: {
    name: string;
    handler: string;
    memory: number;
    timeout: number;
    initializer: string;
    initializationTimeout: number;
  };
  service: {
    name: string;
    logProject: string;
    logStore: string;
    qualifier: string;
    versionId: string;
  };
  region: string;
  accountId: string;
}
