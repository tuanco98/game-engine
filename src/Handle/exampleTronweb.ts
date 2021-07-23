const TronWeb = require("tronweb");

export const initTronWeb = async () => {
  try {
    const tronWeb = new TronWeb({
      fullHost: "https://api.shasta.trongrid.io",
    });
    console.log(`🚀 tronweb: connected`);
    // const data = await tronWeb.trx.getBlockRange(15816492,15816495);
    // console.log(data);
  } catch (e) {
    throw e;
  }
};
