---
sidebar_position: 6
title: HTTP 设计
---

## 前言
在FC中，我们初始化一个 http 函数，如
```
var getRawBody = require('raw-body');
var getFormBody = require('body/form');
var body = require('body');

exports.handler = (req, resp, context) => {
    var params = {
        path: req.path,
        queries: req.queries,
        headers: req.headers,
        method : req.method,
        requestURI : req.url,
        clientIP : req.clientIP,
    }
        
    getRawBody(req, function(err, body) {
        console.log('--getRawBody--',body.toString());
        params.body = body.toString();
    }); 
    
    getFormBody(req, function(err, formBody) {
            console.log('--getFormBody--',formBody);
            // params.body = formBody;
            resp.send(JSON.stringify(params));
    });

    body(req, function(err, body) {
            console.log('--body--',body);
    })

}
```
当我们需要读取 body 数据时，需要用到 `body/form`、`raw-body` 插件分别对 `application/x-www-form-urlencoded`、`application/json` 类型的传参方式进行解析读取,可读性较低，并且非常不雅观。
## 介绍
在 `dk` 工具，我们封装了 `http` 、`serverless` 模块，这将使得我们将以较为精简的实现上诉逻辑。

## 基本使用
### 1）http 模块
`http` 模块内部集成了 `koa2` 的基础功能，支持我们以类似 koa api 方式实现函数逻辑。
- 支持 async/await
- Node版本 8+

#### 示例
```
$ npm install @serverless-devs/dk
```
```
const { http } = require('@serverless-devs/dk');

http
  .get("/http", (ctx) => {
    ctx.body = 'Hello Http!';
  })
  .get("/", async (ctx,next) => {
    ctx.body = "Hello World!";
  })
 
http.app.use(http.routes());

exports.handler = http();

// 配置 options
// const options = {
//     basePath: '/api'
// }
// exports.handler = http(options);

```
### 2）serverless 模块
`serverless` 模块可以非常方便的将传统的 web 框架使用 nodejs runtime 的形式在阿里云函数计算上运行。

#### 框架支持
(`*` 代表暂时不完全支持)
- Connect
- Express
- Koa
- Restana
- Sails *
- Hapi *
- Fastify *
- Restify *
- Polka *
- Loopback *


#### 示例
以 koa 为例

```
const { serverless } = require('@serverless-devs/dk');
const Koa = require('koa');
const Router = require("koa-router");
const router = new Router();
const app = new Koa();

router
  .get("/koa", (ctx) => {
    ctx.body = 'Hello Koa!';
  })
  .get("/", async (ctx) => {
    ctx.body = "Hello World!";
  })
app.use(router.routes());

exports.handler = serverless(app);
```
更多例子见 [examples](https://github.com/Serverless-Devs/fc-http/tree/main/examples)


## 高级选项 Options
- 在 `http` 中作为第一参数  
- 在 `serverless` 中作为第二参数  
它可以配置：

## Options Apis
事件 | 类型 | 描述
---- | --- | ---
basePath   | String      | 基本路径
request    | Function    | 请求的转换，在它被发送到应用程序之前
response   | Function    | 响应的转换，在返回给 Lambda 之前
binary     | Boolean / Function / Object[]   | 二进制 Binary Mode


### 基本路径
- basePath：无服务器应用程序的基本路径/挂载点。如果您希望使用多个 Lambda 来表示应用程序的不同部分，则很有用。

- 配置前
```
app.get("/new", (ctx) => {
  res.send('Hello World!')
})

exports.handler = serverless(app);
```
```
[GET] http://localhost/api/new -> 404
```

- 配置后

```
app.get("/new", (ctx) => {
  res.send('Hello World!')
})

exports.handler = serverless(app, {
  basePath: '/api'
});
```
```
[GET] http://localhost/api/new -> 200
```
在 FC 中，上面的示例也适用于：
```
https://xxx.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-http-demo/api/new -> 200
```

### 转换
- request：请求的转换，在它被发送到应用程序之前
- response：响应的转换，在返回给 Lambda 之前

转换是要分配的函数（req|res、事件、上下文）或对象。

您可以在请求通过您的应用程序之前对其进行转换。

您可以在响应返回之后，在发送之前对其进行转换：

一些例子
```
exports.handler = serverless(app, {
  request: {
    key: 'value'
  },
  response(res) {
    res.foo = 'bar';
  }
})

exports.handler = serverless(app, {
  request(request, event, context) {
    request.context = event.requestContext;
  },·
  async response(response, event, context) {
    // the return value is always ignored
    return new Promise(resolve => {
      // override a property of the response, this will affect the response
      response.statusCode = 420;

      // delay your responses by 300ms!
      setTimeout(() => {
        // this value has no effect on the response
        resolve('banana');
      }, 300);
    });
  }
})
```

### 二进制 Binary Mode

二进制模式检测查看BINARY_CONTENT_TYPES环境变量，或者您可以指定类型数组，或自定义函数：

```
// turn off any attempt to base64 encode responses -- probably Not Going To Work At All
serverless(app, {
  binary: false
});

 // this is the default, look at content-encoding vs. gzip, deflate and content-type against process.env.BINARY_CONTENT_TYPES
serverless(app, {
  binary: true
});

// set the types yourself - just like BINARY_CONTENT_TYPES but using an array you pass in, rather than an environment varaible
serverless(app, {
  binary: ['application/json', 'image/*']
});

// your own custom callback
serverless(app, {
  binary(headers) {
    return ...
  }
});
```
