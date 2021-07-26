---
sidebar_position: 1
title: 部署并托管React应用程序
---

本模块中，我们首先通过模板创建一个新的 React 应用程序，将其部署到 devsapp.net 域上托管的全球可用内容分发网络 (CDN)。

## 1. [Serverless Dves 工具安装](/docs/tutorial-dk/intro/quickstart#环境准备)

## 2. 创建新的 React 应用程序

```bash
s init website-react
```

![image](https://gw.alicdn.com/imgextra/i3/O1CN01LrPBue1KU4VL3LCdK_!!6000000001166-2-tps-1000-303.png)

根据交互式的提示给文件夹命名：`website-react`

新建或者使用已有的[oss](https://oss.console.aliyun.com/) Bucket: `website-react-bucket`（新建 `Bucket` 的时候请确保具有唯一性）。

新建或者选择已有的密钥，新建密钥可前往[阿里云密钥获取](https://www.serverless-devs.com/docs/provider-config/alibabacloud)查看。

```bash
cd website-react
npm start
```

## 3. 部署

```bash
s deploy
```

部署完成之后会返回可访问的域名

![image](https://gw.alicdn.com/imgextra/i1/O1CN01xTcek91yg3V7nW6iL_!!6000000006607-2-tps-1000-397.png)

访问域名会看到如下界面

![image](https://gw.alicdn.com/imgextra/i3/O1CN01Tpv8tT1FasJHPgqfI_!!6000000000504-2-tps-1000-501.png)
