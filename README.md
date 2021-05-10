# 内置middlewares

## request 转化

1. http-json-body-parser 自动使用`application/json`解析HTTP请求，并将改body转化为JOSN object。
2. http-form-body-parser 自动为`application/x-www-form-urlencoded`的HTTP请求，并将body转化为对象
3. http-urlencode-path-parser 自动解析带有URL编码路径的HTTP请求。
4. validator 根据自定义schemas自动验证传入events和传出response

## response 转化

1. http-response-parser

- html: `content-type`为`text/html; charset=utf8`
- css: `content-type`为`text/css; charset=utf8`
- js: `content-type`为`text/javascript; charset=utf8`
- text: `content-type`为`text/plain; charset=utf8`
- json: `content-type`为`application/json; charset=utf8`
- xml: `content-type`为`application/xml; charset=utf8`

2. apigateway-response-parser







