---
sidebar_position: 1
title: Tablestore数据库
---

## 1. [Serverless Dves 工具安装](/docs/tutorial-dk/intro/quickstart#环境准备)

## 2. 初始化一个模版项目

```bash
s init dk-tablestore
```

下载完成后请输入 tablestore 的实例名称和公网地址，可前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例， 在实例详情页面可以看到 `实例名称` 和 `公网地址`

![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)

请将 `functions/index/index.html` 和 `functions/index/info.html` 的 `baseURL` 值改成自己部署的函数 url

![image](https://img.alicdn.com/imgextra/i3/O1CN01SglMAI1jJPgUwH0Tk_!!6000000004527-2-tps-1000-192.png)

## 3. 部署

```bash
s deploy
```

部署完成之后会返回可访问的域名

![image](https://img.alicdn.com/imgextra/i3/O1CN01elI0a722BbdC1IKLJ_!!6000000007082-2-tps-1000-91.png)

访问域名会看到如下界面

![image](https://img.alicdn.com/imgextra/i2/O1CN017mD9MH1VmoUFufYhw_!!6000000002696-1-tps-997-554.gif)

## 4. 本地调试

```bash
cd functions && npm run serve
```

![image](https://img.alicdn.com/imgextra/i3/O1CN012LvND61nSLsSQhNDT_!!6000000005088-2-tps-1000-360.png)

访问 `http://localhost:7002/api` 可以看到如下界面

![image](https://img.alicdn.com/imgextra/i4/O1CN014aT0k31V1dgtImoX0_!!6000000002593-1-tps-997-554.gif)

## 5. curl 测试

- 创建数据表

```shell
  curl --location --request POST 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/list/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "tableName": "dk_user"
  }'
```

返回数据

```json
{
  "success": true,
  "message": "dk_user表已创建成功"
}
```

- 获取所有表

```shell
curl --location --request GET 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/list/'
```

返回数据

```json
{
  "tableNames": ["dk_user"]
}
```

- 删除数据表

```shell
curl --location --request DELETE 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/list/list/?tableName=dk_user'
```

数据返回

```json
{
  "success": true,
  "message": "dk_user表已删除成功"
}
```

#### 以 dk_user 表为例进行增删改查

- 创建

```shell
curl --location --request POST 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/info/' \
--header 'Content-Type: application/json' \
--data-raw '{
"tableName": "dk_user",
"name": "shl",
"age": 20
}'
```

数据返回

```json
{
  "data": {
    "name": "shl",
    "age": 20
  },
  "message": "数据创建成功"
}
```

- 更新

```shell
curl --location --request PUT 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/info/' \
--header 'Content-Type: application/json' \
--data-raw '{
"tableName": "dk_user",
"id": 1622604175120,
"age": 21,
"name": "dk"
}'
```

数据返回

```json
{
  "data": {
    "id": 1622604175120,
    "name": "dk",
    "age": 21
  },
  "message": "数据更成功"
}
```

- 查寻

```shell
curl --location --request GET 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/info/?tableName=dk_user'
```

数据返回

```js
[
  {
    primaryKey: [
      {
        name: 'id',
        value: 1622604175120,
      },
    ],
    attributes: [
      {
        columnName: 'age',
        columnValue: 21,
        timestamp: 1622604557591,
      },
      {
        columnName: 'name',
        columnValue: 'dk',
        timestamp: 1622604557591,
      },
    ],
  },
];
```

- 删除

```shell
curl --location --request DELETE 'https://1694024725952210.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/dk-tablestore-demo/info/info/?id=1622604175120&tableName=dk_user'
```

数据返回

```json
{
  "id": "1622604175120",
  "message": "数据删除成功"
}
```
