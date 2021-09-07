import { github } from '../src';
import { mockResponse, mockContext } from './fixtures/mock-data';
const Http = require('http');

describe('github 测试', () => {
  it('测试：基本事例', (done) => {
    var server = Http.createServer(async (req, res) => {
      await github()(req, mockResponse, mockContext);
      res.end();
    });

    server.listen(() => {
      var { port } = server.address();
      var client = Http.request({
        method: 'GET',
        port: port,
        path: '/',
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
