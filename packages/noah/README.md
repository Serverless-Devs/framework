#### 基本用法

```javascript
'use strict';
const noah = require('@serverless-devs/noah');

const handler = noah((request) => {
  return {
    json: { result: 'ok' },
  };
});

module.exports = { handler };
```
