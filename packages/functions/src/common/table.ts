import client from './client';

import { CreateTable, UpdateTable, DescribeTable, DeleteTable, PutRow } from './table.interface';

export const createTable = (params: CreateTable, callback?: any) => client.createTable(params, callback);

export const updateTable = (params: UpdateTable, callback?: any) => client.updateTable(params, callback);

export const listTable = (callback?: any) => client.listTable({}, callback);

export const describeTable = (params: DescribeTable, callback?: any) => client.describeTable(params, callback);

export const deleteTable = (params: DeleteTable, callback?: any) => client.deleteTable(params, callback);

// todo putRow参数较复杂，还在梳理
export const putRow = (params: PutRow, callback?: any) => client.putRow(params, callback);


// const pars: PutRow = {
//   tableName: 'test2',
//   condition: {
//     rowExistenceExpectation: 0,
//     columnCondition: null,
//   },
//   primaryKey: [
//     { pk1: 'RT_NONE' },
//     { pk2: 'RT_NONE' },
//   ],
//   attributeColumns: [
//     { col1: 'col1val' },
//   ],
//   returnContent: {
//     returnType: 0,
//   },
// };

const func = async () => {
  const res = await listTable();
  console.log('res', res);
};
func();
