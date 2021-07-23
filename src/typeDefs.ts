import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    fund_get: String
    user_get(address: String): String
    user_game_history_get(address: String, pageNumber: Int, pageSize: Number): String
    game_get(gameId: String): String
  }
  
  type Mutation {
    user_play(number: Int, amount: Int) : String
  }

  type Subscription {
    gameSub: String
  }
`;
