import { config } from "dotenv";
config();

if (!process.env.API_PORT) throw new Error(`API_PORT must be provided`);
export const CONFIG_API_PORT = process.env.API_PORT;

if (!process.env.MONGO_URI) throw new Error(`MONGO_URI must be provided`);
export const CONFIG_MONGO_URI = process.env.MONGO_URI;

if (!process.env.ADDRESS_TRON_SERVER) throw new Error(`ADDRESS_TRON_SERVER must be provided`);
export const CONFIG_ADDRESS_TRON_SERVER = process.env.ADDRESS_TRON_SERVER;

if (!process.env.CONTRACT_TRC20) throw new Error(`CONTRACT_TRC20 must be provided`);
export const CONFIG_CONTRACT_TRC20 = process.env.CONTRACT_TRC20;

if (!process.env.PRIVATEKEY_SERVER) throw new Error(`PRIVATEKEY_SERVER must be provided`);
export const CONFIG_PRIVATEKEY_SERVER = process.env.PRIVATEKEY_SERVER;

if (!process.env.TRONWEB_URL) throw new Error(`TRONWEB_URL must be provided`);
export const CONFIG_TRONWEB_URL = process.env.TRONWEB_URL;

if (!process.env.KAFKA_ADDRESS) throw new Error(`KAFKA_ADDRESS must be provided`);
export const CONFIG_KAFKA_ADDRESS = process.env.KAFKA_ADDRESS;
