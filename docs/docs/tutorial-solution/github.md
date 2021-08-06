---
sidebar_position: 3
title: github 事件
---

## 介绍
`dk` 集成了 `github` 的事件监听， 如 `push`、`issues`、`event` 等事件。通过 `dk` 部署的 `FC` 函数，在 `FC` 函数中添加事件监听，可以在代码提交到 `github` 仓库时，自动触发并执行相关操作，效果如 [Github Action](https://docs.github.com/cn/actions) 的自动化脚本的能力类似。

## 快速体验
### 第一步
- 到指定 `Github` 仓库下 `Settings`，配置 `Github Webhooks` 监听，将 `Payload URL` 指向自己指定的接口
- 当 `Github` 收到 `Repo` 的操作行为时，会向指定的 `Url` 发送一个带有描述操作内容的 `Post` 请求。
<!-- ![img]('../../../static/img/github-webhooks.png') -->

### 第二步
- 通过 `s init dk-github` 快速部署一个 `FC` 函数，得到部署地址 `Url`，即 `Github Webhooks` 中的 `Payload URL`。
- 将当前创建之后的代码提交到第一步创建的 `Github` 仓库。
- 如下，当代码发生事件，如 `issues`、`push` 操作时，函数将监听并执行 onEvent 方法。
```
const { dk, githubHandler } = require('@serverless-devs/dk');
const github = githubHandler({ path: '/webhooks' });

github.onEvent(data => {
  console.log('监听到 event', data.event)
});

const baseHandler = (ctx) => {
  const data = github(ctx.req);
  return data;
}
const handler = dk(baseHandler);

exports.handler = handler;
```

## 高阶使用: `Secret` 令牌加密