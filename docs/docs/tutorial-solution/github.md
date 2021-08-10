---
sidebar_position: 3
title: github 事件
---

## 介绍
`dk` 集成了 [Github Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) 的 `events` 事件监听， 如 `push`、`issues`、`event` 等事件。通过 `dk` 部署的 `FC` 函数，在 `FC` 函数中添加事件监听，可以在代码提交到 `github` 仓库时，自动触发并执行相关操作，效果如 [Github Action](https://docs.github.com/cn/actions) 的自动化脚本的能力类似。

#### 场景：
- 个人博客
如： `github` 仓库 `README.md` 文档更新 => 触发 `Github Webhooks` => 触发 `dk-github` 函数 `onEvent` 事件=> 同步更新博客

## 快速体验
### 第一步
- 通过 `s init dk-github` 快速部署一个 `FC` 函数，如`dk-github-demo`。
- 根据指令输入 `path`，`secret`。
- `s deploy` 部署，得到 `FC` 触发器地址 `Url`。

![img](https://img.alicdn.com/imgextra/i1/O1CN01f9WZaM1y9zmP983zK_!!6000000006537-0-tps-2344-590.jpg)

如下代码，`Url + path` 即第二步中 `Github Webhooks` 的 `Payload URL`。

```
const { dk, githubHandler } = require('@serverless-devs/dk');

const github = githubHandler({ path: '/webhooks' });

github.onEvent(data => console.log('监听event', data.event));

const baseHandler = (ctx) => {
  const data = github(ctx.req);
  return {
    json: data
  };
};

const handler = dk(baseHandler);

exports.handler = handler;
```

### 第二步
- 创建一个 `Github` 仓库，如 `github-webhooks`。
- 到 `github-webhooks` 下 `Settings`，配置 `Github Webhooks` 监听，将 `Payload URL` 指向自己 `FC` 函数指定的接口，如 `https://xxx.cn-xxx.fc.aliyuncs.com/2016-08-15/proxy/dk-github-demo/webhooks`

![img](https://img.alicdn.com/imgextra/i4/O1CN01y60HqD1pKgTznR8Qt_!!6000000005342-2-tps-2834-1020.png)

![img](https://img.alicdn.com/imgextra/i1/O1CN01SD0Hyh1DElyIDjbHV_!!6000000000185-0-tps-2780-1358.jpg)

### 第三步
- 将任意代码关联到 `dk-github-demo` Github 仓库。
> 当 `Github` 收到 `Repo` 的操作行为时，会向指定的 `Payload URL` 发送一个带有描述操作内容的 `Post` 请求。
> 如下，当代码发生事件，如 `issues`、`push` 操作时，函数将监听并执行 `onEvent` 方法。

```
github.onEvent(data => {
  console.log('监听event', data.event)
});
```
![img](https://img.alicdn.com/imgextra/i3/O1CN01QM48eL1E2EkBWUq84_!!6000000000293-0-tps-2424-976.jpg)
## 高阶使用: `Secret` 令牌加密
> 在 `Github Webhooks` 中，配置了 `secret`, 当 `Repo` 操作 发起的发起的请求时，将携带 `secret` 加密令牌。

```
const { dk, githubHandler } = require('@serverless-devs/dk');
const github_path = process.env.github_path;
const github_secret = process.env.github_secret;

const github = githubHandler({ path: github_path, secret: github_secret });

github.onEvent(data => console.log('监听event', data.event));

const baseHandler = (ctx) => {
  const data = github(ctx.req);
  return {
    json: data
  };
};

const handler = dk(baseHandler);

exports.handler = handler;
```

## 常见事件
event 事件 | 类型 | 描述
---- | --- | ---
onEvent     | Function(data) => void      | 任何时候触发任何事件
onPush      | Function(data) => void      | 任何 git 推送到存储库。这是默认事件
onIssues    | Function(data) => void      | 打开或关闭issue
onIssueComment | Function(data) => void   | 对issue发表评论
onError     | Function(err, req) => void  | 发生错误

更多事件，参考 [Webhooks events & Payloads](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads)

## Event Data
type | 说明
--- | --- 
event | x-github-event
id    | x-github-delivery
payload | 请求体
protocol  | --
host  | --
url | --
path  | --
