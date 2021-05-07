# 解决问题
## serverless-devs
#### serverless-devs解决的问题
- 简单、快捷的“上手”主流 Serverless 服务和框架
- 存量应用迁移(express, falsk, spring-boot)
- 部署,运维,调试等生命周期发挥作用

#### 没有解决的问题
- 用户的开发态
- 函数计算开发的最佳实践

#### 遗留问题
- s.yml非常复杂，假设有10个函数，每个函数的配置均不一致?
- s deploy全量部署是否有必要? 如果用户知道只部署user函数，是不是`s deploy user`。甚至能提示用户哪些改动的需要部署?

## 生态对比
#### midway-serverless
- 无厂商绑定
- 前后端一体化,所有代码部署在一个函数中
- 支持serverles应用和常规单体应用互相转换
- 对egg用户比较友好,熟悉的编程方式进行serverless化

#### malagu
- 无厂商绑定
- 前后端一体化
- 微服务
- 依赖注入
- ....

#### amplify-js
- 为aws amplify产品服务的SDK框架
- 由lambda衍生的JAMstack理念的产品
#### firebase-functions
- 为firebase产品服务的SDK框架
- 由gcp-function衍生的JAMstack理念的产品

## FC函数计算的问题
1. http函数问题
  ```
  var getRawBody = require('raw-body');
  var getFormBody = require('body/form');
  var body = require('body');

  /*
  To enable the initializer feature (https://help.aliyun.com/document_detail/156876.html)
  please implement the initializer function as below：
  exports.initializer = (context, callback) => {
    console.log('initializing');
    callback(null, '');
  };
  */

  exports.handler = (req, resp, context) => {
      console.log('hello world', context);

      var params = {
          path: req.path,
          queries: req.queries,
          headers: req.headers,
          method : req.method,
          requestURI : req.url,
          clientIP : req.clientIP,
      }
          
      getRawBody(req, function(err, body) {
          for (var key in req.queries) {
            var value = req.queries[key];
            resp.setHeader(key, value);
          }
          params.body = body.toString();
          resp.send(JSON.stringify(process.env, null, '    '));
      }); 
        
      /*
      getFormBody(req, function(err, formBody) {
          for (var key in req.queries) {
            var value = req.queries[key];
            resp.setHeader(key, value);
          }
          params.body = formBody;
          console.log(formBody);
          resp.send(JSON.stringify(params));
      }); 
      */
  }
  ```
  - raw-body, body的包从哪里来?
  - 我要返回JSON数据怎么办
  - 我有一个user的表，进行增删改查是一个函数还是使用switch case来解决？

2. event函数问题
  ```
  exports.handler = (event, context, callback) => {
    console.log('hello world');
    callback(null, 'hello world');
  }
  ```
  - callback几个参数含义?
  - callback调用时机?

# 整体架构
### 完整生命周期
![lifecycle](
https://img.alicdn.com/imgextra/i2/O1CN01d8pfdj1dihqU8SQzT_!!6000000003770-2-tps-1324-812.png)

### 初始化示例
![init](https://img.alicdn.com/imgextra/i1/O1CN010V5nQ51ociRAzvObH_!!6000000005246-1-tps-1140-747.gif)
### 结构图
![architect](
https://img.alicdn.com/imgextra/i1/O1CN01rdmubh1pR60RuIDf5_!!6000000005356-2-tps-1284-962.png
)

# 约定
1. 以on开头的一般用于监听触发器的场景。比如`http.onRequest`代表http的request触发
2. 非http触发器返回值，如果是`return new Error('message')`或者`throw new Error('message')` 时候代表触发器执行失败，如果正常return 则代表执行成功

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
  //出错直接 throw new Error("fail");
})
```

# 参考

1. [arc doc](https://arc.codes/docs/ena/reference/app.arc/tables)
2. [arc-functions](https://github.com/architect/functions)
3. [sst doc](https://docs.serverless-stack.com/)


# TODO能力建设
## layer层管理
将`@serverless-devs/functions`依赖打到公共的[layer](https://help.aliyun.com/document_detail/193057.html)中。减少函数代码包体积，加快函数的发布速度。
