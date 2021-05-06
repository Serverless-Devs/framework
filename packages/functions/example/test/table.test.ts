import { table } from '../../src';

const client = table.initializer({
  endpoint: 'endpoint',
  instancename: 'instancename',
});

console.log(client);

const func = async () => {
  const data = await client.listTable();
  console.log('listTable --', data);
};
func();
