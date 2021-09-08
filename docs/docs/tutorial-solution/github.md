---
sidebar_position: 3
title: dk-github 监听 Webooks
---

## 介绍
`dk` 集成了 [Github Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) 的 `events` 事件监听， 如 `push`、`issues`、`event` 等事件。通过 `dk` 部署的 `FC` 函数，在 `FC` 函数中添加事件监听，可以在代码提交到 `github` 仓库时，自动触发并执行相关操作，效果如 [Github Action](https://docs.github.com/cn/actions) 的自动化脚本的能力类似。

#### 场景：
- 个人博客
如： `github` 仓库 `README.md` 文档更新 => 触发 `Github Webhooks` => 触发 `dk-github` 函数 => 同步更新博客

## 快速体验
### 第一步
- 通过 `s init dk-github` 快速部署一个 `FC` 函数，如`dk-github-demo`。
- 根据指令输入 `secret`， 即 Github Webhooks 的 secret 令牌。
- `s deploy` 部署，得到 `FC` 触发器地址 `URL`。

![img](https://img.alicdn.com/imgextra/i1/O1CN01f9WZaM1y9zmP983zK_!!6000000006537-0-tps-2344-590.jpg)

如下代码，`Url + path` 即第二步中 `Github Webhooks` 的 `Payload URL`，默认为根路径 '/'。

```
const { github } = require('@serverless-devs/dk');

const handler = github({
  handler: (ctx) => {
    // 自定义内容
  },
  config: { path: '/webhooks' }
});

exports.handler = handler;
```

### 第二步
- 创建一个 `Github` 仓库，如 `github-webhooks`。
- 到 `github-webhooks` 下 `Settings`，配置 `Github Webhooks` 监听，将 `Payload URL` 指向自己 `FC` 函数指定的接口，如 `https://xxx.cn-xxx.fc.aliyuncs.com/2016-08-15/proxy/dk-github-demo/index/webhooks`

![img](https://img.alicdn.com/imgextra/i4/O1CN01y60HqD1pKgTznR8Qt_!!6000000005342-2-tps-2834-1020.png)

![img](https://img.alicdn.com/imgextra/i1/O1CN01SD0Hyh1DElyIDjbHV_!!6000000000185-0-tps-2780-1358.jpg)

### 第三步
- 将任意代码关联到 `dk-github-demo` Github 仓库。
> 当 `Github` 收到 `Repo` 的操作行为时，会向指定的 `Payload URL` 发送一个带有描述操作内容的 `Post` 请求。
> 如下，当代码发生事件，如 `issues`、`push` 操作时，函数将监听并执行 handler。

```
const handler = github({
  handler: (ctx) => {
    if (ctx.code  === 200) {
      console.log('监听event', ctx.github.data.event),
    }
  }
  config: { path: '/webhooks' }
});
```
![img](https://img.alicdn.com/imgextra/i3/O1CN01QM48eL1E2EkBWUq84_!!6000000000293-0-tps-2424-976.jpg)
## 高阶使用
### `Secret` 令牌加密
> 在 `Github Webhooks` 中，配置了 `secret`, 当 `Repo` 操作 发起的发起的请求时，将携带 `secret` 加密令牌。

```
const { github } = require('@serverless-devs/dk');
const github_secret = process.env.github_secret;

const handler = github({
  handler: (ctx) => {
    if (ctx.code  === 200) {
      console.log('监听成功'),
    }
  }
  config: { path: '/webhooks', secret: github_secret }
});

exports.handler = handler;
```

## Github Options Apis
事件 | 类型 | 描述
---- | --- | ---
handler    | Function(ctx) => void      | github event事件
config     | Object      | github 配置
httpOpts   | Object      | http 函数 options 配置，具体见 [& HTTP 设计](/docs/tutorial-dk/intro/http)

### Apis： Config
参数 |说明
--- | ---
path | 请求路径
secret | 令牌密匙

### Apis： Handler
通过 `const { github } = ctx;`， 可拿到当前 github 事件携带的内容。

## Event Github
type |说明
--- | ---
code | 返回code
message | 消息提示
data | github 监听成功后，返回 github event 所有数据

## Github.Data
type |说明
--- | ---
event | X-Github-Event 请求头， 指当前的事件类型，如 `issues`、`push` 等
id    | X-Github-Delivery 请求头，请求ID
payload | 请求体，包含事件所有的详细信息
protocol  | --
host  | --
path  | 接口，默认为`/`
url | --
