import dk from '@serverless-devs/dk';
import { isFcEnv, generateConfig } from './util';

interface ISchedulerConfig {
  handler?: (arg0: any) => any;
  scheduler: { cronExpression: string; enable: boolean; payload: string }[];
}

const onScheduler = (config: ISchedulerConfig) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('scheduler', config);
};

export const scheduler = {
  onScheduler,
};
