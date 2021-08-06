## 设计原则

Fc 函数计算的事件函数参数格式为`(event, context, callback)`。校验 event 参数是否符合自定义的 eventSchema 规则
Fc 函数计算的 HTTP 函数参数格式为`(req, res, context)`。校验 req.body 参数是否符合自定义的 bodySchema 规则, 校验 req.path 和 req.queries 参数是否符合自定义的 urlSchema 规则

## Options

- `eventSchema` (object) (optional): The JSON schema object or compiled ajv validator that will be used
  to validate the input (`event`) of the Fc handler.
- `bodySchema` (object) (optional): The JSON schema object or compiled ajv validator that will be used
  to validate the input (`req.body`) of the Fc handler.
- `urlSchema` (object) (optional): The JSON schema object or compiled ajv validator that will be used
  to validate the input (`req.path 和 req.queries`) of the Fc handler.
- `outputSchema` (object) (optional): The JSON schema object or compiled ajv validator that will be used
  to validate the output (`request.response`) of the Fc handler.
- `ajvOptions` (object) (optional): Options to pass to [ajv](https://ajv.js.org/docs/api.html#options)
  class constructor. Defaults are `{ strict: true, coerceTypes: 'array', allErrors: true, useDefaults: 'empty', messages: false, defaultLanguage: 'en' }`.

  NOTES:

- At least one of `eventSchema`, `bodySchema`, `urlSchema` or `outputSchema` is required.
- **Important** Compiling schemas on the fly will cause a 50-100ms performance hit during cold start for simple JSON Schemas. Precompiling is highly recommended.
- Default ajv plugins used: `ajv-i18n`, `ajv-formats`, `ajv-formats-draft2019`

## 使用方式

### 基础使用方式

- eventSchema

```javascript
'use strict';

const dk = require('@serverless-devs/dk');
const validator = require('@serverless-devs/dk-validator');

const handler = dkrequest) => {
  return { body: 'hello world' };
});

const schema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      properties: {
        string: {
          type: 'string',
        },
        boolean: {
          type: 'boolean',
        },
        integer: {
          type: 'integer',
        },
        number: {
          type: 'number',
        },
      },
    },
  },
};

handler.use(validator({ eventSchema: schema }));

// event参数如下
const event = {
  body: {
    string: JSON.stringify({ foo: 'bar' }),
    boolean: 'true',
    integer: '0',
    number: '0.1',
  },
};

module.exports = { handler };
```

- outputSchema

```javascript
'use strict';

const dk require('@serverless-devs/dk');
const validator = require('@serverless-devs/dk-validator');

const handler = dkrequest) => {
  return { body: 'hello world', statusCode: 200 };
});

const schema = {
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'string',
    },
    statusCode: {
      type: 'number',
    },
  },
};

handler.use(validator({ outputSchema: schema }));

module.exports = { handler };
```

### 高级使用方式

schema 内部依然可使用对象式写法，以针对不同路由地址配置不同 schema。

```js
'use strict';

const dk = require('@serverless-devs/dk-core');
const validator = require('@serverless-devs/dk-validator');

const baseHandler = {
  'GET /list': async (ctx) => {
    return { body: 'hello world', statusCode: 200 };
  },
  'POST /list': async (ctx) => {
    const { tableName } = ctx.req.body;
    const { tableClient } = ctx.internal;
    const params = {
      tableMeta: {
        tableName,
        primaryKey: [
          {
            name: 'id',
            type: 'INTEGER',
          },
        ],
      },
      reservedThroughput: {
        capacityUnit: {
          read: 0,
          write: 0,
        },
      },
      tableOptions: {
        timeToLive: -1, 
        maxVersions: 1, 
      },
      streamSpecification: {
        enableStream: true, 
        expirationTime: 24, 
      },
    };
    await tableClient.createTable(params);
    return {
      json: {
        success: true,
        message: `${tableName}表已创建成功`,
      },
    };
  }
}

const bodySchema = {
  type: 'object',
  required: ['tableName'],
  properties: {
    tableName:{
      type: 'string',
    }
  },
};


handler.use(validator({ bodySchema: {"POST /list/" : bodySchema}}));
```

