import {
  CONFIG_ADDRESS_TRON_CLIENT,
  CONFIG_ADDRESS_TRON_SERVER,
} from "../config";
import { requestHistorys, requestUsers } from "../mongo";

const result = {
  message: '',
  result: 0,
  payout: 0,
};

const gameEngine = (number: number): boolean => {
  const rand = Math.round(Math.random());
  result.result = rand;
  if (number === rand) return true
  return false;
};
const clientWin = async (
  server: any,
  client: any,
  amount: number
) => {
  await requestUsers.updateOne(
    {
      address: CONFIG_ADDRESS_TRON_CLIENT,
    },
    {
      $set: {
        balance: client.balance + amount,
        totalGameCount: ++client.totalGameCount,
        totalGameAmount: client.totalGameAmount + amount,
        totalServerLose: ++client.totalServerLose,
        totalUserWin: ++client.totalUserWin,
      },
    }
  );
  await requestUsers.updateOne(
    {
      address: CONFIG_ADDRESS_TRON_SERVER,
    },
    {
      $set: {
        balance: server.balance - amount,
        totalGameCount: ++server.totalGameCount,
        totalGameAmount: server.totalGameAmount + amount,
        totalServerLose: ++server.totalServerLose,
        totalUserWin: ++server.totalUserWin,
      },
    }
  );
};
const clientLose = async (
  server: any,
  client: any,
  amount: number
) => {
  await requestUsers.updateOne(
    {
      address: CONFIG_ADDRESS_TRON_CLIENT,
    },
    {
      $set: {
        balance: client.balance - amount,
        totalGameCount: ++client.totalGameCount,
        totalGameAmount: client.totalGameAmount + amount,
        totalUserLose: ++client.totalUserLose,
        totalServerWin: ++client.totalServerWin,
      },
    }
  );
  await requestUsers.updateOne(
    {
      address: CONFIG_ADDRESS_TRON_SERVER,
    },
    {
      $set: {
        balance: server.balance + amount,
        totalGameCount: ++server.totalGameCount,
        totalGameAmount: server.totalGameAmount + amount,
        totalUserLose: ++server.totalUserLose,
        totalServerWin: ++server.totalServerWin,
      },
    }
  );
};
const saveHistory = (history: any) => {
  requestHistorys.insertOne({
    address: CONFIG_ADDRESS_TRON_CLIENT,
    number: history.number,
    result: history.result,
    payout: history.payout,
    time: Date.now(),
  })
}
export const gamePlay = async (number: number, amount: number) => {
  try {
    const findClient = await requestUsers.findOne({
      address: CONFIG_ADDRESS_TRON_CLIENT,
    });
    const findServer = await requestUsers.findOne({
      address: CONFIG_ADDRESS_TRON_SERVER,
    });
    if (amount > findClient.balance)
      throw new Error("balance is not available");
    if (amount > findServer.balance)
      throw new Error("server account has expired");

    if (gameEngine(number)) {
      clientWin(findServer, findClient, amount);
      result.message = 'You win';
      result.payout = amount * 2;
    } else {
      clientLose(findServer, findClient, amount);
      result.message = 'You lose';
      result.payout = amount * 0;
    }
    saveHistory(result)
    return result;
  } catch (error) {
    throw error;
  }
};
