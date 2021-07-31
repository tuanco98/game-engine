import { CONFIG_ADDRESS_TRON_SERVER } from "../config";
import { requestHistorys, requestUsers } from "../mongo";

const result = {
  message: "",
  balance: 0,
  result: 0,
  payout: 0,
};

const gameEngine = (number: number): boolean => {
  const rand = Math.round(Math.random());
  // const rand = number;
  result.result = rand;
  if (number === rand) return true;
  return false;
};

const updateThenEndGame = async (param: any) => {
  const {
    addressClient,
    addressServer,
    balanceClient,
    balanceServer,
    amount,
    totalGameCount,
    totalServerLose,
    totalServerWin,
    totalUserWin,
    totalUserLose,
  } = param;
  const res = await requestUsers.findOneAndUpdate(
    { address: addressClient },
    {
      $inc: {
        balance: balanceClient,
        totalGameCount,
        totalGameAmount: amount,
        totalServerLose,
        totalServerWin,
        totalUserWin,
        totalUserLose,
      },
    },
  );
  await requestUsers.findOneAndUpdate(
    { address: addressServer },
    {
      $inc: {
        balance: balanceServer,
        totalGameCount,
        totalGameAmount: amount,
        totalServerLose,
        totalServerWin,
        totalUserWin,
        totalUserLose,
      },
    },
  );
  return res;
};

const saveHistory = (address: string, history: any) => {
  requestHistorys.insertOne({
    address,
    number: history.number,
    result: history.result,
    payout: history.payout,
    time: Date.now(),
  });
};
export const gamePlay = async (
  address: string,
  number: number,
  amount: number
) => {
  try {
    const findClient = await requestUsers.findOne({
      address,
    });
    const findServer = await requestUsers.findOne({
      address: CONFIG_ADDRESS_TRON_SERVER,
    });

    if (!findClient) throw new Error("User not found");
    if (findClient.isLock) throw new Error("User has been locked");
    if (amount > findClient.balance)
      throw new Error("balance is not available");
    if (amount > findServer.balance)
      throw new Error("server account has expired");
    // await requestUsers.findOneAndUpdate({ address }, { $inc: { balance: - amount}});
    let res: any;
    if (gameEngine(number)) {
      // clientWin(findServer, findClient, amount);
      result.message = "You win";
      result.payout = amount + amount * 0.9;
      res = await requestUsers.findOneAndUpdate(
        { address },
        {
          $inc: {
            balance: (amount * 0.9),
            totalGameCount: 1,
            totalGameAmount: amount,
            totalServerLose: 1,
            totalUserWin: 1,
          },
        },
        { returnOriginal: false}
      ).then(res => res.value);
      await requestUsers.findOneAndUpdate(
        { address: CONFIG_ADDRESS_TRON_SERVER },
        {
          $inc: {
            balance: - (amount * 0.9),
            totalGameCount: 1,
            totalGameAmount: amount,
            totalServerLose: 1,
            totalUserWin: 1,
          },
        },
      );
    } else {
      // clientLose(findServer, findClient, amount);
      result.message = "You lose";
      result.payout = amount * 0;
      res = await requestUsers.findOneAndUpdate(
        { address },
        {
          $inc: {
            balance: - amount,
            totalGameCount: 1,
            totalGameAmount: amount,
            totalServerWin: 1,
            totalUserLose: 1,
          },
        },
        { returnOriginal: false }
      ).then(res => res.value);
      await requestUsers.findOneAndUpdate(
        { address: CONFIG_ADDRESS_TRON_SERVER },
        {
          $inc: {
            balance: amount,
            totalGameCount: 1,
            totalGameAmount: amount,
            totalServerWin: 1,
            totalUserLose: 1,
          },
        },
      );
    }
    result.balance = res.balance;
    saveHistory(address, result);
    return result;
  } catch (error) {
    throw error;
  }
};
