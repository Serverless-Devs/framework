export interface IStringMap {
  [key: string]: string;
}

export interface IMap {
  [key: string]: any;
}

export enum FcMethod {
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
}

export interface IFcRequest {
  headers?: IStringMap;
  path?: string;
  queries?: { [key: string]: any };
  method: FcMethod;
  clientIP: string;
  url: string;
  match?: { [key: string]: any };
  github?: { [key: string]: any }; // github webhooks
}

export interface IFcContext {
  requestId?: string;
  credentials?: {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
  };
  function?: {
    name: string;
    handler: string;
    memory: number;
    timeout: number;
    initializer: string;
    initializationTimeout: number;
  };
  service?: {
    name: string;
    logProject: string;
    logStore: string;
    qualifier: string;
    versionId: string;
  };
  region?: string;
  accountId?: string;
}

export interface IFcHttpRes {
  // 基础返回值
  statusCode?: number;
  headers?: IStringMap;
  deleteHeaders?: string[];
  body?: string;
}

export interface IFcResponse {
  setStatusCode: Function;
  setHeader: Function;
  deleteHeader: Function;
  send: Function;
  statusCode?: number; // 本地http接口请求，不存在setStatusCode，失败时需手动修改statusCode
}

export interface IdkRequest {
  req?: IFcRequest;
  res?: IFcResponse;
  event?: string | Buffer;
  context: IFcContext;
  callback?: Function;
  type: string;
  result: any;
  error: Error;
  internal: IMap;
}
