import TableStore from 'tablestore';
import { IContext } from '../interface';

export const onTableInitializerNotify = (initState: any, handler?: Function) => async (
  context: IContext,
  callback,
) => {
  const { credentials } = context;
  initState.client = new TableStore.Client({
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    ...initState.config,
  });
  callback(null, 'success');
};
