#### 基本用法

```javascript
'use strict';
const dk = require('@serverless-devs/dk');

const handler = dk((request) => {
  return {
    json: { result: 'ok' },
  };
});

module.exports = { handler };
```
