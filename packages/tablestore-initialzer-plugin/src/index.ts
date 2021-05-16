import TableStore from 'tablestore';

const tablestoreInitialzerPlugin = () => {
  const endpoint = process.env.tablestore_endpoint;
  const instanceName = process.env.tablestore_instanceName;
  return {
    initializer: ({ context }) => {
      const tableClient = new TableStore.Client({
        accessKeyId: context.credentials.accessKeyId,
        accessKeySecret: context.credentials.accessKeySecret,
        stsToken: context.credentials.securityToken,
        endpoint,
        instancename: instanceName,
      });
      return {
        tableClient,
        TableStore: TableStore,
      };
    },
  };
};

export = tablestoreInitialzerPlugin;
