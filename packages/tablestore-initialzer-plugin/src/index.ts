import TableStore from 'tablestore';

const tablestoreInitialzerPlugin = ({ endpoint, instanceName }) => ({
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
    };
  },
});

export = tablestoreInitialzerPlugin;
