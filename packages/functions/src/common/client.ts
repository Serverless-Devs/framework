import TableStore from 'tablestore';

export default new TableStore.Client({
  accessKeyId: '<your access key id>',
  accessKeySecret: '<your access key secret>',
  endpoint: '<your endpoint>',
  instancename: '<your instance name>',
  maxRetries: 20, // 默认20次重试，可以省略此参数。
});

