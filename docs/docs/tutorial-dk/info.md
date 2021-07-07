---
sidebar_position: 1
title: DK起源
---

## 为什么出现DK
我们从传统的web框架和纯函数的两个维度进行对比和分析

### 传统web框架
开发者需要开发一个serverless应用的时候，一般会想到使用传统的web框架。比如nodejs生态的express,egg,koa等。框架提供了良好的编程体验，但是随着业务的发展也会遇到很多的挑战。

比如一个购物网站的应用
![Alt text](https://img.alicdn.com/imgextra/i4/O1CN015upYXp1hHv9wmkAdu_!!6000000004253-2-tps-1408-636.png)

商品入库的操作频率非常低，可能一天时间也不会发生几次。但是商品查询的频率每秒可能发生查询上万次。由于所有的请求都经过同一个框架，如果需要满足性能的要求，只能按照最高规格的来配置函数。非常不灵活而且造成一定的浪费

### 纯函数
纯函数可以灵活的配置每个函数的
首先来看一段官方的示例
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
    console.log('hello world');
    console.log(JSON.stringify(context))

    var params = {
        path: req.path,
        queries: req.queries,
        headers: req.headers,
        method : req.method,
        requestURI : req.url,
        clientIP : req.clientIP,
    }
        
    getRawBody(req, function(err, body) {
        // for (var key in req.queries) {
        //   var value = req.queries[key];
        //   resp.setHeader(key, value);
        // }
        // params.body = body.toString();
        resp.send(JSON.stringify(context, null, '    '));
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
纯函数的方式需要用户手动处理http request, response等，编程体验非常糟糕。

# serverless 编程框架DK
#### 快速入门
一码胜千言，假设你在构建一个Rest API应用
```
const { dk } = require('@serverless-devs/dk');

const handler = dk((ctx) => {
  // ctx 包含 ctx.req 可获取入参信息
  return {
    json: { title: 'hello serverless devs' },
  };
});

exports.handler = handler;
```
#### 具体使用查看[DK使用](/doc/tutorial-dk/dk)