import core from '@serverless-devs/dk-core';
import responseParser from '@serverless-devs/http-response-parser';

const dk = (baseHandler?: Function | Object) => {
  const middlewares = [responseParser()];
  return core(baseHandler, middlewares);
};

export = dk;
