import { successConsoleLog } from "../color-log";
import { CONFIG_PRIVATEKEY_SERVER, CONFIG_TRONWEB_URL } from "../config";

const TronWeb = require("tronweb");
export let tronWeb: any;
export const initTronWeb = async () => {
  try {
    const tronweb = new TronWeb({
      fullHost: CONFIG_TRONWEB_URL,
      privateKey: CONFIG_PRIVATEKEY_SERVER,
    });
    tronWeb = tronweb;
    successConsoleLog(`️🎉 tronweb: connected!`);
    return;
  } catch (e) {
    throw e;
  }
};

