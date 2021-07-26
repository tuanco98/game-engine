import { Collection, connect, MongoClient, ReadPreference } from "mongodb";
import * as mongo1 from 'mongodb'
import { errorConsoleLog, successConsoleLog } from "./color-log";
import { CONFIG_MONGO_URI } from "./config";


export let requestUsers: Collection;
export let requestHistorys: Collection;

export let mongo: MongoClient;

export const collections = {
  requestUsers: "requestUsers",
  requestHistorys: "requestHistorys",
};

export const connectMongo = async () => {
  try {
    mongo = await connect(CONFIG_MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      ignoreUndefined: true, // find: {xxx: {$exists: false}}
      readPreference: ReadPreference.PRIMARY,
    });

    mongo.on("error", async (e) => {
      try {
        await mongo.close();
        await connectMongo();
      } catch (e) {
        setTimeout(connectMongo, 1000);
        throw e;
      }
    });

    mongo.on("timeout", async () => {
      try {
        await mongo.close();
        await connectMongo();
      } catch (e) {
        setTimeout(connectMongo, 1000);
        throw e;
      }
    });

    mongo.on("close", async () => {
      try {
        await connectMongo();
      } catch (e) {
        throw e;
      }
    });

    const db = mongo.db();
    requestUsers = db.collection(collections.requestUsers);
    requestHistorys = db.collection(collections.requestHistorys);

    await Promise.all([]);

    successConsoleLog(`🚀 mongodb: connected`);
  } catch (e) {
    errorConsoleLog(`mongodb: disconnected`);
    await mongo?.close(true);
    setTimeout(connectMongo, 1000);
    throw e;
  }
};
