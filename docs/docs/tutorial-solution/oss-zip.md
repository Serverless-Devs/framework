---
sidebar_position: 1
title: oss zip包上传解压
---

## 1. 初始化

```bash
s init dk-oss-unzip
```

![image](https://img.alicdn.com/imgextra/i3/O1CN01l0UIVY1t8YSHNKqxa_!!6000000005857-2-tps-1000-356.png)

根据交互式的提示给文件夹命名：`dk-oss-unzip`

使用已有的[oss](https://oss.console.aliyun.com/) Bucket: `dk-oss-unzip-bucket-demo`

输入触发规则前缀： `source/`

输入触发规则后缀： `.zip`

输入文件解压后的目标目录： `target/`

新建或者选择已有的密钥，新建密钥可前往[阿里云密钥获取](https://www.serverless-devs.com/docs/provider-config/alibabacloud)查看。

## 2. 部署

```bash
s deploy
```

部署成功后返回如下结果

```yaml
rest-api:
  - region: cn-hangzhou
    service:
      name: dk-oss-unzip-demo
      role: acs:ram::1694024725952210:role/fcdeploydefaultrole-dk-oss-unzip-demo
      import: true
      protect: false
    function:
      name: unzip
      description: This is default function description by fc-deploy component
      handler: index.handler
      memorySize: 512
      timeout: 60
      instanceConcurrency: 1
      instanceType: e1
      runtime: nodejs12
      layers:
        - >-
          8c8bcc8aea0d88d312bdf8eef5c7a347#function-component-system-layer-dk-oss-unzip-demo#1
      environmentVariables:
        bucket_name: dk-oss-unzip-bucket-demo
        filter_prefix: source
        filter_target: target
      codeUri: /Users/shihuali/learn/a/dk-oss-unzip/.s/functions/unzip
      serviceName: dk-oss-unzip-demo
    triggers:
      - name: ossTrigger
        type: oss
        config:
          events:
            - oss:ObjectCreated:*
          bucketName: dk-oss-unzip-bucket-demo
          filter:
            Key:
              Prefix: source/
              Suffix: .zip
        role: >-
          acs:ram::1694024725952210:role/fcdeploycreaterole-dk-oss-unzip-demo-unzip
        serviceName: dk-oss-unzip-demo
        functionName: unzip
```

## 3. 测试

- 前往 [oss 控制台](https://oss.console.aliyun.com), 进入 bucket 详情页面。
- 新建 `source` 目录，上传 `.zip` 包。
- `source` 同级目录查看是否有 `target` 目录，且 `target` 目录里包含 `.zip` 包解压的文件。

![image](https://img.alicdn.com/imgextra/i1/O1CN01r3M6F121MlffNMoCS_!!6000000006971-1-tps-992-623.gif)
