import dk from '../src/index';
import { mockResponse, mockContext, mockEvent, mockCallback } from './fixtures/mock-data';

describe('core 插件测试', () => {
  test('HTTP触发器 before 中间件 可以改变req参数', async () => {
    const mockRequest = { method: 'GET' };
    const handler = dk((request) => {
      expect(request.req.method).toBe('GET');
      expect(request.req.modifiedAssign).toBeTruthy();
      return { body: 'hello' };
    });

    const getLambdaContext = (request) => {
      request.req = {
        ...request.req,
        modifiedSpread: true,
      };
      Object.assign(request.req, { modifiedAssign: true });
    };

    handler.before(getLambdaContext);
    await handler(mockRequest, mockResponse, mockContext);
  });

  test('HTTP触发器 after 中间件 可以访问改变res参数', async () => {
    const mockRequest = { method: 'GET' };

    const handler = dk((request) => {
      return { body: 'init' };
    });

    const getLambdaContext = (request) => {
      Object.assign(request.res, { body: 'modifyed' });
    };

    handler.after(getLambdaContext);
    const result = await handler(mockRequest, mockResponse, mockContext);
    // @ts-ignore
    expect(result.res.body).toBe('modifyed');
  });

  test('Event 触发器 before 中间件 可以修改event参数', async () => {
    const handler = dk((request) => {
      expect(request.event).toBe('event__subfix');
    });

    const getLambdaContext = (request) => {
      request.event = request.event += '__subfix';
    };

    handler.before(getLambdaContext);
    await handler(mockEvent, mockContext, mockCallback);
  });

  test('HTTP 触发器业务出现onError情况出现的时候, before 插件代码执行', async () => {
    const mockRequest = { method: 'GET' };

    const handler = dk((request) => {
      expect(request.res.body).toBe('modifyed');
      throw new Error('异常出现');
    });

    const getLambdaContext = (request) => {
      Object.assign(request.res, { body: 'modifyed' });
    };

    handler.before(getLambdaContext);
    let result;
    try {
      result = await handler(mockRequest, mockResponse, mockContext);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    expect(result).toBe(undefined);
  });

  test('HTTP 触发器业务出现onError情况出现的时候, after 插件代码不执行', async () => {
    const mockRequest = { method: 'GET' };

    const handler = dk((request) => {
      throw new Error('异常出现');
    });

    const getLambdaContext = (request) => {
      Object.assign(request.res, { body: 'modifyed' });
    };

    handler.after(getLambdaContext);
    let result;
    try {
      result = await handler(mockRequest, mockResponse, mockContext);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    expect(result).toBe(undefined);
  });

  test('event 触发器业务出现onError情况出现的时候, before 插件代码执行', async () => {
    const handler = dk((request) => {
      expect(request.event).toBe('dankun event');
      throw new Error('异常出现');
    });

    const mockEventCallback = (error, result) => {
      expect(error).toBeInstanceOf(Error);
    };

    const getLambdaContext = (request) => {
      request.event = 'dankun event';
    };

    handler.before(getLambdaContext);
    let result = await handler(mockEvent, mockContext, mockEventCallback);
    expect(result).toBe(undefined);
  });

  test('event 触发器业务出现onError情况出现的时候, after 插件代码不执行', async () => {
    const handler = dk((request) => {
      throw new Error('异常出现');
    });

    const mockEventCallback = (error, result) => {
      expect(error).toBeInstanceOf(Error);
    };

    const getLambdaContext = (request) => {
      Object.assign(request.res, { body: 'modifyed' });
    };

    handler.after(getLambdaContext);
    let result = await handler(mockEvent, mockContext, mockEventCallback);
    expect(result).toBe(undefined);
  });

  test('HTTP触发器 initializer函数使用', async () => {
    const mockRequest = { method: 'GET' };
    const handler = dk((request) => {
      console.log(request.internal);
      return { body: 'hello' };
    });

    const myPlugin = () => {
      return {
        initializer: (context) => {
          console.log('----initializer-----');
          return { client: 'dankun' };
        },
      };
    };
    handler.use(myPlugin());

    if (handler.initializerHandler) {
      await handler.initializerHandler(mockContext, mockCallback);
    }
    await handler(mockRequest, mockResponse, mockContext);
  });
});
