# 如何开发？

- 在根目录下安装依赖

```shell
npm install
```

- 为各个包安装依赖并建立软连接

```
lerna bootstrap
```

# 内置 middlewares

## request 转化

1. http-json-body-parser 自动使用`application/json`解析 HTTP 请求，并将改 body 转化为 JOSN object。
2. http-form-body-parser 自动为`application/x-www-form-urlencoded`的 HTTP 请求，并将 body 转化为对象
3. http-urlencode-path-parser 自动解析带有 URL 编码路径的 HTTP 请求。(福山)
4. validator 根据自定义 schemas 自动验证传入 events 和传出 response (华力)

## response 转化

1. http-response-parser (华力)

- html: `content-type`为`text/html; charset=utf8`
- css: `content-type`为`text/css; charset=utf8`
- js: `content-type`为`text/javascript; charset=utf8`
- text: `content-type`为`text/plain; charset=utf8`
- json: `content-type`为`application/json; charset=utf8`
- xml: `content-type`为`application/xml; charset=utf8`

2. apigateway-response-parser (华力)

3. initialzer 守帅

4. auth(auth2.0, jwt, cookie)
