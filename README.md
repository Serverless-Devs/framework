# s-core 使用文档

s-core 是 Serverless-Devs 的一个官方组件，通过该组件您可以轻松处理一些有趣的事情：

- 组件加载
- 应用加载
- 组件参数转换
- 日志输出
- HTTP 请求,文件下载
- 状态上报
- 打包压缩
- 获取密钥信息
- 密钥解密
- 数据校验以及修改
- 安装依赖

## 安装

```
npm i @serverless-devs/core -S
```

## 整体使用方法

1. decorator 使用方式(推荐)

- logger demo

```typescript
const { HLogger, ILogger } = require('@serverless-devs/core');

class LoggerDemo {
  @HLogger('S-CORE') logger: ILogger;

  getDefaultLog() {
    this.logger.info('abc');
  }
}
```

![Demo](https://img.alicdn.com/imgextra/i4/O1CN01rMXgGM1wJx7iIBckd_!!6000000006288-1-tps-1215-142.gif)

2. 类使用方式

- logger demo

```typescript
const { Logger } = require('@serverless-devs/core');
function loggerDemo() {
  const logger = new Logger('S-CORE');
  logger.info('abc');
}
```

或者

```typescript
const { Logger } = require('@serverless-devs/core');

function loggerDemo() {
  Logger.info('S-CORE', 'abc');
}
```

![Demo](https://img.alicdn.com/imgextra/i4/O1CN01rMXgGM1wJx7iIBckd_!!6000000006288-1-tps-1215-142.gif)

## 详细文档

#### [common](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md)

- [request](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#request)/[downloadRequest](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#downloadrequest)(HTTP 请求)
- [report](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#report) (组件上报/错误上报)
- [load(alias loadComponent)](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#loadComponent) 组件加载, 组件会加载到 ~/.s/components 目录下
- [loadApplication](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#loadApplication) 应用加载, 应用会加载到当前目录下
- [spinner](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#spinner) (状态展示)
- [zip](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#zip)/[unzip](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#unzip) (打包/解包)
- [help](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#help) 显示文档帮助信息
- [i18n](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#i18n) 用于国际化
- [commadParse](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#commandparse) 命令行参数解析工具，用于解析命令行参数。格式为 args(Input, options) 解析工具采用 minimist 详细使用查看

- [getCredential](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#getCredential)/[setCredential](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#setCredential) 用于获取和创建密钥信息

- [decryptCredential](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#decryptCredential) 用于解密密钥信息

- [getState](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#getState)/[setState](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#setState) 用于获取和设置文件内容

- [validateProps](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#validateProps) 用于检验 `input` 的 `Properties` 属性格式是否正确

- [modifyProps](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#modifyProps) 用于修改当前目录下 <s.yml> 文件的 `Properties` 属性

- [installDependency](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#installDependency) 用于安装依赖

- [getYamlContent](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/common.md#getYamlContent) 用于获取文件内容，兼容 yaml 和 yml 文件

#### [logger](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/logger.md)

- [log](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/logger.md#log) 打印到终端, 具备显示不同颜色的能力
- [debug/info/warn/error](https://github.com/Serverless-Devs/s-core/blob/develop/packages/core/docs/logger.md#levels) 打印到本地文件以及终端中
