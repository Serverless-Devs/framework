---
sidebar_position: 1
title: oss事件
---

fc 部署的函数如果配置了 oss 触发器，当我们对 oss 进行操作的时候，会触发该函数（取决于配置的触发事件）。可用于文件解压，图片添加水印等场景。

## 基本使用方法

- oss.onObjectCreated, 默认触发事件：`oss:ObjectCreated:*'`
- oss.onObjectRemoved, 默认触发事件：`oss:ObjectRemoved:DeleteObject, oss:ObjectRemoved:DeleteObjects, oss:ObjectRemoved:AbortMultipartUpload`
- oss.onEvent, 如果以上两个方法的默认触发事件不能满足我们的需求时，我们可以通过 `onEvent` 来自定义触发事件

```js
const { oss } = require('@serverless-devs/dk');
const aliOss = require('ali-oss');

const baseHandler = async (ctx) => {
  console.log('Received event:', ctx.event.toString());
  const event = JSON.parse(ctx.event);
  const ossEvent = event.events[0];
  // Required by OSS sdk: OSS region is prefixed with "oss-", e.g. "oss-cn-hangzhou"
  const ossRegion = 'oss-' + ossEvent.region;
  // Create oss client
  const client = new aliOss({
    region: ossRegion,
    accessKeyId: ctx.context.credentials.accessKeyId,
    accessKeySecret: ctx.context.credentials.accessKeySecret,
    stsToken: ctx.context.credentials.securityToken,
  });
  // Bucket name is from OSS event
  client.useBucket(ossEvent.oss.bucket.name);
  // Get object
  console.log('Getting object: ', ossEvent.oss.object.key);
  const res = await client.get(ossEvent.oss.object.key);
  console.log('Read object from buffer', res.content);
  // Write your some code
};

const handler = oss.onObjectCreated({
  handler: baseHandler,
  oss: {
    bucketName: 'your_bucket',
    filter: {
      prefix: 'source',
      suffix: '.zip',
    },
  },
});

exports.handler = handler;
```
