import { mockResponse, mockContext } from './fixtures/mock-data';
import noah from '@serverless-devs/noah-core';
import jsonBodyParser from '@serverless-devs/http-json-body-parser';
import routeParser from '../src/index';
const http = require('http');

describe('http-route-parser 测试', () => {
  it('测试：基本事例', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = noah((request) => {
        return request.req.body;
      });
      handler.use(jsonBodyParser()).use(routeParser({
        '/user/:id': {
          GET: (request) => console.log('----GET----   /user/:id', request.req.match),
          POST: (request) => console.log('----POST----   /user/:id', request.req.match),
        },
        '/name': {
          GET: v => console.log('----GET----   /name', { path: v.path, method: v.method, queries: v.queries }),
        }
      }));
      req.path = req.url; // 这里是因为本地模拟的http请求 stream 流与 FC 不一致，手动加上
      await handler(req, mockResponse, mockContext);
      // expect(data.result).toEqual({});
      res.end();
    });

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'GET',
        port: port,
        path: '/user/1',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
      client.end('{}');

      client.on('response', (res) => {
        server.close(() => {
          done();
        });
      });
    });
  });
});
