# Lerna 是一个工具，它优化了使用 git 和 npm 管理多包存储库的工作流。

## 两种工作模式

- Fixed/Locked mode (default)
  vue,babel 都是用这种，在 publish 的时候,所有的包版本都会更新，并且包的版本都是一致的，版本号维护在 lerna.jon 的 version 中

- Independent mode
  lerna init --independent

独立模式，每个 package 都可以有自己的版本号。版本号维护在各自 package.json 的 version 中。每次发布前都会提示已经更改的包，以及建议的版本号或者自定义版本号。这种方式相对第一种来说，更灵活

## 初始化项目

```
npm install -g lerna // 这里是全局安装，也可以安装为项目开发依赖，使用全局方便后期使用命令行

mkdir lerna-repo

cd lerna-repo

lerna init // 初始化一个lerna项目结构，如果希望各个包使用单独版本号可以加 -i | --independent

```

## lerna bootstrap

#### 将本地 package 链接在一起并安装依赖

- 1.为每个 package 安装依赖
- 2.链接相互依赖的库到具体的目录，例如：如果 lerna1 依赖 lerna2，且版本刚好为本地版本，那么会在 node_modules 中链接本地项目，如果版本不满足，需按正常依赖安装
- 3.在 bootstraped packages 中 执行 npm run prepublish
- 4.在 bootstraped packages 中 执行 npm run prepare

#### lerna bootstrap 接受所有过滤器属性

通过将额外的参数放在--之后来传递给 npm 客户端：

```
lerna bootstrap -- --production --no-optional
```

在 lerna.json 中这样配置：

```
{
  "npmClient": "yarn",
  "npmClientArgs": ["--production", "--no-optional"]
}
```
