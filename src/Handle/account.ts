import { CONFIG_ADDRESS_TRON_SERVER } from "../config";
import { requestUsers } from "../mongo"
import { getBalanceServer } from "./handleAsset";
import { historyDetail } from "./type";

export const initAccountServer = async (address: String, balance: number) => {
  return requestUsers.insertOne({
    address,
    typeAccount: 'server',
    balance,
    totalGameCount: 0,
    totalUserCount: 0,
    totalGameAmount: 0,
    totalServerWin: 0,
    totalServerLose: 0,
    totalWithdrawAmount: 0,
    totalUserWin: 0,
    totalUserLose: 0,
    totalDepositCount: 0,
    totalWithdrawCount: 0,
    totalDepositAmount: 0,
  })
}
export const initAccountClient = async (address: String, balance: number) => {
  await requestUsers.insertOne({
    address,
    typeAccount: 'client',
    balance,
    lockBalance: 0,
    isLock: false,
    totalGameCount: 0,
    totalUserCount: 0,
    totalGameAmount: 0,
    totalServerWin: 0,
    totalServerLose: 0,
    totalWithdrawAmount: 0,
    totalUserWin: 0,
    totalUserLose: 0,
    totalDepositCount: 0,
    totalWithdrawCount: 0,
    totalDepositAmount: 0,
  })
  const findServer = await requestUsers.findOne({ address: CONFIG_ADDRESS_TRON_SERVER, typeAccount: 'server'})
  await requestUsers.findOneAndUpdate({ address: CONFIG_ADDRESS_TRON_SERVER, typeAccount: 'server' },
    { $set: { totalUserCount: findServer.totalUserCount += 1 }})
  return 'OK';
}
export const getListUser = async (req: { pageNumber: number, pageSize: number }) => {
  try {
    const { pageNumber, pageSize } = req;

    const result = await requestUsers
      .find({ typeAccount: 'client' })
      .skip(pageSize * pageNumber)
      .limit(pageSize)
      .toArray();
    const count = await requestUsers.countDocuments({ typeAccount: 'client' });
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
}
export const lockUser = async (req: { address: string }) => {
  const { address } = req;
  const findUser = await requestUsers.findOne({ address , typeAccount: 'client' });
  if (!findUser) throw new Error('User not found');
  if(findUser.isLock) throw new Error('User has been locked');

  await requestUsers.findOneAndUpdate(
    { address },
    { $set: { balance: 0 , lockBalance: findUser.balance, isLock: true }},
    )
  const result = await requestUsers.findOne({ address , typeAccount: 'client' });
  return {
    message: 'success',
    isLock: result.isLock,
    balance: result.balance,
    lockBalance: result.lockBalance,
  };
}
export const unLockUser = async (req: { address: string }) => {
  const { address } = req;
  const findUser = await requestUsers.findOne({ address , typeAccount: 'client' });
  if (!findUser) throw new Error('User not found');
  if(!findUser.isLock) throw new Error('User is not locked');

  await requestUsers.findOneAndUpdate(
    { address },
    { $set: { balance: findUser.lockBalance + findUser.balance, lockBalance: 0, isLock: false }},
    )
  const result = await requestUsers.findOne({ address , typeAccount: 'client' });
  return {
    message: 'success',
    isLock: result.isLock,
    balance: result.balance,
    lockBalance: result.lockBalance,
  };
}
export const removeUser = async (req: { address: string }) => {
  const { address } = req;
  const findUser = await requestUsers.findOne({ address , typeAccount: 'client' });
  if (!findUser) throw new Error('User not found');

  await requestUsers.findOneAndDelete({ address })
  const balance = findUser.balance + findUser.lockBalance;
  const findServer = await requestUsers.findOne({ address: CONFIG_ADDRESS_TRON_SERVER , typeAccount: 'server' })
  requestUsers.findOneAndUpdate(
    { address: CONFIG_ADDRESS_TRON_SERVER },
    { $set: { balance: findServer.balance + balance , totalUserCount: findServer.totalUserCount -= 1 }}
    )
  return 'Remove user success';
}
export const isAccountServer = async () => {
  try {
    const find = await requestUsers.findOne({ address: CONFIG_ADDRESS_TRON_SERVER });
    if (!find) {
      const getBalance : number = await getBalanceServer();
      initAccountServer(CONFIG_ADDRESS_TRON_SERVER, getBalance);
    }
    return 'OK'; 
  } catch (error) {
    throw error;
  }
}