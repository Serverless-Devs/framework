const middy = require('@serverless-devs/dk-core');
const jsonBodyParser = require('@serverless-devs/http-json-body-parser');
const formBodyParser = require('@serverless-devs/http-form-body-parser');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const route = {
  'POST /PutRow': async (request) => {
    const { tableClient } = request.internal;
    const { body } = request.req;
    const params = [
      { name: body.name },
      // { age: parseInt(body.age || 0, 10) },
      { email: body.email },
      { sex: body.sex },
    ];
    if (!tableClient || !body.id) return;
    console.log(params);
    const data = await tableClient.putRow({
      tableName: 'test',
      condition: {
        rowExistenceExpectation: 0,
      },
      primaryKey: [{ id: body.id }],
      attributeColumns: params,
    });
    return { body: JSON.stringify(data, null, 2) };
  },
  'GET /UpdateRow': async (request) => {
    const { tableClient } = request.internal;
    const { queries = {} } = request.req;
    const params = [{ verifyCode: queries.code }, { verified: true }];
    console.log(params);
    const data = await tableClient.updateRow({
      tableName: 'test',
      condition: {
        rowExistenceExpectation: 0,
      },
      primaryKey: [{ id: queries.id }],
      updateOfAttributeColumns: [{ PUT: params }],
    });
    return { body: JSON.stringify(data, null, 2) };
  },
};

const handler = middy(route);

handler.use(tableStorePlugin()).use(jsonBodyParser()).use(formBodyParser());
exports.initializer = handler.initializerHandler;

exports.handler = handler;
