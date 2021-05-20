
# Event 函数
> 本例子可以结合`tablestore-http`使用

# 示例
本例子提供了对数据实体对象 user 进行增删改查的操作
```
id: string; // 主键id
name: string; // 姓名
age: number;  // 年龄
sex: string; // 性别
email: string; // 邮件
verifyCode: string; // 验证码

```

- 点击注册按钮, 对数据进行新增操作。/ register
- tablestore 触发器接收数据的新增操作, 发送邮件给用户进行确认, 用户确认之后, 修改 user 数据
- 通知用户注册成功


直接上传到 FC 控制台
- `触发器`（mail中监听）-> `发送邮件（验证码）` -> `tablestore`(tablestore-http中完成) -> `触发器`（mail中监听） -> `发送邮件（完成）`

## 配置环境变量
> 访问 https://fc.console.aliyun.com/

服务 -> 函数 -> 概览 -> 修改配置 -> 环境变量

{
    "tablestore_endpoint": "tablestore 实例访问地址",
    "tablestore_instanceName": "tablestore 数据表名称"
}

## 配置邮箱及smtp授权吗
// constants.js -> FROM,TO,PASS,SERVIVE

## 配置接口
// index.html -> 修改 URL 字段

const URL = 触发器路径 + 接口名称 + code + id

