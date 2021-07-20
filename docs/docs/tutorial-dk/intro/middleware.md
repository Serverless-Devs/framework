---
sidebar_position: 5
title: 中间件编写
---

## 介绍
在编写中间件之前，需要先了解下 `dk` 的设计原理，采用经典的洋葱模型，具体见 [dk设计](/docs/tutorial-dk/intro/design)。

执行顺序如下
```

             --------------------------------------------------------
            |                                                        |
Request --> | before middlewares --> handler --> after middlewares  | ----> Response
            |                                                        |   ↑
             --------------------------------------------------------    |
                                    |                                    |
                                     -------> error middlewares --------

```

- 当发起一个 `Request` 请求时，中间件正常会有两个执行阶段， `before` 和 `after`。
  - `before` 阶段发生在处理程序执行之前，在此代码中，尚未创建响应，只能处理访问请求。  
  - `after` 阶段发生在处理程序执行之后，在此代码中，可以访问请求和响应。

- 在执行中发生异常时，将执行 `error middlewares`。

## dk 实例处理中间件
```
instance.applyMiddleware = (middleware) => {
  const { before, after, onError } = middleware;

  if (!before && !after && !onError) {
    throw new Error(
      'Middleware must be an object containing at least one key among "before", "after", "onError"',
    );
  }

  if (before) instance.before(before);
  if (after) instance.after(after);
  if (onError) instance.onError(onError);
  return instance;
};
```
上诉代码为 `dk` 在处理中间件时的部分逻辑，`dk` 实例会遍历当前引用的中间件方法，提取其中的 `before`，`after`， `onError` 方法。
其中，中间件将返回一个对象，分别提供`before`，`after`， `onError`方法。  


## 开始编写
创建一个最简单的中间件
```
const consoleLogMiddleware = () => {
  const consoleLogMiddlewareBefore= async (request) => {
    console.log('执行了 console log before middleware')
  };

  return {
    before: middlewareBeforeBefore,
  };
};

```
使用中间件
```
use(consoleLogMiddleware());
```