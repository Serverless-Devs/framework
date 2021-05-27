import dk from '@serverless-devs/dk-core';
import validator from '../src/index';
import { mockContext } from './fixtures/mock-data';

describe('validator测试', () => {
  test('It should validate an incoming object', async () => {
    const handler = dk((request) => {
      return request.event.body;
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

    handler.use(
      validator({
        eventSchema: schema,
      }),
    );

    // invokes the handler
    const event = {
      body: {
        string: JSON.stringify({ foo: 'bar' }),
        boolean: 'true',
        integer: '0',
        number: '0.1',
      },
    };

    await handler(event, mockContext, (err, result) => {
      expect(result).toStrictEqual({
        boolean: true,
        integer: 0,
        number: 0.1,
        string: '{"foo":"bar"}',
      });
    });
  });
});
