interface PrimaryKey {
  name: string;
  type: string;
  option?: 'AUTO_INCREMENT'; // 主键自增列
}

interface IndexMetas {
  name: string; // 索引表名称
  primaryKey: string[]; // 引表的索引列，索引列为数据表主键和预定义列的组合
  definedColumn: string[]; // 索引表的属性列
  includeBaseData?: boolean; // 索引表中是否包含数据表中已存在的数据
  indexUpdateMode?: 'IUM_ASYNC_INDEX' | 'IUM_SYNC_INDEX'; // 索引更新模式
  indexType?: 'IT_GLOBAL_INDEX' | 'IT_LOCAL_INDEX'; // 索引类型
}

// 创建数据表
export interface CreateTable {
  tableMeta: {
    tableName: string;
    primaryKey: PrimaryKey[];
  };
  reservedThroughput: {
    capacityUnit: {
      read: number;
      write: number;
    };
  };
  tableOptions: {
    timeToLive: number; // 数据的过期时间，单位为秒，-1代表永不过期。如果设置过期时间为一年，即为365*24*3600。
    maxVersions: number; // 保存的最大版本数，设置为1代表每列上最多保存一个版本（保存最新的版本）。
  };
  indexMetas?: IndexMetas;
}

// 更新数据表
export interface UpdateTable {
  tableName: string;
  tableOptions: {
    timeToLive?: number; // 数据的过期时间，单位为秒，-1代表永不过期。如果设置过期时间为一年，即为365*24*3600。
    maxVersions?: number; // 保存的最大版本数，设置为1代表每列上最多保存一个版本（保存最新的版本）。
  };
}

// 查询表信息
export interface DescribeTable {
  tableName: string;
}

// 删除数据表
export interface DeleteTable {
  tableName: string;
}

// todo 主键列自增，较复杂，待梳理
export enum RowExistenceExpectation {
  IGNORE = 0,
  EXPECT_EXIST = 1,
  EXPECT_NOT_EXIST = 2,
}
enum ReturnType {
  RT_NONE = 0,
  RT_PK = 1,
  RT_AFTER_MODIFY = 2,
}

export interface PutRow {
  tableName: string;
  condition: {
    rowExistenceExpectation: RowExistenceExpectation;
    columnCondition?: any;
  };
  primaryKey: object[];
  attributeColumns: object[];
  returnContent: {
    returnType?: ReturnType;
  };
}
