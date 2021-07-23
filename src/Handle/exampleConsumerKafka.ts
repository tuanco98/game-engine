import { ioredis } from "./exampleRedis";
import { Kafka } from "kafkajs";

const kafkaClientId = "dev";
const kafkaBrokers = ["139.99.210.62:9193"];
const kafkaGroupId = "group-dev";
const topicName = "block";

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
          // await requestLogs.insertOne(parseValue);
          // ioredis.get('d',parseValue)
          // await wait(1000)
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
let compare : number;
const resolveMessage = (parseValue:any) => {
  console.log(parseValue);
  if(!compare) {
    compare = parseValue.blockNumber;
    return;
  }
  if(parseValue.blockNumber - compare !== 1) {
    console.log(parseValue);
    throw new Error('Faile!');
  }
  if(parseValue.blockNumber === compare) {
    throw new Error('blockNumber match!');
  }
  compare = parseValue.blockNumber;
};
