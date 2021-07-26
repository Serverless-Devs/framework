---
title: 添加oss触发器函数
---

## 1. 添加 api 到您的应用程序中

```bash
s cli init api
```

![image](https://img.alicdn.com/imgextra/i2/O1CN01rpvRpI1k5VGvekx82_!!6000000004632-2-tps-1000-73.png)

## 2. `functions/oss/index.js`替换成以下内容

```js
const { oss } = require('@serverless-devs/dk');
/**
 * oss.onObjectCreated 默认触发事件： 'oss:ObjectCreated:*'
 * oss.onObjectRemoved 默认触发事件： 'oss:ObjectRemoved:DeleteObject', 'oss:ObjectRemoved:DeleteObjects', 'oss:ObjectRemoved:AbortMultipartUpload'
 * 如果以上两个方法的触发事件不能满足需求的时候，可以使用 oss.onEvent 方法接收 events参数来自定义触发事件
 */

const baseHandler = (ctx) => {
  // ctx 包含 ctx.event 可获取入参信息
  // 写一些自己的代码逻辑, 比如文件解压，图片添加水印等
};

const handler = oss.onObjectCreated({
  handler: baseHandler,
  oss: {
    bucketName: 'your_bucket',
    filter: {
      prefix: '前缀，比如：source',
      suffix: '后缀，比如：png',
    },
  },
});

exports.handler = handler;
```

## 3. 部署

```bash
s deploy
```

部署完成之后返回如下结果

```yaml
rest-api:
  customDomain: >-
    jamstack-api.system.rest-api-demo.1694024725952210.cn-hangzhou.fc.devsapp.net
  fc-deploy-response:
    - region: cn-hangzhou
      service:
        name: rest-api-demo
        role: acs:ram::1694024725952210:role/fcdeploydefaultrole-rest-api-demo
        import: true
        protect: false
      function:
        name: user
        description: This is default function description by fc-deploy component
        handler: index.handler
        memorySize: 128
        timeout: 3
        instanceConcurrency: 1
        instanceType: e1
        runtime: nodejs10
        layers:
          - >-
            8c8bcc8aea0d88d312bdf8eef5c7a347#function-component-system-layer-rest-api-demo#1
        codeUri: /Users/shihuali/learn/a/website-react/.s/functions/user
        serviceName: rest-api-demo
      systemDomain: >-
        https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/rest-api-demo/user/
      triggers:
        - name: LATEST
          type: http
          qualifier: LATEST
          config:
            authType: anonymous
            methods:
              - GET
              - POST
              - PUT
              - DELETE
              - HEAD
          serviceName: rest-api-demo
          functionName: user
      customDomains:
        - domainName: >-
            http://jamstack-api.system.rest-api-demo.1694024725952210.cn-hangzhou.fc.devsapp.net
          protocol: HTTP
          routeConfigs:
            - path: /user
              functionName: user
              serviceName: rest-api-demo
              methods:
                - GET
                - POST
                - PUT
                - DELETE
                - HEAD
    - region: cn-hangzhou
      service:
        name: rest-api-demo
        role: acs:ram::1694024725952210:role/fcdeploydefaultrole-rest-api-demo
        import: true
        protect: false
      function:
        name: oss
        description: This is default function description by fc-deploy component
        handler: index.handler
        memorySize: 128
        timeout: 3
        instanceConcurrency: 1
        instanceType: e1
        runtime: nodejs10
        layers:
          - >-
            8c8bcc8aea0d88d312bdf8eef5c7a347#function-component-system-layer-rest-api-demo#1
        codeUri: /Users/shihuali/learn/a/website-react/.s/functions/oss
        serviceName: rest-api-demo
      triggers:
        - name: ossTrigger
          type: oss
          config:
            events:
              - oss:ObjectCreated:*
            bucketName: shl-bucket
            filter:
              Key:
                Prefix: img
                Suffix: png
          role: acs:ram::1694024725952210:role/fcdeploycreaterole-rest-api-demo-oss
          serviceName: rest-api-demo
          functionName: oss
website-starter:
  Region: cn-hangzhou
  Bucket: website-react-bucket
  Domains:
    - >-
      website-react-project-f508b5ad21e848f54f46dfd66acec16e.jamstack.devsapp.net
```
