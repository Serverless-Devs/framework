---
sidebar_position: 2
title: 添加 API
---

# 简介

本模块中，使用 serverless devs 将 API 添加您的应用程序中

## 添加 api 到您的应用程序中：

```
s cli init api
? 请输入部署函数的路径: functions
? 请输入部署的函数名称: user
```

整个项目的目录结构如下:

```
.
├── README.md
├── functions // 函数的文件目录
├── node_modules
├── package.json
├── public
├── s.yml // devs工具配置文件
├── src // 前端文件目录
```

我们看下 functions 函数的目录结构

```
.
├── config.yml
├── package.json
└── user
    └── index.js
```

## 本地启动

```
cd functions
npm install
npm run serve
```

## 前端调用

### creat-react-app 项目

在 package.json 文件中添加 `proxy` 属性，值为 `functions` 目录下执行 `npm run serve` 启动的服务

```json
{
  // ...
  "proxy": "http://localhost:7001"
}
```

或者 使用 `http-proxy-middleware`

First, install http-proxy-middleware using npm or Yarn:

```
npm install http-proxy-middleware --save
# or
yarn add http-proxy-middleware
```

Next, create src/setupProxy.js and place the following contents in it:

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ...
};
```

You can now register proxies as you wish! Here's an example using the above `http-proxy-middleware`:

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:7001',
      changeOrigin: true,
    }),
  );
};
```

具体可参考 [应用示例](https://github.com/devsapp/jamstack-example/tree/master/jamstack-react)

## 发布上线

```
s deploy
```
