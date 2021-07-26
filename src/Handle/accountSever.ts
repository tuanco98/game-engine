import { CONFIG_ADDRESS_TRON_SERVER } from "../config";
import { requestUsers } from "../mongo"

export const initAccount = (address: String, typeAccount: String) => {
  return requestUsers.insertOne({
    address,
    typeAccount,
    balance: 0,
    totalGameCount: 0,
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
export const isAccountServer = async () => {
  const find = await requestUsers.findOne({ address: CONFIG_ADDRESS_TRON_SERVER });
  if (!find) {
    initAccount(CONFIG_ADDRESS_TRON_SERVER, 'server');
  }
  return 'OK';
}