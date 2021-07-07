import core from '@serverless-devs/dk-core';
import formBodyParser from '@serverless-devs/http-form-body-parser';
import jsonBodyParser from '@serverless-devs/http-json-body-parser';
import responseParser from '@serverless-devs/http-response-parser';
import httpErrorHandler from '@serverless-devs/http-error-handler';

const dk = (baseHandler?: Function | Object) => {
  const middlewares = [formBodyParser(), jsonBodyParser(), responseParser(), httpErrorHandler()];
  return core(baseHandler, middlewares);
};

export = dk;
