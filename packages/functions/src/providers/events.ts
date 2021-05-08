import { IContext } from './interface';

export const onNotify = (handler: Function) => async (event, context: IContext, callback) => {
  try {
    const result = await handler(event, context);
    if (result instanceof Error) {
      callback(result, '');
    } else {
      callback(null, result);
      return result;
    }
  } catch (error) {
    callback(error, '');
  }
};

export const onInitializerNotify = (handler: Function) => async (context: IContext, callback) => {
  try {
    const result = await handler(context);
    if (result instanceof Error) {
      callback(result, '');
    } else {
      callback(null, result);
      return result;
    }
  } catch (error) {
    callback(error, '');
  }
};
