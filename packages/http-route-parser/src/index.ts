/**
 * 本地测试用例模拟的 httpServetRequest 请求 stream 流，与 FC 略不一样？FC 已经对 path 结构了
 * 
 * 以 /user/id?id=1 GET 为例：
 * 
 * 测试用例 req：如 { url: "/user/id?id=1", method: "GET" }
 * FC req： 如 { path: "/user/id", method: 'GET', queries: { id = 1 } }
 */
const { match: compile } = require('path-to-regexp');

const matchFunc = (path: string, option?: object) => compile(path, option);

/*eslint guard-for-in: 0*/

const httpRouterParserMiddleware = (route: Object, option?: object) => {

  const httpUrlencodeBodyParserMiddlewareBefore = async (request) => {
    const { method, path } = request.req;
    for (const i in route) {
      const match = matchFunc(i, option);
      const [uri] = path.split('?');
      if (match(uri) && route[i] && route[i][method]) { // path，method 匹配成功
        request.req.match = match(path);
        await route[i][method](request);
      }
    }
  }
  return {
    before: httpUrlencodeBodyParserMiddlewareBefore,
  }
}

export = httpRouterParserMiddleware;
