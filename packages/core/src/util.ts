import { EVENT, HTTP, INITIALIZER } from './constant';
import { IFcHttpRes, IFcRequest, IFcContext, IdkRequest, IFcResponse } from './interface';
import { isContainerEmpty, omit } from '@serverless-devs/dk-util';
import body from 'body';

const { match: compile } = require('path-to-regexp');

const makeHttpResponse = (
  { statusCode, headers, deleteHeaders, body }: IFcHttpRes,
  httpResp: IFcResponse,
) => {
  // statusCode
  if (statusCode !== undefined) {
    if (httpResp.setStatusCode) { // fc 的 res 提供 setStatusCode 方法，本地模拟 http 请求时不存在，需手动修改 statusCode
      httpResp.setStatusCode(statusCode);
    } else {
      httpResp.statusCode = statusCode;
    }
  }
  // headers
  if (!isContainerEmpty(headers)) {
    Object.keys(headers).forEach((key) => {
      httpResp.setHeader(key, headers[key]);
    });
  }

  // deleteHeader
  if (!isContainerEmpty(deleteHeaders)) {
    deleteHeaders.forEach((key) => {
      httpResp.deleteHeader(key);
    });
  }

  httpResp.send(body);
};

/**
 * @description 解析函数的事件
 * exports.initializer = (context, callback)  initializer触发
 * exports.handler = (req, resp, context) http触发
 * exports.handler = (event, context, callback) 事件触发
 * @param first
 * @param second
 * @param thrid
 */
export const analizeEvents = (first, second, thrid?: any) => {
  let type: string;
  let callback: Function;
  let event: string;
  let req: IFcRequest;
  let res;
  let context: IFcContext = {};
  if (typeof thrid === 'undefined') {
    // initializer
    type = INITIALIZER;
    context = first;
    callback = second;
    return {
      context,
      callback,
      type,
    };
  } else if (typeof thrid === 'function') {
    // event trigger
    type = EVENT;
    callback = thrid;
    context = second;
    event = first; // typeof event = Buffer
    return {
      event,
      context,
      callback,
      type,
    };
  } else {
    type = HTTP;
    req = first;
    res = second;
    context = thrid;
    return {
      req,
      res,
      context,
      type,
    };
  }
};

export const makeResult = ({ res, type, callback, result, error }: IdkRequest) => {
  if (type === INITIALIZER || type === EVENT) {
    error ? callback(error) : callback(null, result);
  } else {
    makeHttpResponse(result, res);
  }
};

export const analizeRequestParams = ({
  internal,
  res,
  req,
  result,
  context,
  event,
  type,
}: IdkRequest) => {
  if (type === INITIALIZER) {
    return {
      context,
      internal,
    };
  } else if (type === EVENT) {
    return {
      event,
      context,
      internal,
    };
  } else {
    const restResponse = omit(res, ['statusCode', 'headers', 'deleteHeaders', 'body']);
    return {
      req,
      res: isContainerEmpty(restResponse) ? result : Object.assign({}, restResponse, result || {}),
      context,
      internal,
    };
  }
};

export const getBody = async (request) =>
  new Promise((resolve, reject) => {
    if (!request.req.on) {
      resolve(request);
    }
    try {
      body(request.req, (e, b) => {
        request.req.body = b;
        resolve(request);
      });
    } catch (e) {
      reject(e);
    }
  });


/*eslint guard-for-in: 0*/
const matchFunc = (path: string, option?: object) => compile(path, option);

/**
 * 兼容 method 大小写
 * @param request 
 * @param route 
 */
export const httpRouteParserHandler = async (request: IdkRequest, route: { [key: string]: any }) => {
  const { method, path } = request.req;
  for (const i in route) {
    const type = Object.prototype.toString.call(route[i]);  // 通过原型判断类型
    if (type === '[object Function]' || type === '[object AsyncFunction]') { // 如 'GET /user/:id': () => {}
      const [routeMethod, url] = i.split(' ');
      const match = matchFunc(url);
      const [uri] = path.split('?');
      if (match(uri) && routeMethod.toLowerCase() === method.toLowerCase() && route[i]) {
        request.req.match = match(path);
        const data = await route[i](request);
        return data;
      }
    } else if (type === '[object Object]') { // 如 '/user/:id': { GET: () => {}, POST: () => {} }
      const match = matchFunc(i);
      const [uri] = path.split('?');
      const newRouteObj = {};
      for (const j in route[i]) {
        newRouteObj[j.toLowerCase()] = route[i][j];
      };
      if (match(uri) && route[i] && newRouteObj[method.toLowerCase()]) {
        request.req.match = match(path);
        const data = await newRouteObj[method.toLowerCase()](request);
        return data;
      }
    }
  }
  return { body: '' };
}
