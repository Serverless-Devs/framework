import TableStore from 'tablestore';

interface Initializer {
  endpoint: string;
  instancename: string;
}

const client = (params: Initializer) => new TableStore.Client({
  accessKeyId: '<your access key id>',
  accessKeySecret: '<your access key secret>',
  endpoint: params.endpoint,
  instancename: params.instancename,
});

export const initializer = (params: Initializer) => client(params);
