import { wait } from "..";
import { CONFIG_ADDRESS_TRON_SERVER, CONFIG_CONTRACT_TRC20, CONFIG_MONGO_URI } from "../config";
import { initTronWeb, tronWeb } from "../config/configTronweb";
import { mongo, requestUsers } from "../mongo";
import { initAccountClient } from "./account";
import { transferBalance } from "./type";
const { MongoClient } = require('mongodb');
export const userDeposit = async (address: string, value: number) => {
  let findUser = await requestUsers.findOne({
    address,
    typeAccount: "client",
  });
  const findServer = await requestUsers.findOne({
    address: CONFIG_ADDRESS_TRON_SERVER,
    typeAccount: "server",
  });
  if (!findUser) {
    initAccountClient(address, 0);
    findUser = await requestUsers.findOne({
      address,
      typeAccount: "client",
    });
  }

  findUser.balance += value;
  findUser.totalDepositAmount += value;
  findUser.totalDepositCount++;
  findServer.balance += value;

  requestUsers.findOneAndUpdate(
    {
      address: CONFIG_ADDRESS_TRON_SERVER,
    },
    {
      $set: { balance: findServer.balance },
    }
  );
  return requestUsers.findOneAndUpdate(
    { address },
    {
      $set: {
        balance: findUser.balance,
        totalDepositAmount: findUser.totalDepositAmount,
        totalDepositCount: findUser.totalDepositCount,
      },
    }
  );
};
export const userWithdraw = async (address: string, value: number) => {
  const findUser = await requestUsers.findOne({
    address,
    typeAccount: "client",
  });
  const findServer = await requestUsers.findOne({
    address: CONFIG_ADDRESS_TRON_SERVER,
    typeAccount: "server",
  });

  findUser.balance -= value;
  findUser.totalWithdrawAmount += value;
  findUser.totalWithdrawCount++;

  findServer.balance -= value;

  requestUsers.findOneAndUpdate(
    {
      address: CONFIG_ADDRESS_TRON_SERVER,
    },
    {
      $set: { balance: findServer.balance },
    }
  );
  return requestUsers.findOneAndUpdate(
    { address },
    {
      $set: {
        balance: findUser.balance,
        totalWithdrawAmount: findUser.totalWithdrawAmount,
        totalWithdrawCount: findUser.totalWithdrawCount,
      },
    }
  );
};
export const transferUserToUser = async (req: transferBalance) => {
  const session = mongo.startSession();
  session.startTransaction();
  try {
    const { fromAddress, toAddress, amount } = req;
    // transfer(fromAddress, toAddress, amount)
    const findUserSend = await requestUsers.findOne({
      address: fromAddress,
      typeAccount: "client",
    });
    const findUserReceive = await requestUsers.findOne({
      address: toAddress,
      typeAccount: "client",
    });

    if (!findUserSend) throw new Error("address send balance not found");
    if (!findUserReceive) throw new Error("address receive balance not found");
    if (findUserSend.isLock) throw new Error("address send has been locked");
    if (findUserReceive.isLock)
      throw new Error("address receive has been locked");
    if (findUserSend.balance < amount)
      throw new Error("balance is not available");

    const result = await requestUsers.findOneAndUpdate(
      { address: fromAddress },
      { $inc: { balance: - amount }},
      { session, returnOriginal: false })
      .then(res => res.value)
    // await wait(10000);
    // if ( 1 === 1) throw new Error('rollback');
    await requestUsers.findOneAndUpdate(
      { address: toAddress },
      { $inc: { balance: + amount }},
      { session });
    
    await session.commitTransaction();
    session.endSession();
    return {
      message: "success",
      balance: result.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const transfer = async (from: string, to: string , amount: number) => {
  const session = mongo.startSession();
  session.startTransaction();
  try {
    const opts = { session, returnOriginal: false };
    const A = await await requestUsers
      .findOneAndUpdate({ address: from }, { $inc: { balance: - amount } }, opts)
      .then(res => res.value);
    if (A.balance < 0) {
      throw new Error('Không đủ tiền: ' + (A.balance + amount));
    }

    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    // Nếu xảy ra lỗi, hãy hủy bỏ tất cả các giao dịch và quay trở lại trước khi sửa đổi
    console.log('Loi ne');
    await session.abortTransaction();
    session.endSession();
    throw error; // catch error
  }
}
export const withdraw = async (address: string, amount: number) => {
  const usdt_trc20_contract = await tronWeb
    .contract()
    .at(CONFIG_CONTRACT_TRC20);
  const txid: string = await usdt_trc20_contract
    .transfer(address, amount)
    .send({
      feeLimit: 10000000,
      callValue: 0,
    });
  return txid;
};

export const getBalanceServer = async () => {
  const usdt_trc20_contract = await tronWeb
    .contract()
    .at(CONFIG_CONTRACT_TRC20);
  let balance = await usdt_trc20_contract
    .balanceOf(CONFIG_ADDRESS_TRON_SERVER)
    .call();
  return balance / 1000000;
};
