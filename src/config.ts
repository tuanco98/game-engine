import { config } from "dotenv";
config();

if (!process.env.API_PORT) throw new Error(`API_PORT must be provided`);
export const CONFIG_API_PORT = process.env.API_PORT;

if (!process.env.MONGO_URI) throw new Error(`MONGO_URI must be provided`);
export const CONFIG_MONGO_URI = process.env.MONGO_URI;

if (!process.env.ADDRESS_TRON_SERVER) throw new Error(`ADDRESS_TRON_SERVER must be provided`);
export const CONFIG_ADDRESS_TRON_SERVER = process.env.ADDRESS_TRON_SERVER;

if (!process.env.ADDRESS_TRON_CLIENT) throw new Error(`ADDRESS_TRON_CLIENT must be provided`);
export const CONFIG_ADDRESS_TRON_CLIENT = process.env.ADDRESS_TRON_CLIENT;
