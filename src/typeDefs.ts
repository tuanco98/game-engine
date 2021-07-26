import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    fund_get: String
    user_get(address: String): String
    user_game_history_get(address: String, pageNumber: Int, pageSize: Int): String
    game_get(gameId: String): String
  }
  
  type Mutation {
    registerUser(address: String): String
    userPlay(number: Int, amount: Float): String
    user_withdraw(address: String, amount: Float): String
  }

  type Subscription {
    gameSub: String
  }
`;
