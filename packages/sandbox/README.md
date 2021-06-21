#### 基本用法

sandbox 接收参数说明

- `p or port` 来指定端口
- `projectName` 来指定启动服务的项目名称（默认取第一个）

你可以直接在 package.json 添加如下配置

```json
{
  "scripts": {
    "server": "sandbox"
  }
}
```

然后 执行 `npm run server` 就可以访问 `http://localhost:3000` 了

当然，你也可以指定端口进行访问

```json
{
  "scripts": {
    "server": "sandbox -p 7000"
    // or
    // "server": "sandbox --port 7000"
  }
}
```

然后 执行 `npm run server` 就可以访问 `http://localhost:7000` 了

具体可参考应用案例 [dk-tablestore](https://github.com/devsapp/dk-example/tree/master/dk-tablestore)
