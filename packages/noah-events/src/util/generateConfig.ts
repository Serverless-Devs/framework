/**
 * 生成config文件
 * config文件 按照规范是在和当前文件同级的地方。
 * - config.yml
 * - index.js
 */

/**
 *  config.yml 配置如下
    ```
    function:
      runtime: nodejs12
      # memory: 1152
      # timeout: 60
      # concurrency: 1
    oss:
      bucketName: my-bukect
      events:
        - oss:ObjectCreated:*
        - oss:ObjectRemoved:DeleteObject
      filter:
        Key:
          Prefix: source/
          Suffix: .png
    ```
  如果代码和配置文件同时，这时候配置文件会优先于代码。
 */
