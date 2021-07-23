import { initApollo } from "./apollo";
import { initRedis, ioredis } from "./Handle/exampleRedis";
import { initTronWeb } from "./Handle/exampleTronweb";
import { gamePlay } from "./Handle/gameEngine";
import { connectMongo } from "./mongo";

(async () => {
  try {
    // await initApollo();
    // await connectMongo();
    // await initRedis();
    // await connectEvoKafkaProducer();
    // initTronWeb();
    gamePlay(1, 8);
  } catch (e) {
    throw e;
  }
})();


export async function wait(milsecs: number) {
  return new Promise((res,rej)=>{
    setTimeout(()=>res("Ok"),milsecs)
  })
}

