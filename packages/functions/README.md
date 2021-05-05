# 整体架构
![architect](
https://img.alicdn.com/imgextra/i1/O1CN01rdmubh1pR60RuIDf5_!!6000000005356-2-tps-1284-962.png
)

# initializer
Initializer函数是实例的初始化函数，保证同一实例成功且仅成功执行一次。可以用来数据库连接等初始化操作。


## initializer.onCall

```
initializer.onCall(context => {
  return null; // 出错时候throw new ERROR
})
```

返回值参考函数计算事件触发器返回值。

# http

```
const { http } = require('@serverless-devs/functions')
// on开头的代表是触发器形式

http.onRequest((request, context)=> {

}, auth);

```

## onRequest(http 触发器)

### 基础使用

```
https.onRequest((request, content) => {

}, auth);
```

#### request

| 字段     |    类型     | 描述                                                                 |
| -------- | :---------: | :------------------------------------------------------------------- |
| headers  | Object 类型 | 存放来自 HTTP 客户端的键值对。                                       |
| path     | String 类型 | 表示 HTTP 路径。                                                     |
| queries  | Object 类型 | 存放来自 HTTP 路径中的查询部分的键值对，值的类型可以为字符串或数组。 |
| method   | String 类型 | 表示 HTTP 方法。                                                     |
| clientIP | String 类型 | 客户端的 IP 地址。                                                   |
| url      | String 类型 | 请求的地址。                                                         |

#### context

定义如下:

```
{
  'requestId': 'b1c5100f-819d-c421-3a5e-7782a27d8a33',
  'credentials': {
    'accessKeyId': 'STS.access_key_id',
    'accessKeySecret': 'access_key_secret',
    'securityToken': 'security_token',
  },
  'function': {
    'name': 'my-func',
    'handler': 'index.handler',
    'memory': 128,
    'timeout': 10,
    'initializer': 'index.initializer',
    'initializationTimeout': 10,
  },
  'service': {
     'name': 'my-service',
     'logProject': 'my-log-project',
     'logStore': 'my-log-store',
     'qualifier': 'qualifier',
     'versionId': '1'
  },
  'region': 'cn-shanghai',
  'accountId': '123456'
}
```

| 字段        |                                                                                                                                            类型                                                                                                                                             |
| ----------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| requestId   |                                                                                                             本次调用请求的唯一 ID，您可以把它记录下来在出现问题的时候方便查询。                                                                                                             |
| function    |                                                                                                          当前调用的函数的一些基本信息，例如函数名、函数入口、函数内存和超时时间。                                                                                                           |
| credentials | 函数计算服务通过扮演您提供的服务角色获得的一组临时密钥，其有效时间是 6 小时。您可以在代码中使用 credentials 去访问相应的服务（ 例如 OSS ），这就避免了您把自己的 AK 信息写死在函数代码里。权限相关内容请参见[权限简介](https://help.aliyun.com/document_detail/52885.htm#concept-2259921)。 |
| service     |                     当前调用的函数所在的 service 的信息，包含 service 的名字、接入的 SLS 的 logProject 和 logStore 信息、service 的版本信息、qualifier 和 version_id。其中 qualifier 表示调用函数时指定的 service 版本或别名，version_id 表示实际调用的 service 版本。                      |
| region      |                                                                                                                         当前调用的函数所在区域，例如 cn-shanghai。                                                                                                                          |
| accountId   |                                                                                                                            当前调用函数用户的阿里云 Account ID。                                                                                                                            |

#### response

1. 标准的返回形式

- statusCode
- headers
- deleteHeaders
- body

2. 快捷返回参数(https://github.com/architect/functions/blob/master/src/http/_res-fmt.js)

| 参数名称     |                                  描述                                  | 默认值 |
| ------------ | :--------------------------------------------------------------------: | :----- |
| cacheControl |                    设置 Cache-Control 的 header 头                     |        |
| cors         |      为 true 则设置 Access-Control-Allow-Origin 的 header 头为 \*      | false  |
| session      |                          将值写入 session 中                           |        |
| html         |    如果有值设置 Content-Type 的 header 头为 text/html; charset=utf8    |        |
| js           | 如果有值设置 Content-Type 的 header 头为 text/javascript; charset=utf8 |        |
| css          |    如果有值设置 Content-Type 的 header 头为 text/css; charset=utf8     |        |
| text         |  如果有值设置 Content-Type 的 header 头为 to text/plain; charset=utf8  |        |
| xml          |   如果有值设置 Content-Type 的 header 头为 to text/xml; charset=utf8   |        |
| json         |       如果有值设置 Content-Type 的 header 头为 application/json        |        |
| type         |                     设置 Content-Type 的 header 头                     |        |

#### auth

### 高级使用

```
// 添加
const addRouter = (request, context) => {
  return {
    statusCode: 200,
    body: {
      message: 'add success',
    },
  };
};

// 删除
const deleteRouter = (request, context) => {
  return {
    statusCode: 200,
    body: {
      message: 'delete success',
    },
  };
};

https.onRequest({
  'GET /user': addRouter,
  'POST /user{id}': deleteRouter,
}, auth);
```

# table

## tablestore 触发器 (https://help.aliyun.com/document_detail/100092.html)

```
let { table } = require('@serverless-devs/functions')
table.addTrigger({
  name: 'xx',
  instance: 'xx',
  tableName: 'xx',
  permissions: '',
})
table.attachPermissions(permissions);

table.onTrigger((event,context) => {

})
```

## tablestore 基本操作

```
const { table } = require('@serverless-devs/functions');
const client = table.client({
  endpoint, // <your endpoint>,
  instancename, // <your instance name>
})
const data = await client.createTable(params);
```

# oss bucket

## 触发器

```
const { bucket } = require('@serverless-devs/functions');
bucket.addTrigger({
  name: 'xx',
  events: ['oss:ObjectCreated:*', 'oss:ObjectCreated:PutObject'],
  rule: {
    prefix: 'static/'
    prefix: '.zip'
  },
  permissions: xx
});

// 添加权限
bucket.attachPermissions(permissions);

bucket.onTrigger((event, context) => {

})
```

## oss bucket 操作

```
const { bucket } = require('@serverless-devs/functions');
const client = bucket.client({
  bucket: 'xxx'
});
```

## oss+函数计算解决方案
### ZIP包解压
Zip 包自动解压，是利用阿里云函数计算产品，设置自动触发器，对压缩包自动解压的处理。


# 其他

## events

```
const { events } = require('@serverless-devs/functions');
events.onTrigger((event, context) => {
  return 'success'
  //出错直接throw throw new Error("fail");
})
```

# 参考

1. [arc doc](https://arc.codes/docs/ena/reference/app.arc/tables)
2. [arc-functions](https://github.com/architect/functions)
3. [sst doc](https://docs.serverless-stack.com/)


# TODO能力建设
## layer层管理
将`@serverless-devs/functions`依赖打到公共的[layer](https://help.aliyun.com/document_detail/193057.html)中。减少函数代码包体积，加快函数的发布速度。
