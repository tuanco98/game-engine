import { PubSub } from "apollo-server";
import {
  CONFIG_ADDRESS_TRON_CLIENT,
  CONFIG_ADDRESS_TRON_SERVER,
} from "./config";
import { initAccount } from "./Handle/accountSever";
import { gamePlay } from "./Handle/gameEngine";
import { requestUsers } from "./mongo";

type playGame = {
  number: number;
  amount: number;
};

export const resolvers = {
  Query: {
    fund_get: () => {
      return "fun_get";
    },
  },
  Mutation: {
    registerUser: async (parent: any, args: { address: String }) => {
      const { address } = args;
      const find = await requestUsers.findOne({ address });
      if (find) return "This address already exists";
      initAccount(address, 'client');
      return "OK";
    },
    userPlay: async (parent: any, args: playGame) => {
      try {
        const { number, amount } = args;
        return gamePlay(number, amount);
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {
    gameSub: () => {
      return "OK";
    },
  },
};
