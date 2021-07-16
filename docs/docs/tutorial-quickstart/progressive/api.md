---
sidebar_position: 2
title: 添加API
---

本模块中，使用 serverless devs 将 API 添加您的应用程序中

## 1. 添加 api 到您的应用程序中

```
s cli init api
```

![image](https://gw.alicdn.com/imgextra/i4/O1CN01HYuUWr1bQj54OLQL0_!!6000000003460-2-tps-1000-106.png)

整个项目的目录结构如下:

```
.
├── functions // 函数的文件目录
├── node_modules
├── public
├── src // 前端文件目录
├── .gitignore
├── package.json
├── README.md
├── s.yml // devs工具配置文件
```

我们看下 functions 函数的目录结构

```
.
├── package.json
└── user
    └── index.js
```

## 2. 部署

```
s deploy
```

部署完成之后会返回可访问的域名

![image](https://gw.alicdn.com/imgextra/i4/O1CN01thwoMx28rdfqNUxHX_!!6000000007986-2-tps-1000-296.png)

访问域名会看到如下界面

![image](https://gw.alicdn.com/imgextra/i4/O1CN01Adi2B51ZTM7cd4WCk_!!6000000003195-2-tps-1000-498.png)

当访问 域名加上/api/user 可以看到如下界面

![image](https://gw.alicdn.com/imgextra/i1/O1CN01s4yxWT1evMPz4lMvf_!!6000000003933-2-tps-998-127.png)

:::caution
http://website-react-project-f508b5ad21e848f54f46dfd66acec16e.jamstack.devsapp.net/api/user

// 302 重定向

http://jamstack-api.system.rest-api-demo.1694024725952210.cn-hangzhou.fc.devsapp.net/user

// 返回数据

{
"title": "hello serverless dk"
}
:::
