import Redis from "ioredis";
export let ioredis: Redis.Redis;
const CONFIG_REDIS_PORT:number = 6379;
const CONFIG_REDIS_HOST:string = "139.99.210.62";
const CONFIG_REDIS_PWD:string = "Matkhau12!";

export const initRedis = async () => {
  try {
    ioredis = new Redis(CONFIG_REDIS_PORT, CONFIG_REDIS_HOST, {
      password:CONFIG_REDIS_PWD,
    });
    console.log(`🚀 ioredis: connected`);
  } catch (e) {
    throw e;
  }
};
