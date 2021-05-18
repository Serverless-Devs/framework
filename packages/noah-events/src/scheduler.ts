import noah from '@serverless-devs/noah';
import { isFcEnv, generateConfig } from './util';

interface ISchedulerConfig {
  cronExpression: string;
  enable: boolean;
  payload: string;
  handler?: (arg0: any) => any;
}

const onScheduler = (config: ISchedulerConfig) => {
  if (isFcEnv) return noah(config.handler);
  generateConfig('scheduler', config);
};

export const scheduler = {
  onScheduler,
};
