---
title: 添加oss触发器函数
---

## 1. 添加 api 到您的应用程序中

```bash
s cli init oss
```

![image](https://img.alicdn.com/imgextra/i2/O1CN01rpWgie21bQLSapuRl_!!6000000007003-2-tps-1000-107.png)

## 2. 修改 `unzip` 函数

```js
const { oss } = require('@serverless-devs/dk');

const baseHandler = async (ctx) => {
  console.log(ctx.events.toString());
  // 处理相关逻辑，比如文件解压，图片添加水印等
};

const handler = oss.onObjectCreated({
  handler: baseHandler,
  oss: {
    bucketName: 'your_bucket',
    filter: {
      prefix: 'source/',
      suffix: '.zip',
    },
  },
});

exports.handler = handler;
```

## 3. 部署

```bash
s deploy
```

## 4. 示例

具体可参考 [demo](/docs/tutorial-solution/oss-zip)
