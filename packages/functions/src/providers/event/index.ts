export const onTrigger = (handler: Function) => async (event, context, callback) => {
  try {
    const result = handler(event, context);
    if (result instanceof Error) {
      callback(result, '');
    } else {
      callback(null, result);
    }
  } catch (error) {
    callback(error, '');
  }
};
