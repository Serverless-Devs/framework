import { onTableInitializerNotify } from '../../src/providers/initializer';

const initState = {
  config: {
    endpoint: 'https://hanxie.cn-hangzhou.ots.aliyuncs.com',
    instancename: 'hanxie',
  },
  client: null
};

export const main_initializer = onTableInitializerNotify(initState);

export const index_handler = () => {
  console.log(initState)
}
