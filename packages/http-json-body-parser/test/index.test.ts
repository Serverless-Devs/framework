import middy from '@serverless-devs/noah-core';
import jsonBodyParser from '../src/index';
import { mockResponse, mockContext } from './fixtures/mock-data';
var http = require('http');

describe('http-json-body-parser 测试', () => {
  it('测试：基本事例', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = middy((request) => {
        return request.req.body // propagates the body as a response
      })
      handler.use(jsonBodyParser());
      const data = await handler(req, mockResponse, mockContext);
      expect(data.result).toEqual({ name: "hfs-test" });
      res.end();
    })

    server.listen(() => {
      var { port } = server.address()
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      client.end(JSON.stringify({ name: 'hfs-test' }));

      client.on('response', (res) => {
        server.close(() => {
          done();
        })
      })
    })
  })

  it('测试：json parse by reviver', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = middy((request) => {
        return request.req.body; // propagates the body as a response
      })
      const reviver = (key, value) => {
        if (key === 'name') {
          return `${value}-reviver`;
        }
        return value;
      }
      handler.use(jsonBodyParser({ reviver }));
      const data = await handler(req, mockResponse, mockContext);
      expect(data.result).toEqual({ name: "hfs-test-reviver" });
      res.end();
    })

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      client.end(JSON.stringify({ name: 'hfs-test' }));

      client.on('response', () => {
        server.close(() => {
          done();
        })
      })
    })
  })

  it('测试：json error', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = middy((request) => {
        return request.req.body // propagates the body as a response
      })
      handler.use(jsonBodyParser());
      try {
        await handler(req, mockResponse, mockContext);
      } catch (e) {
        console.log(e)
        expect(e.message).toEqual('UnprocessableEntityError: Content type defined as JSON but an invalid JSON was provided');
      }
      res.end();
    })

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      client.end('make it broken' + JSON.stringify({ name: 'hfs-test' }));

      client.on('response', (res) => {
        server.close(() => {
          done();
        })
      })
    })
  })

  it('测试：未传 content-type，直接返回 body', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = middy((request) => {
        return request.req.body; // propagates the body as a response
      })
      handler.use(jsonBodyParser());
      const data = await handler(req, mockResponse, mockContext);

      expect(typeof data.result).toEqual('object');
      res.end();
    })

    server.listen(() => {
      var { port } = server.address();
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
      })
      client.end(JSON.stringify({ name: 'hfs-test' }))

      client.on('response', (res) => {
        server.close(() => {
          done();
        })
      })
    })
  })

  it('测试：no http request', async () => {
    const handler = middy((request) => {
      return request.req.body; // propagates the body as a response
    })
    handler.use(jsonBodyParser());
    try {
      await handler({
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'make it broken' + JSON.stringify({ name: 'hfs-test' })
      }, mockResponse, mockContext);
    } catch (err) {
      expect(err.message).toEqual('TypeError: stream.on is not a function'); // getRawBody 方法依赖于http请求，http req 会携带 on 等方法
    }
  })

  it('测试：base64 body', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = middy((request) => {
        return request.req.body; // propagates the body as a response
      })
      handler.use(jsonBodyParser());
      req.isBase64Encoded = true;
      const data = await handler(req, mockResponse, mockContext);
      expect(data.result).toEqual({ name: "hfs-test" });
      res.end();
    })

    server.listen(() => {
      var { port } = server.address();
      const data = JSON.stringify({ name: 'hfs-test' })
      const base64Data = Buffer.from(data).toString('base64')
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/json'
        },
        isBase64Encoded: true,
      })
      client.end(base64Data);

      client.on('response', (res) => {
        server.close(() => {
          done()
        })
      })
    })
  })

  it('测试：base64 body error', (done) => {
    var server = http.createServer(async (req, res) => {
      const handler = middy((request) => {
        return request.req.body; // propagates the body as a response
      })
      handler.use(jsonBodyParser());
      try {
        req.isBase64Encoded = true;
        await handler(req, mockResponse, mockContext);
      } catch (err) {
        expect(err.message).toEqual('UnprocessableEntityError: Content type defined as JSON but an invalid JSON was provided');
        res.end();
      }
    })

    server.listen(() => {
      var { port } = server.address();
      const data = 'make it broken' + JSON.stringify({ name: 'hfs-test' })
      const base64Data = Buffer.from(data).toString('base64')
      var client = http.request({
        method: 'POST',
        port: port,
        path: '/test',
        headers: {
          'Content-Type': 'application/json'
        },
        isBase64Encoded: true,
      })
      client.end(base64Data);

      client.on('response', (res) => {
        server.close(() => {
          done()
        })
      })
    })
  })
})