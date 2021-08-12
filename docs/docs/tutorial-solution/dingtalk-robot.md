---
sidebar_position: 4
title: dingtalk-robot
---

> 注：钉钉机器人暂不支持应答机制 ：[自定义机器人接入 - 钉钉开放平台 (dingtalk.com)](https://developers.dingtalk.com/document/robots/custom-robot-access)



# 引入 & 初始化

```
const { DtalkRobot } = require('@serverless-devs/dk');
const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=xxx'
const ding = new DtalkRobot(webhook)

//可以加签
const dingWithSecret = new DtalkRobot({
	webhook,
	secret:'xxx'
})
```



## 使用

### 发送 text 类型消息

```js
const content = 'hello DkRobot!'
ding.sendText(content)

//@ 全体
ding.sendText(content,true)

//指定被@人的用户 手机号
const mobiles = ['180561xxxxx', '180562xxxxx', '180563xxxxx']
ding.sendText(content, mobiles)

//指定被@人的用户 userid
const userIds = ['a', 'b', 'c']
ding.sendText(content, userIds)
```



###发送 link 类型消息

```js
const link = {
        "text": "", 
        "title": "", 
        "picUrl": "", 
        "messageUrl": ""
    }

ding.sendLink(link)
```



###发送 markdown类型

```js
const title = '杭州天气'
const text = `#### 杭州天气 @150XXXXXXXX \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n`

ding.sendMd(title, text)

//@ 全体
ding.sendMd(title, text, true)

//指定被@人的用户 手机号
const mobiles = ['180561xxxxx', '180562xxxxx', '180563xxxxx']
ding.sendMd(title, text, mobiles)

//指定被@人的用户 userid
const userIds = ['a', 'b', 'c']
ding.sendMd(title, text, userIds)
```



### 发送 actionCard 消息类型

```js
//整体跳转ActionCard类型

const actionCardSingle = {
    title:`乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身`,
    text:`![screenshot](https://gw.alicdn.com/tfs/TB1ut3xxbsrBKNjSZFpXXcXhFXa-846-786.png) 
 ### 乔布斯 20 年前想打造的苹果咖啡厅 
 Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划`,
    btnOrientation:"0",
    singleTitle:"阅读全文",
    singleURL:"https://www.dingtalk.com/"
    
}
ding.sendActionCard(actionCardSingle)

//独立跳转ActionCard类型
const actionCardBtns = {
    title:`乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身`,
    text:`![screenshot](https://gw.alicdn.com/tfs/TB1ut3xxbsrBKNjSZFpXXcXhFXa-846-786.png) 
 ### 乔布斯 20 年前想打造的苹果咖啡厅 
 Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划`,
    btnOrientation:"0",
    singleTitle:"阅读全文",
    singleURL:"https://www.dingtalk.com/"
    
}

ding.sendActionCard(actionCardBtns)
```



### 发送 feedCard 类型消息

```js
const feedCard = [
            {
                "title": "时代的火车向前开1", 
                "messageURL": "https://www.dingtalk.com/", 
                "picURL": "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
            },
            {
                "title": "时代的火车向前开2", 
                "messageURL": "https://www.dingtalk.com/", 
                "picURL": "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
            }
        ]

ding.sendFeedCard(feedCard)
```





