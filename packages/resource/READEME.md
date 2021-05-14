## 使用场景

假设这样的场景，希望在云资源 ECS 的中, 读取 OSS 的数据。这里一般有两种使用方式

1. 直接直接通过 AK,SK。操作 OSS 的资源
2. 将 OSS 的一些权限(putBucket,listBucket)给 ECS。

`@serverless-devs/permission`的出现就是为了解决这样的场景

## 使用方式

```
const aliyunTableStoreStreamNotificationRole = new ram.Role("AliyunTableStoreStreamNotificationRole", {
   rolePolicy: {
    "Version": "1",
    "Statement": [
        {
            "Action": [
                "ots:BatchGet*",
                "ots:Describe*",
                "ots:Get*",
                "ots:List*"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "fc:InvokeFunction"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
  },
});
```

## 逻辑设计

1. 查看是否存在相同的 ARN,如果存在则更新掉。
2. 创建角色，同时为角色添加 policy 策略
3. 修改信任策略 https://help.aliyun.com/document_detail/116819.html

- 阿里云账号: RAM
- 阿里云服务: Service
- 身份提供商: Federated

4. 返回 Role 的 RAN 信息

## 参考

1. SDK 以及文档
   https://next.api.aliyun.com/api/Ram/2015-05-01/SetAccountAlias?params={}
   https://next.api.aliyun.com/api-tools/sdk/Ram?version=2015-05-01&language=nodejs-tea
