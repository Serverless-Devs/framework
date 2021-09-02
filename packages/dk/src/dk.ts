import core from '@serverless-devs/dk-core';

const dk = (baseHandler?: Function | Object) => {
  const middlewares = [];
  return core(baseHandler, middlewares);
};

export = dk;
