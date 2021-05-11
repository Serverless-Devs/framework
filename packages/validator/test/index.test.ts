import middy from '@serverless-devs/noah-core';
import validator from '../src/index';
import { mockContext } from './fixtures/mock-data';

describe('validator测试', () => {
  test('It should validate an incoming object', async () => {
    const handler = middy((request) => {
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
        inputSchema: schema,
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

  test('It should handle invalid schema as a BadRequest', async () => {
    const handler = middy((request) => {
      return request.event.body;
    });

    const schema = {
      type: 'object',
      required: ['body', 'foo'],
      properties: {
        // this will pass validation
        body: {
          type: 'string',
        },
        // this won't as it won't be in the event
        foo: {
          type: 'string',
        },
      },
    };

    handler.use(
      validator({
        inputSchema: schema,
      }),
    );

    // invokes the handler, note that property foo is missing
    const event = {
      body: JSON.stringify({ something: 'somethingelse' }),
    };
    await handler(event, mockContext, (err) => {
      expect(err.message).toStrictEqual('Event object failed validation');
      expect(err.details).toStrictEqual([
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          message: 'must have required property foo',
          params: {
            missingProperty: 'foo',
          },
        },
      ]);
    });
  });

  test('It should handle invalid schema as a BadRequest in a different language', async () => {
    const handler = middy((request) => {
      return request.event.body;
    });

    const schema = {
      type: 'object',
      required: ['body', 'foo'],
      properties: {
        // this will pass validation
        body: {
          type: 'string',
        },
        // this won't as it won't be in the event
        foo: {
          type: 'string',
        },
      },
    };

    handler.use(
      validator({
        inputSchema: schema,
      }),
    );

    // invokes the handler, note that property foo is missing
    const event = {
      preferredLanguage: 'fr',
      body: JSON.stringify({ something: 'somethingelse' }),
    };
    await handler(event, mockContext, (err) => {
      expect(err.message).toStrictEqual('Event object failed validation');
      expect(err.details).toStrictEqual([
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          message: 'requiert la propriété foo',
          params: {
            missingProperty: 'foo',
          },
        },
      ]);
    });
  });

  test('It should handle invalid schema as a BadRequest in a different language (with normalization)', async () => {
    const handler = middy((request) => {
      return request.event.body;
    });

    const schema = {
      type: 'object',
      required: ['body', 'foo'],
      properties: {
        // this will pass validation
        body: {
          type: 'string',
        },
        // this won't as it won't be in the event
        foo: {
          type: 'string',
        },
      },
    };

    handler.use(
      validator({
        inputSchema: schema,
      }),
    );

    // invokes the handler, note that property foo is missing
    const event = {
      preferredLanguage: 'pt',
      body: JSON.stringify({ something: 'somethingelse' }),
    };
    await handler(event, mockContext, (err) => {
      expect(err.message).toStrictEqual('Event object failed validation');
      expect(err.details).toStrictEqual([
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          message: 'deve ter a propriedade obrigatória foo',
          params: {
            missingProperty: 'foo',
          },
        },
      ]);
    });
  });

  test('It should validate response', async () => {
    const expectedResponse = {
      body: 'Hello world',
      statusCode: 200,
    };

    const handler = middy((request) => {
      return expectedResponse;
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

    const event = {
      preferredLanguage: 'pt',
      body: JSON.stringify({ something: 'somethingelse' }),
    };
    await handler(event, mockContext, (err, result) => {
      expect(result).toStrictEqual(expectedResponse);
    });
  });

  test('It should make requests with invalid responses fail with an Internal Server Error', async () => {
    const handler = middy((request) => {
      return {};
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

    const event = {
      preferredLanguage: 'pt',
      body: JSON.stringify({ something: 'somethingelse' }),
    };
    await handler(event, mockContext, (err, result) => {
      expect(err.message).toStrictEqual('Response object failed validation');
    });
  });
});
