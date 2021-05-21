# HTTP 函数
> 本例子结合`mail-event`使用，直接上传到 FC 控制台

整个流程
- tablestore-http: 点击 index.html ->  PutRow （新增tablestore）-> 触发器监听
- mail-event: 触发器监听 ->  发邮件验证码 -> 点击验证码
- tablestore-http：点击验证码 -> UpdateRow （修改tablestore）-> 触发器监听
- mail-event: 触发器监听 ->  发邮件验证码 -> 点击验证码

##  示例
本例子提供了对数据实体对象 user 进行增删改查的操作
```
id: string; // 主键id
name: string; // 姓名
age: number;  // 年龄
sex: string; // 性别
email: string; // 邮件
verifyCode: string; // 验证码
verified: boolean, // 是否验证

```

### 配置环境变量
> 访问 https://fc.console.aliyun.com/

- 服务 -> 函数 -> 概览 -> 修改配置 -> 环境变量
```
{
    "tablestore_endpoint": "tablestore 实例访问地址",
    "tablestore_instanceName": "tablestore 数据表名称"
}
```
- 初始化函数入口
```
index.initializer 
```

### 配置接口
// index.html -> 修改 URL 字段

const URL = 触发器路径 + 接口名称


