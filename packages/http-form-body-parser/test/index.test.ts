import dk from '@serverless-devs/dk-core';
import jsonBodyParser from '@serverless-devs/http-json-body-parser';
import formBodyParser from '../src/index';

import { mockResponse, mockContext } from './fixtures/mock-data';
var http = require('http');

describe('http-form-body-parser 测试', () => {
  it('测试：基本事例', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = dk((request) => {
        return request.req.body;
      });
      handler.use(formBodyParser()).use(jsonBodyParser());
      const data = await handler(req, mockResponse, mockContext);
      expect(data.result).toEqual({
        a: {
          b: {
            c: {
              d: 'i',
            },
          },
        },
      });
      res.end();
    });

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      });
      client.end('a[b][c][d]=i');

      client.on('response', (res) => {
        server.close(() => {
          done();
        });
      });
    });
  });
});
