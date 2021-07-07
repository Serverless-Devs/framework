---
sidebar_position: 1
title: 部署并托管 React 应用程序
---

# 简介

本模块中，我们首先通过模板创建一个新的React应用程序，将其部署到 devsapp.net 域上托管的全球可用内容分发网络 (CDN)。

## 创建新的React应用程序
```
s init website-react
```
根据交互式的提示给文件夹命名：`website-react`

新建或者使用已有的[oss](https://oss.console.aliyun.com/) Bucket: `dk-react`（TODO: 可能会重复）

```
cd website-react
npm start
```

## 使用 Serverless Devs部署您的应用程序
1. 安装 [Serverless Dves](https://github.com/Serverless-Devs/docs/blob/master/zh/install.md)
2. 执行部署
```
s deploy
```
3. 部署完成之后会返回可访问的域名

![Alt text](https://img.alicdn.com/imgextra/i1/O1CN01RUZyrT1VwQniotkYK_!!6000000002717-2-tps-785-307.png)
