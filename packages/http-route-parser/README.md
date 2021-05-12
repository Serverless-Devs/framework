## 设计原则

1. 正常情况下一个函数处理一个业务，比如对于应用来说一个函数获取应用列表。
2. 假设我们需要对一个实体对象 app 进行 crud 操作，是不是要搞多个函数?还是在一个函数中解决?
3. 如果我们要在一个函数中解决? 使用 switch-case 很不优雅

```
const listHandler = (req, context) => {
	return { body: {"success": true} }
}
middy.use("http-route-parser({
  'get /list': 'listHandler',
  'get /add': 'addHandler',
  'get /delete': 'deleteHandler',
})")
```

## 基础使用方式

## 高级使用方式
