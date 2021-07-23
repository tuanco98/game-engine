import { PubSub } from "apollo-server";

export const resolvers = {
  Query: {
    fund_get: () => {
      return 'fun_get'
    }
  },
  Mutation: {
    user_play: (number: number, amount: number) => {
      return 'You win!'
    }
  },
  Subscription: {
    gameSub: () => {
      return 'OK'
    }
  },
};
