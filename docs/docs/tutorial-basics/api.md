---
sidebar_position: 2
---

# 添加 API

本模块中，使用 serverless devs 将 API 添加您的应用程序中

## 添加 api 到您的应用程序中

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
npm install // 如果已经安装请跳过
npm run serve
```

## 前端调用

在 package.json 文件中添加 `proxy`，值为 `functions` 目录下执行 `npm run serve` 启动的服务

```json
{
  // ...
  "proxy": "http://localhost:7001"
}
```

或者 使用 `http-proxy-middleware`

1. 安装

```base npm2yarn
npm install http-proxy-middleware --save
```

2. 在 `src` 目录下新建 `setupProxy.js` 文件

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

## 发布上线

```
s deploy
```

## 示例

- jamstack-base

```
s init jamstack-base
```

- jamstack-react

```
s init jamstack-react
```

- jamstack-vue

```
s init jamstack-vue
```

本地如何本地调试？

- 进入 `sourceCode指定目录(默认functions)`
- 执行 `yarn` or `npm i` 安装依赖 （如果已经安装请跳过）
- 执行 `npm run serve` 可访问 `http://localhost:7001` 服务

- 进入 `根目录`
- 执行 `yarn` or `npm i` 安装依赖 （如果已经安装请跳过）
- 执行 `npm start`
