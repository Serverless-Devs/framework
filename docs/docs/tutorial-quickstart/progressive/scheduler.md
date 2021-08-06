---
title: 添加scheduler触发器函数
---

## 1. 添加 api 到您的应用程序中

```bash
s cli init scheduler
```

![image](https://img.alicdn.com/imgextra/i4/O1CN01HuDLnP1ePl61yyG4t_!!6000000003864-2-tps-1000-67.png)

## 2. 修改 `timer` 函数

```js
const { scheduler } = require('@serverless-devs/dk');

const baseHandler = async (ctx) => {
  console.log(ctx.events.toString());
  // do your some code
};

const handler = scheduler.onScheduler({
  handler: baseHandler,
  scheduler: {
    cronExpression: '0 0 8 * * *',
    enable: true,
    payload: 'serverless dk',
  },
});

exports.handler = handler;
```

## 3. 部署

```bash
s deploy
```
