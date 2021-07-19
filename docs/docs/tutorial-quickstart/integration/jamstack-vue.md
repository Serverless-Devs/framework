---
sidebar_position: 2
title: jamstack-vue
---

## 1. 初始化

```
s init jamstack-vue
```

![image](https://img.alicdn.com/imgextra/i3/O1CN01kKckNP1xYth2kh8s4_!!6000000006456-2-tps-1000-339.png)

根据交互式的提示给文件夹命名：`jamstack-vue`

新建或者使用已有的[oss](https://oss.console.aliyun.com/) Bucket: `jamstack-vue-bucket`（新建 `Bucket` 的时候请确保具有唯一性）。

输入 projectName: `jamstack-vue-project`

新建或者选择已有的密钥，新建密钥可前往[阿里云密钥获取](https://www.serverless-devs.com/docs/provider-config/alibabacloud)查看。

## 2. 本地调试

```
cd jamstack-vue/functions && npm install
npm run serve
```

![image](https://img.alicdn.com/imgextra/i1/O1CN01gOML5G1RCOWz1GE13_!!6000000002075-2-tps-1000-279.png)

访问 `http://localhost:7001/api/user` 可以看到如下界面

![image](https://gw.alicdn.com/imgextra/i3/O1CN01YVj5QT1ruWhdV5XH9_!!6000000005691-2-tps-1000-127.png)

前端项目本地启动

```
npm run start
```

![image](https://img.alicdn.com/imgextra/i4/O1CN01KlW9nq1ePl5qPG8J2_!!6000000003864-1-tps-997-554.gif)

## 3. 部署

```
s deploy
```

部署完成之后会返回可访问的域名

![image](https://img.alicdn.com/imgextra/i3/O1CN01MILAPv27VpC4V7o02_!!6000000007803-2-tps-1000-237.png)

访问域名会看到如下界面

![image](https://img.alicdn.com/imgextra/i1/O1CN01wxxr8K1ygVtSYPstz_!!6000000006608-1-tps-997-554.gif)
