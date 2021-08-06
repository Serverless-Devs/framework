import { MongoClient } from 'mongodb';

const MongoDBInitialzerPlugin = () => {
  const url = process.env.MONGO_URL;
  const dbName = process.env.dbName;
  return {
    initializer: async () => {
      const client = new MongoClient(url);
      await client.connect();
      const dbClient = client.db(dbName);
      return {
        dbClient,
        MongoClient,
      };
    },
  };
};

export = MongoDBInitialzerPlugin;
