import { mockResponse, mockContext } from './fixtures/mock-data';
const dk = require('@serverless-devs/dk-core');
const { cookiesMiddleware, cookieSessionMiddleware } = require('../src');

const http = require('http');

describe('cookies 测试', () => {
  it('测试：基本事例', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = dk((request) => {
        const cookies = request.req.cookies;
        const session = request.req.session;
        console.log(session,'session')
        const lastVisit = cookies.get('LastVisit', { signed: true })
        cookies.set('LastVisit', new Date().toISOString(), { signed: true })
        if (lastVisit) {
          console.log(lastVisit, 'lastVisit')
        }
        request.req.body = '123'
        return request.req.body; // propagates the body as a response
      });
      handler.use(cookiesMiddleware({ keys: ['keyboard cat'] })).use(cookieSessionMiddleware({
        name: 'session',
        keys: ['keyboard cat'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }));
      const data = await handler(req, mockResponse, mockContext);
      if(data){
        
      }
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
