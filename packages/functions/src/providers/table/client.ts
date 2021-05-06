import TableStore from 'tablestore';

interface Client {
  endpoint: string;
  instancename: string;
}

export default (params: Client) => {
  const client = new TableStore.Client({
    accessKeyId: '<your access key id>',
    accessKeySecret: '<your access key secret>',
    endpoint: params.endpoint,
    instancename: params.instancename,
    // maxRetries: 20, // 默认20次重试，可以省略此参数。
  });
  return client;
};
