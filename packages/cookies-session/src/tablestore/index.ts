const tablestoreInitialzerPlugin = require('@serverless-devs/tablestore-initialzer-plugin')
const tableClientcache = {};
const tablestore = (ctx, options) => {
    const { tableClient, TableStore } = tablestoreInitialzerPlugin().initializer({ context: ctx });
    const tableName = options.name;
    const createTable = async() => {
        var params = {
            tableMeta: {
                tableName: tableName,
                primaryKey: [
                    {
                        name: 'uid',
                        type: 'INTEGER'
                    }
                ]
            },
            reservedThroughput: {
                capacityUnit: {
                    read: 0,
                    write: 0
                }
            },
            tableOptions: {
                timeToLive: -1,
                maxVersions: 1
            }
        };

        try {
            await tableClient.describeTable({ tableName: tableName});
        } catch (error) {
            await  tableClient.createTable(params);
        }
    }
    const putRow = async(data={}) => {
        const attributeColumns = Object.keys(data).map(key=>{
            const obj = {};
            obj[key] = data[key]
            return obj
        })
        var params = {
            tableName: tableName,
            condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
            primaryKey: [{ 'uid': TableStore.Long.fromNumber(20013) }],
            attributeColumns,
            returnContent: { returnType: TableStore.ReturnType.Primarykey }
        };
        const Data = await tableClient.putRow(params);
        return Data
    }
    const GetRow = async() => {
        var params = {
            tableName: tableName,
            primaryKey: [{ 'uid': TableStore.Long.fromNumber(20013) }],
            maxVersions: 2 //最多可读取的版本数，设置为2即代表最多可读取2个版本。
          };
        const Data = await tableClient.getRow(params);
        return Data
    }
    const UpdateRow = () => {
    }
    const DeleteRow = async() =>{
        var params = {
            tableName: tableName,
            condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
            primaryKey: [{ 'uid': TableStore.Long.fromNumber(20013) }],
        };
        
        const Data = await tableClient.deleteRow(params);
        return Data
    }
    return {
        init: createTable,
        put: putRow,
        get: GetRow,
        update: UpdateRow,
        remove: DeleteRow
    }
}
module.exports = tablestore
