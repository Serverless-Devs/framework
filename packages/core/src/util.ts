import { EVENT, HTTP, INITIALIZER } from './constant';
import { IFcHttpRes, IFcRequest, IFcContext, IMidRequest } from './interface';
import { isContainerEmpty, omit } from '@serverless-devs/noah-util';

const makeHttpResponse = ({ statusCode, headers, deleteHeaders, body }: IFcHttpRes, httpResp) => {
  // statusCode
  if (statusCode !== undefined) {
    httpResp.setStatusCode();
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
  let type: string,
    callback: Function,
    event: string,
    req: IFcRequest,
    res = undefined;
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
    event = Buffer.isBuffer(first) ? first.toString() : first;
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

export const makeResult = ({ res, type, callback, result, error }: IMidRequest) => {
  if (type === INITIALIZER || type === EVENT) {
    error ? callback(error) : callback(null, result);
  } else {
    makeHttpResponse(result, res);
  }
};

export const analizeRequestParams = ({ res, req, result, context, event, type }: IMidRequest) => {
  if (type === INITIALIZER) {
    return {
      context,
    };
  } else if (type === EVENT) {
    return {
      event,
      context,
    };
  } else {
    const restResponse = omit(res, ['statusCode', 'headers', 'deleteHeaders', 'body']);
    return {
      req,
      res: !isContainerEmpty(restResponse) ? result : Object.assign({}, restResponse, result || {}),
      context,
    };
  }
};
