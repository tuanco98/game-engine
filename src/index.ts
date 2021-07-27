import { initApollo } from "./apollo";
import { isAccountServer } from "./Handle/accountSever";
import { connectEvoKafkaProducer } from "./Handle/exampleConsumerKafka";
import { initRedis, ioredis } from "./Handle/exampleRedis";
import { initTronWeb } from "./Handle/exampleTronweb";
import { gamePlay } from "./Handle/gameEngine";
import { connectMongo } from "./mongo";

(async () => {
  try {
    await initApollo();
    await connectMongo();
    await isAccountServer();
    // await initRedis();
    // await connectEvoKafkaProducer();
    // initTronWeb();
    //Nhận các giao dịch đến 1 ví nhất định
  
  } catch (e) {
    throw e;
  }
})();


export async function wait(milsecs: number) {
  return new Promise((res, rej)=>{
    setTimeout(() => res("Ok"), milsecs)
  })
}

