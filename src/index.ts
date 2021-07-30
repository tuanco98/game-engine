import { initApollo } from "./apollo";
import { initTronWeb } from "./config/configTronweb";
import { connectEvoKafkaProducer } from "./config/configConsumerKafka";
import { gamePlay } from "./Handle/gameEngine";
import { connectMongo } from "./mongo";
import { generateNewAddress } from "./config/generateWallet";
import { isAccountServer } from "./Handle/account";

(async () => {
  try {
    await initApollo();
    await connectMongo();
    // await initRedis();
    await connectEvoKafkaProducer();
    await initTronWeb();
    await isAccountServer();
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

