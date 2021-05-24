import dk from '@serverless-devs/dk';
import { isFcEnv, generateConfig } from './util';

interface ISchedulerConfig {
  cronExpression: string;
  enable: boolean;
  payload: string;
  handler?: (arg0: any) => any;
}

const onScheduler = (config: ISchedulerConfig) => {
  if (isFcEnv) return dkonfig.handler);
  generateConfig('scheduler', config);
};

export const scheduler = {
  onScheduler,
};
