import dk from '../src/index';
import { mockResponse, EVENT, ACCESS_KEY_ID, mockContext, mockEvent } from './fixtures/mock-data';

describe('core 基本测试', () => {
  test('测试用户加上 before 中间件', async () => {
    const handler = dk();
    const before = () => {};
    const middleware = () => ({ before });
    handler.use(middleware());
    expect(handler.__middlewares.before[0]).toStrictEqual(before);
  });

  test('Event 触发器 callback回调生效', async () => {
    const mockCallbackTest = (error, result) => {
      expect(result).toBe('success');
    };

    const handler = dk((request) => {
      // 普通event函数返回两个值
      expect(Object.keys(request).length).toBe(2);
      expect(request.event).toBe(EVENT);
      return 'success';
    });

    await handler(mockEvent, mockContext, mockCallbackTest);
  });

  test('initializer 触发器 callback回调生效', async () => {
    const mockCallbackTest = (error, result) => {
      expect(result).toBe('initializer success');
    };

    const handler = dk((request) => {
      // initializer只返回一个值
      expect(Object.keys(request).length).toBe(1);
      expect(request.context.credentials.accessKeyId).toBe(ACCESS_KEY_ID);
      return 'initializer success';
    });

    await handler(mockContext, mockCallbackTest);
  });

  test('initializer 没有return函数时候 callback回调生效', async () => {
    const mockCallbackTest = (error, result) => {
      expect(result).toBe(undefined);
    };

    const handler = dk((request) => {
      // initializer只返回一个值
      expect(Object.keys(request).length).toBe(1);
      expect(request.context.credentials.accessKeyId).toBe(ACCESS_KEY_ID);
    });

    await handler(mockContext, mockCallbackTest);
  });

  test('event 触发器 error错误捕获', async () => {
    const mockCallbackTest = (error, result) => {
      expect(error).toBeInstanceOf(Error);
    };
    const handler = dk((request) => {
      throw new Error('error');
    });
    await handler(mockContext, mockCallbackTest);
  });

  test('http 触发器 error错误捕获', async () => {
    const handler = dk((request) => {
      throw new Error('出错了，兄爹');
    });
    try {
      await handler({ method: 'GET' }, mockResponse, mockContext);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
