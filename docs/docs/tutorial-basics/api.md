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

## 本地启动（TODO）

```
cd functions
npm install
npm run server
```

## 前端调用 （TODO）

> webpack 配置?

## 发布上线

```
s deploy
```
