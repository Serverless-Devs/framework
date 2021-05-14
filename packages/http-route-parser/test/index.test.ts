import { mockResponse, mockContext } from './fixtures/mock-data';
const noah = require('@serverless-devs/noah-core');
const jsonBodyParser = require('@serverless-devs/http-json-body-parser');
const routeParser = require('../src/index');
var http = require('http');

describe('http-route-parser 测试', () => {
  it('测试：基本事例', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = noah((request) => {
        return request.req.body;
      });
      handler.use(jsonBodyParser()).use(routeParser({
        '/user/:id': {
          GET: (v, m) => console.log('----GET----   /user/:id', v.path, m),
          POST: (v, m) => console.log('----POST----   /user/:id', v.path, m),
        },
        '/name': {
          GET: v => console.log('----GET----   /name', v.path),
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
        method: 'POST',
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
