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
  result.result = rand;
  if (number === rand) return true;
  return false;
};

const updateThenEndGame = async (server: any, client: any) => {
  await requestUsers.updateOne(
    {
      address: client.address,
    },
    {
      $set: client,
    }
  );
  await requestUsers.updateOne(
    {
      address: CONFIG_ADDRESS_TRON_SERVER,
    },
    {
      $set: server,
    }
  );
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
export const gamePlay = async (address: string, number: number, amount: number) => {
  try {
    const findClient = await requestUsers.findOne({
      address,
    });
    const findServer = await requestUsers.findOne({
      address: CONFIG_ADDRESS_TRON_SERVER,
    });
    
    if (!findClient) throw new Error('User not found');
    if(findClient.isLock) throw new Error('User has been locked')
    if (amount > findClient.balance)
      throw new Error("balance is not available");
    if (amount > findServer.balance)
      throw new Error("server account has expired");
    // Thực hiện trừ tiền của user
    findClient.balance -= amount;

    if (gameEngine(number)) {
      // clientWin(findServer, findClient, amount);
      result.message = "You win";
      result.payout = amount + (amount * 0.9);

      findClient.balance += amount + (amount * 0.9);
      findClient.totalGameCount++;
      findClient.totalGameAmount += amount;
      findClient.totalServerLose++;
      findClient.totalUserWin++;

      findServer.balance -= (amount * 0.9);
      findServer.totalGameCount++;
      findServer.totalGameAmount += amount;
      findServer.totalServerLose++;
      findServer.totalUserWin++;
    } else {
      // clientLose(findServer, findClient, amount);
      result.message = "You lose";
      result.payout = amount * 0;

      findClient.balance += amount * 0;
      findClient.totalGameCount++;
      findClient.totalGameAmount + amount;
      findClient.totalUserLose++;
      findClient.totalServerWin++;

      findServer.balance += amount;
      findServer.totalGameCount++;
      findServer.totalGameAmount + amount;
      findServer.totalUserLose++;
      findServer.totalServerWin++;
    }
    result.balance = findClient.balance;
    updateThenEndGame(findServer, findClient);
    saveHistory(address, result);
    return result;
  } catch (error) {
    throw error;
  }
};
