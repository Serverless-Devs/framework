import TableStore from 'tablestore';
import { IContext } from '../interface';

interface IInitializer {
  endpoint: string;
  instancename: string;
}

export const initializer = (context: IContext, params: IInitializer) => {
  const { credentials } = context;
  return new TableStore.Client({
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    ...params,
  });
};
