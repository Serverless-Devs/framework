import core from '@serverless-devs/noah-core';
import formBodyParser from '@serverless-devs/http-form-body-parser';
import jsonBodyParser from '@serverless-devs/http-json-body-parser';
import responseParser from '@serverless-devs/http-response-parser';

const noah = (baseHandler?: (arg0: any) => any) => {
  const middlewares = [formBodyParser(), jsonBodyParser(), responseParser()];
  return core(baseHandler, middlewares);
};

export = noah;
