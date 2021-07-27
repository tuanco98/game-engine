import { ioredis } from "./exampleRedis";
import { Kafka } from "kafkajs";

const kafkaClientId = "tuan-dev";
const kafkaBrokers = ["139.99.210.62:9193"];
const kafkaGroupId = "group-dev-2";
const topicName = "contractevent";

const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: kafkaBrokers,
  ssl: false,
  sasl: undefined,
  connectionTimeout: 5000,
  requestTimeout: 60000,
});
let first_time=false
const kafkaConsumer = kafka.consumer({ groupId: kafkaGroupId });

export const connectEvoKafkaProducer = async () => {
  try {
    await kafkaConsumer.subscribe({ topic: topicName, fromBeginning: true });
    console.log(`️🎉 kafka consumer subscribed topic: ${topicName}`);

    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message?.value?.toString();
          if(first_time) throw new Error('not the first time')
          //first_time=true
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
  const {eventName,topicMap} =parseValue as {eventName:string,topicMap:{from:string,to:string}}
  if(eventName==="Transfer"&&topicMap.to==="TK3JWFLgeitDmXAUoGSSLBjPuXc9WjoA8o"){
      console.log(parseValue)
  }
};
