## http-response-parser 转化

- html: `content-type`为`text/html; charset=utf8`
- css: `content-type`为`text/css; charset=utf8`
- js: `content-type`为`text/javascript; charset=utf8`
- text: `content-type`为`text/plain; charset=utf8`
- json: `content-type`为`application/json; charset=utf8`
- xml: `content-type`为`application/xml; charset=utf8`

#### 基本用法

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const httpResponseParser = require('@serverless-devs/http-response-parser');

const handler = dkrequest) => {
  return {
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      text/html
  </body>
  </html>`,
  };
});

handler.use(httpResponseParser());

module.exports = { handler };
```
