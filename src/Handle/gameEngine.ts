import {
  CONFIG_ADDRESS_TRON_CLIENT,
  CONFIG_ADDRESS_TRON_SERVER,
} from "../config";
import { requestUsers } from "../mongo";

type infoAccount = {
  address: String;
  balance: number;
  totalGameCount: number;
  totalGameAmount: number;
  totalServerWin: number;
  totalServerLose: number;
  totalWithdrawAmount: number;
  totalUserWin: number;
  totalUserLose: number;
  totalDepositCount: number;
  totalWithdrawCount: number;
  totalDepositAmount: number;
};
const gameEngine = (number: number): boolean => {
  const rand = Math.round(Math.random());
  if (number === rand) return true;
  return false;
};
const clientWin = async (
  server: infoAccount,
  client: infoAccount,
  amount: number
) => {
  requestUsers.updateOne(
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
  requestUsers.updateOne(
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
  server: infoAccount,
  client: infoAccount,
  amount: number
) => {
  requestUsers.updateOne(
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
  requestUsers.updateOne(
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
    if (findServer > findServer.balance)
      throw new Error("server account has expired");

    if (gameEngine(number)) {
      clientWin(findClient, findServer, amount);
      return "You win";
    }
    clientLose(findClient, findServer, amount);
    return "You lose";
  } catch (error) {
    throw error;
  }
};
