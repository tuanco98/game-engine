import { gql } from "apollo-server";

export const typeDefs = gql`
  type Result {
    message: String,
    result: Int,
    payout: Float,
  }

  type History {
    _id: String,
    address: String,
    result: Int,
    payout: Float,
    time: String,
  }
  
  type RequestHistory {
    data: [History]
    message: String,
    pageSize: Int,
    currentPage: Int,
  }

  type Query {
    fund_get: String
    user_get(address: String): String
    user_game_history_get(address: String!, pageNumber: Int!, pageSize: Int!): RequestHistory
    game_get(gameId: String): String
  }
  
  type Mutation {
    registerUser(address: String): String
    userPlay(number: Int, amount: Float): Result
    user_withdraw(address: String, amount: Float): String
  }

  type Subscription {
    gameSub: String
  }
`;
