---
sidebar_position: 3
title: 本地调试和部署
---

## 1. 本地启动服务来访问函数

cd 到 rest-api 路径下，默认 cd function

```bash
cd functions && npm install
npm run serve
```

![image](https://gw.alicdn.com/imgextra/i4/O1CN01t4Rsnm1du9lJtBxYw_!!6000000003795-2-tps-1000-275.png)

访问 `http://localhost:7001/api/user` 可以看到如下界面

![image](https://gw.alicdn.com/imgextra/i3/O1CN01YVj5QT1ruWhdV5XH9_!!6000000005691-2-tps-1000-127.png)

## 2. 前端项目配置代理

:::tip

1. package.json 添加 proxy
2. http-proxy-middleware

当在 package.json 文件中添加 proxy 不能满足需求时，可以使用 http-proxy-middleware
:::

### 1. package.json 添加 proxy

```json
{
  // ...
  "proxy": "http://localhost:7001"
}
```

<strong>or</strong>

### 2. http-proxy-middleware

1. 安装

```base npm2yarn
npm install http-proxy-middleware --save
```

2. 在 `src` 目录下新建 `setupProxy.js` 文件

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:7001',
      changeOrigin: true,
    }),
  );
};
```

## 3. 前端页面调用函数接口

1. 安装依赖

```bash npm2yarn
npm install antd axios --save
```

2. `src/App.css` 文件添加

```css
@import '~antd/dist/antd.css';
```

3. `src/App.js` 替换成以下内容

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
      url: '/api/user',
    });
    setMessage(data.title);
  };

  return (
    <div className="App">
      <h1>demo 演示</h1>
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

4. 前端项目本地启动

```bash
npm run start
```

![image](https://gw.alicdn.com/imgextra/i1/O1CN01el66Jr1dsKB79Wz1d_!!6000000003791-1-tps-997-479.gif)

## 4. 部署

```bash
s deploy
```

部署完成之后会返回可访问的域名

![image](https://gw.alicdn.com/imgextra/i4/O1CN01thwoMx28rdfqNUxHX_!!6000000007986-2-tps-1000-296.png)

访问域名会看到如下界面

![image](https://gw.alicdn.com/imgextra/i3/O1CN01rCSybz1Q5Eiwy1zwv_!!6000000001924-1-tps-997-479.gif)
