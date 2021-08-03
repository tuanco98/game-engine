import { Kafka } from "kafkajs";
import { CONFIG_ADDRESS_TRON_SERVER, CONFIG_KAFKA_ADDRESS } from "../config";
import { userDeposit, userWithdraw } from "../Handle/handleAsset";
import { requestTransfers, requestUsers } from "../mongo";


const kafkaClientId = "tuan-dev";
const kafkaBrokers = [CONFIG_KAFKA_ADDRESS];
const kafkaGroupId = "group-dev";
const topicName = "contractevent";

const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: kafkaBrokers,
  ssl: false,
  sasl: undefined,
  connectionTimeout: 5000,
  requestTimeout: 60000,
});
const kafkaConsumer = kafka.consumer({ groupId: kafkaGroupId });

export const connectEvoKafkaProducer = async () => {
  try {
    await kafkaConsumer.subscribe({ topic: topicName, fromBeginning: true });
    console.log(`️🎉 kafka consumer subscribed topic: ${topicName}`);
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message?.value?.toString();
          if (!value) throw new Error(`Cannot get value of in topic ${topic}`);
          const parseValue = JSON.parse(value) as any;
          resolveMessage(parseValue);
        } catch (e) {
          throw e;
        }
      },
    });
  } catch (e) {
    throw e;
  }
};
const resolveMessage = async (parseValue: any) => {
  console.log(parseValue);
  const { eventName, topicMap } = parseValue as {
    eventName: string;
    topicMap: { from: string; to: string };
  };
  if (eventName === "Transfer") {
    const findTransfer = await requestTransfers.findOne({
      blockNumber: parseValue.blockNumber,
    });
    if (topicMap.to === CONFIG_ADDRESS_TRON_SERVER && !findTransfer) {
      const { topicMap, dataMap, timeStamp } = parseValue;
      const amount = dataMap.value / 1000000;
      requestTransfers.insertOne({
        typeTransfer: "Deposit",
        information: parseValue,
      });
      userDeposit(topicMap.from, amount * 0.9);
    }
    if (topicMap.from === CONFIG_ADDRESS_TRON_SERVER && !findTransfer) {
      requestTransfers.insertOne({
        typeTransfer: "withdraw",
        information: parseValue,
      });
    }
    console.log(parseValue);
  }
};
