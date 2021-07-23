import { PubSub } from "apollo-server";
import { gamePlay } from "./Handle/gameEngine";

type playGame = {
  number: number,
  amount: number,
}

export const resolvers = {
  Query: {
    fund_get: () => {
      return 'fun_get';
    }
  },
  Mutation: {
    userPlay: (parent: any, args: playGame ) => {
      const { number, amount } = args;
      if (gamePlay(number, amount))
      return 'You win!';
      return 'You lose!';
    }
  },
  Subscription: {
    gameSub: () => {
      return 'OK'
    }
  },
};
