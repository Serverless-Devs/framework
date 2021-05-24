const middy = require('@serverless-devs/dk-core');
const jsonBodyParser = require('@serverless-devs/http-json-body-parser');
const formBodyParser = require('@serverless-devs/http-form-body-parser');
const routeParser = require('@serverless-devs/http-route-parser');
const tableStorePlugin = require('@serverless-devs/tablestore-initialzer-plugin');

const route = {
  '/PutRow': {
    POST: async (request) => {
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
      await tableClient.putRow({
        tableName: 'test',
        condition: {
          rowExistenceExpectation: 0,
        },
        primaryKey: [{ id: body.id }],
        attributeColumns: params,
      });
    },
  },
  '/UpdateRow': {
    GET: async (request) => {
      const { tableClient } = request.internal;
      const { queries = {} } = request.req;
      const params = [{ verifyCode: queries.code }, { verified: true }];
      console.log(params);
      await tableClient.updateRow({
        tableName: 'test',
        condition: {
          rowExistenceExpectation: 0,
        },
        primaryKey: [{ id: queries.id }],
        updateOfAttributeColumns: [{ PUT: params }],
      });
    },
  },
};

const handler = middy(async (request) => {
  return { body: JSON.stringify(request.req) };
});

handler.use(tableStorePlugin()).use(jsonBodyParser()).use(formBodyParser()).use(routeParser(route));
exports.initializer = handler.initializerHandler;

exports.handler = handler;
