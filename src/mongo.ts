import { Collection, connect, MongoClient, ReadPreference } from "mongodb";
import * as mongo1 from 'mongodb'
import { errorConsoleLog, successConsoleLog } from "./color-log";
import { CONFIG_MONGO_URI } from "./config";


export let requestLogs: Collection;

export let mongo: MongoClient;

export const collections = {
  requestLogs: "requestLogs",
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
    requestLogs = db.collection(collections.requestLogs);

    await Promise.all([]);

    successConsoleLog(`🚀 mongodb: connected`);
  } catch (e) {
    errorConsoleLog(`mongodb: disconnected`);
    await mongo?.close(true);
    setTimeout(connectMongo, 1000);
    throw e;
  }
};
