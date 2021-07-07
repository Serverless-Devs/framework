---
sidebar_position: 1
---

# 什么是 serverless DK
欢迎使用serverless DK框架！

DK是阿里云函数计算的配套编程框架，配合[serverless devs](https://github.com/serverless-devs/serverless-devs)帮助开发者更好的用好函数计算serverless。DK通过经典的洋葱模型架构，提供强大的web编程体验的同时，兼备编排云资源的能力。只需要引入中间件来管理云资源。

## 环境准备

#### nodejs环境安装
本地没有安装nodejs环境可以查看[nodejs安装文档](https://nodejs.org/zh-cn/download/)进行安装，建议nodejs版本 >= 10.0


#### serverless devs工具安装
通过 npm 包管理安装：适用于已经预装了 npm 的 Windows、Mac、Linux 平台。在 Windows、Mac、Linux 平台执行以下命令安装 Serverless Devs Tool工具。
```
npm install @serverless-devs/s -g
```
或者 通过 yarn 进行安装

```
yarn global add @serverless-devs/s
```

## 快速体验
#### 快速体验一个hello world小程序 (TODO:)
- 初始化一个http模板项目：`s init dk-http`
- 并给文件夹取一个名字，比如就叫 `dk-http`
- 进入项目：`cd dk-http/functions`
- 本地测试： `npm run server`
> 高级配置：
    一键部署到线上环境： s deploy 

#### 快速体验一个CRUD的小应用
- 首先准备好[tablestore](https://otsnext.console.aliyun.com/)按量付费数据库实例
- 初始化一个http模板项目：`s init dk-tablestore`
- 并给文件夹取一个名字，比如就叫 `dk-tablestore`
- 进入项目：`cd dk-tablestore/functions`
- 本地测试： `npm run server`
> 高级配置：
    一键部署到线上环境： s deploy 