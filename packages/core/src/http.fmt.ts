import { IStringMap } from './interface';
import { isContainerEmpty } from './util';

interface IHttpParams {
  // 基础返回值
  statusCode?: number;
  headers?: IStringMap;
  deleteHeaders?: string[];
  body?: string;

  // 高级返回值
  // cacheControl?: string;
  // type?: string;
  // cors?: string;
  // html?: string;
  // css?: string;
  // js?: string;
  // text?: string;
  // json?: string;
  // xml?: string;
}

export default ({ statusCode, headers, deleteHeaders, body }: IHttpParams, httpResp) => {
  // statusCode
  statusCode && httpResp.setStatusCode();

  // headers
  if (isContainerEmpty(headers)) {
    Object.keys(headers).forEach((key) => {
      httpResp.setHeader(key, headers[key]);
    });
  }

  // deleteHeader
  if (isContainerEmpty(deleteHeaders)) {
    deleteHeaders.forEach((key) => {
      httpResp.deleteHeader(key);
    });
  }

  httpResp.send(body);
};

//
// const cleanUpImproperCase = (headers: IStringMap) => {
//   if (headers && headers['cache-control']) {
//     delete headers['cache-control']; // Clean up improper casing
//   }
//   if (headers && headers['content-type']) {
//     delete headers['content-type']; // Clean up improper casing
//   }
// };

// export default (params: IHttpParams) => {
//   const knownParams = ['statusCode', 'headers', 'deleteHeader', 'body'];
//   const headers = params.headers;
//   let body = params.body || '';
//
//   cleanUpImproperCase(headers);
//
//   const cacheControl =
//     params.cacheControl ||
//     (headers && headers['Cache-Control']) ||
//     (headers && headers['cache-control']) ||
//     '';
//   let statusCode = params.statusCode || 200;
//
//   let type =
//     params.type ||
//     (headers && headers['Content-Type']) ||
//     (headers && headers['content-type']) ||
//     'application/json; charset=utf8';
//   const cors = params.cors;
//
//   if (params.html) {
//     type = 'text/html; charset=utf8';
//     body = params.html;
//   } else if (params.css) {
//     type = 'text/css; charset=utf8';
//     body = params.css;
//   } else if (params.js) {
//     type = 'text/javascript; charset=utf8';
//     body = params.js;
//   } else if (params.text) {
//     type = 'text/plain; charset=utf8';
//     body = params.text;
//   } else if (params.json) {
//     type = 'application/json; charset=utf8';
//     body = JSON.stringify(params.json);
//   } else if (params.xml) {
//     type = 'application/xml; charset=utf8';
//     body = params.xml;
//   }
// };
