---
title: 添加Tablestore数据库
---

## 1. 创建 tablestore 实例

前往 [tablestore 控制台](https://otsnext.console.aliyun.com/)创建实例， 在实例详情页面可以看到 `实例名称` 和 `公网地址`

![image](https://img.alicdn.com/imgextra/i2/O1CN01VF6kv724mMdiMPC9q_!!6000000007433-2-tps-2184-1190.png)

## 2. `根目录` 下 创建 `.env` 文件

```bash
tablestore_endpoint = 'your_tablestore_endpoint'
tablestore_instanceName = 'your_tablestore_instanceName'
```

## 3. `.gitignore` 添加 `.env`

```bash
# ...
.env
```

## 4. 新建路由

```bash
s cli init api
```

![image](https://img.alicdn.com/imgextra/i2/O1CN01q5OkS41OFC6b3WLHU_!!6000000001675-2-tps-1000-66.png)

## 5. 函数`listTable/index.js`替换成以下内容

```js
const { dk, tablestoreInitialzerPlugin } = require('@serverless-devs/dk');

const baseHandler = async (ctx) => {
  const { tableClient } = ctx.internal;
  const data = await tableClient.listTable();
  return { json: data };
};

const handler = dk(baseHandler);

handler.use(tablestoreInitialzerPlugin());

exports.handler = handler;
```

## 6. 本地启动服务来访问函数

为了让数据看的更直观，我们可以前往[tablestore 控制台](https://otsnext.console.aliyun.com/)实例详情页，创建一个数据表，比如就叫`dk_user`

```bash
npm run serve
```

![image](https://img.alicdn.com/imgextra/i4/O1CN01qHWh4J1xushtm2DYy_!!6000000006504-2-tps-1000-300.png)

访问 `http://localhost:7001/api/listTable` 可以看到如下界面

![image](https://img.alicdn.com/imgextra/i4/O1CN013IJFxC1OH1gdI9Ccc_!!6000000001679-2-tps-1000-142.png)

## 7. 前端页面调用函数接口

1. `src/App.js` 替换成以下内容

```js
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';

const defaultValue = 'hello, this is a default value';

function App() {
  const [message, setMessage] = useState(defaultValue);

  const fetchData = async () => {
    const { data } = await axios({
      url: '/api/listTable',
    });
    setMessage(data.tableNames);
  };

  return (
    <div className="App">
      <h1>jamstack-react demo 演示</h1>
      <Button type="primary" onClick={fetchData}>
        发起调用
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={() => setMessage(defaultValue)}>
        重置
      </Button>
      <div style={{ marginTop: 16 }}>{message}</div>
    </div>
  );
}

export default App;
```

2. 前端项目本地启动

```bash
npm run start
```

![image](https://img.alicdn.com/imgextra/i3/O1CN01dbfxzz1yuiAxYoJ7G_!!6000000006639-1-tps-997-554.gif)

## 8. 部署

```bash
s deploy
```

部署完成之后会返回可访问的域名

![image](https://img.alicdn.com/imgextra/i2/O1CN01h2kfmo21ed79fyZtJ_!!6000000007010-2-tps-1000-285.png)

访问域名会看到如下界面

![image](https://img.alicdn.com/imgextra/i4/O1CN010C0QYP1HvbSxqEP3y_!!6000000000820-1-tps-997-554.gif)
