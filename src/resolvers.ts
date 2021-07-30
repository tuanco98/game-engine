import { CONFIG_ADDRESS_TRON_SERVER } from "./config";
import { getListUser, initAccountClient, lockUser, removeUser, unLockUser } from "./Handle/account";
import { gamePlay } from "./Handle/gameEngine";
import { getBalanceServer, transferUserToUser, userWithdraw, withdraw } from "./Handle/handleAsset";
import { historyDetail, inputGetHistory, playGame, transferBalance } from "./Handle/type";
import { requestHistorys, requestUsers } from "./mongo";
const ObjectId = require('mongodb').ObjectId;

const userGameGetHistoty = async (request: inputGetHistory) => {
  try {
    const { address, pageNumber, pageSize } = request;
    let result: Array<historyDetail> = []; 

    result = await requestHistorys
      .find({ address })
      .skip(pageSize * pageNumber)
      .limit(pageSize)
      .toArray();
    const count = await requestHistorys.countDocuments({ address });
    return {
      data: result,
      message: "Success",
      pageSize,
      currentPage: pageNumber,
      totalpage: Math.ceil(count / pageSize),
      totalElements: count,
    };
  } catch (error) {
    throw error;
  }
};
const gameGet = async (gameId: string) => {
  try {
    let result: historyDetail;
    result = await requestHistorys.findOne({ _id: ObjectId(gameId) });
    if (!result) throw new Error('Game Not found');
    return result;
  } catch (error) {
    throw error;
  }
}
const userGet = async (address: string) => {
  try {
    const findByAddress = await requestUsers.findOne({ address, typeAccount: 'client' });
  if (!findByAddress) throw new Error('User not found');
  return findByAddress;
  } catch (error) {
    throw error
  }
};
const fundGet = async () => {
  try {
    const find = await requestUsers.findOne({ address: CONFIG_ADDRESS_TRON_SERVER, typeAccount: 'server' });
    if (!find) throw new Error('User not found');
    return find;
  } catch (error) {
    throw error;
  }
}
const user_Withdraw = async (address: string, amount: number) => {
  const balanceUser = await requestUsers.findOne({ address, typeAccount: 'client' });

  if(!balanceUser) throw new Error('User not found')
  if(balanceUser.isLock) throw new Error('User has been locked')

  const balanceServer = await requestUsers.findOne({ address: CONFIG_ADDRESS_TRON_SERVER, typeAccount: 'server' });
  if (amount > balanceUser.balance) throw new Error('Balance is not available');
  if (amount > balanceServer.balance) throw new Error('The server enough balance');
  let txid: string;
  Promise.all([
    txid = await withdraw(address, amount * 1000000 * 0.9),
    userWithdraw(address, amount)
  ])
  return txid;
}
export const resolvers = {
  Query: {
    userGameHistoryGet: async (parent: any, args: inputGetHistory) => {
      return userGameGetHistoty(args);
    },
    gameGet: (parent: any, args: { gameId: string }) =>{
      return gameGet(args.gameId);
    },
    fundGet: () => {
      return fundGet();
    },
    userGet: (parent: any, agrs: { address: string }) => {
      return userGet(agrs.address);
    },
    getListUser: (parent: any, agrs: { pageNumber: number, pageSize: number }) => {
      return getListUser(agrs);
    }
  },
  Mutation: {
    registerUser: async (parent: any, args: { address: string }) => {
      try {
        const { address } = args;
        const find = await requestUsers.findOne({ address });
        if (find) return "This address already exists";
        initAccountClient(address, 0);
        return "OK";
      } catch (error) {
        throw error;
      }
    },
    userPlay: async (parent: any, args: playGame) => {
      try {
        const {address, number, amount } = args;
        return gamePlay(address, number, amount);
      } catch (error) {
        throw error;
      }
    },
    userWithdraw: (parent: any, agrs: { address: string, amount: number }) => {
      const { address, amount } = agrs;
      return user_Withdraw(address, amount);
    },
    changeBalanceUser: (parent: any, agrs: transferBalance) => {
      return transferUserToUser(agrs);
    },
    lockUser: (parent: any, agrs: { address: string }) => {
      return lockUser(agrs);
    },
    unLockUser: (parent: any, agrs: { address: string }) => {
      return unLockUser(agrs);
    },
    removeUser: (parent: any, agrs: { address: string }) => {
      return removeUser(agrs);
    }
  },
  Subscription: {
    gameSub: () => {
      return "OK";
    },
  },
};

