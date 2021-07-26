---
sidebar_position: 2
title: 快速开始
---

欢迎使用 serverless DK 框架！

DK 是阿里云函数计算的配套编程框架，配合[serverless devs](https://github.com/serverless-devs/serverless-devs)帮助开发者更好的用好函数计算 serverless。DK 通过经典的洋葱模型架构，提供强大的 web 编程体验的同时，兼备编排云资源的能力。只需要引入中间件来管理云资源。

## 环境准备

#### nodejs 环境安装

本地没有安装 nodejs 环境可以查看[nodejs 安装文档](https://nodejs.org/zh-cn/download/)进行安装，建议 nodejs 版本 >= 10.0

#### Serverless Dves 工具安装

通过 npm 包管理安装：适用于已经预装了 npm 的 Windows、Mac、Linux 平台。在 Windows、Mac、Linux 平台执行以下命令安装 Serverless Devs Tool 工具。更多详情可前往[Serverless Dves](https://www.serverless-devs.com/docs/install)查看。

```base npm2yarn
npm install @serverless-devs/s -g
```

检测 `s工具` 是否安装成功

```bash
s -v
```

## 快速体验

#### 快速体验一个 hello world 小程序

- 初始化一个 http 模板项目：`s init dk-http`
- 给文件夹取一个名字，比如就叫 `dk-http`
- 进入项目：`cd dk-http/functions && npm install`
- 本地测试： `npm run serve`
  > 高级配置：
      一键部署到线上环境： s deploy

#### 快速体验一个 CRUD 的小应用（[示例](/docs/tutorial-quickstart/database/tablestore)）

- 首先准备好[tablestore](https://otsnext.console.aliyun.com/)按量付费数据库实例
- 初始化一个 http 模板项目：`s init dk-tablestore`
- 给文件夹取一个名字，比如就叫 `dk-tablestore`
- 进入项目：`cd dk-tablestore/functions && npm install`
- 本地测试： `npm run serve`
  > 高级配置：
      一键部署到线上环境： s deploy
