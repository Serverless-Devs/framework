import { MongoClient } from 'mongodb';


const rdsDbInitialzerPlugin = () => {
  const url = process.env.MONGO_URL;
  return {
    initializer: () => {
      const dbClient = new MongoClient(url);
      return {
        dbClient,
        MongoClient,
      };
    },
  };
};

export = rdsDbInitialzerPlugin;
