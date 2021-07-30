import { CONFIG_ADDRESS_TRON_SERVER, CONFIG_CONTRACT_TRC20 } from "../config";
import { initTronWeb, tronWeb } from "../config/configTronweb";
import { requestUsers } from "../mongo";
import { initAccountClient } from "./account";
import { transferBalance } from "./type";

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
  try {
    const { fromAddress, toAddress, amount } = req;
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

    findUserSend.balance -= amount;
    findUserReceive.balance += amount;
    await Promise.all([
      requestUsers.findOneAndUpdate(
        { address: fromAddress },
        { $set: { balance: findUserSend.balance } }
      ),
      requestUsers.findOneAndUpdate(
        { address: toAddress },
        { $set: { balance: findUserReceive.balance } }
      ),
    ]);
    const result = await requestUsers.findOne({
      address: fromAddress,
      typeAccount: "client",
    });
    return {
      message: "success",
      balance: result.balance,
    };
  } catch (error) {
    throw error;
  }
};
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
