import { githubHandler } from '../src';

const http = require('http');
const github = githubHandler({ path: '/webhooks', secret: 'my_secrets2' });

github.on('error', (data) => {
  console.log('github 监听到 error', data.event)
})

describe('http-form-body-parser 测试', () => {
  it('测试：基本事例', (done) => {
    const server = http.createServer(async (req, res) => {
      const data = await github(req);
      expect(data.code).toEqual(400);
      res.end();
    });

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/webhooks',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      client.end('s');

      client.on('response', (res) => {
        server.close(() => {
          done();
        });
      });
    });
  });
});
