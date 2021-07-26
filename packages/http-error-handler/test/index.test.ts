import dk from '@serverless-devs/dk-core';
import { mockResponse, mockContext } from './fixtures/mock-data';
import httpErrorHandler from '../src/index';

const http = require('http');

describe('http-error-handler 测试', () => {
  it('测试：基本事例', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = dk(() => {
        throw new Error();
      });
      handler.use(httpErrorHandler());
      await handler(req, mockResponse, mockContext);
      res.end();
    });

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      client.end();

      client.on('response', (res) => {
        server.close(() => {
          done();
        });
      });
    });
  });
});
