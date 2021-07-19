---
sidebar_position: 1
title: jamstack-react
---

## 1. 初始化

```
s init jamstack-react
```

![image](https://img.alicdn.com/imgextra/i2/O1CN011n6oo51It8xPiP1Yq_!!6000000000950-2-tps-1000-331.png)

根据交互式的提示给文件夹命名：`jamstack-react`

新建或者使用已有的[oss](https://oss.console.aliyun.com/) Bucket: `jamstack-react-bucket`（新建 `Bucket` 的时候请确保具有唯一性）。

输入 projectName: `jamstack-react-project`

新建或者选择已有的密钥，新建密钥可前往[阿里云密钥获取](https://www.serverless-devs.com/docs/provider-config/alibabacloud)查看。

## 2. 本地调试

```
cd jamstack-react/functions && npm install
npm run serve
```

![image](https://img.alicdn.com/imgextra/i4/O1CN01j7ywrn1Jem98UL7ve_!!6000000001054-2-tps-1000-276.png)

访问 `http://localhost:7001/api/user` 可以看到如下界面

![image](https://gw.alicdn.com/imgextra/i3/O1CN01YVj5QT1ruWhdV5XH9_!!6000000005691-2-tps-1000-127.png)

前端项目本地启动

```
npm run start
```

![image](https://img.alicdn.com/imgextra/i1/O1CN013uUzGS1umENUXa2og_!!6000000006079-1-tps-997-499.gif)

## 3. 部署

```
s deploy
```
