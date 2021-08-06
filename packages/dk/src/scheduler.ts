import dk from './dk';
import { isFcEnv, generateConfig } from './util';

interface ISchedulerConfig {
  handler: Function | Object;
  scheduler: { cronExpression: string; enable: boolean; payload: string };
}

const onScheduler = (config: ISchedulerConfig) => {
  if (isFcEnv) return dk(config.handler);
  generateConfig('scheduler', config);
  return dk(config.handler);
};

export const scheduler = {
  onScheduler,
};
