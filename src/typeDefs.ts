import { gql } from "apollo-server";

export const typeDefs = gql`
  type Result {
    message: String,
    balance: Float,
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

  type ResponseHistory {
    data: [History]
    message: String,
    pageSize: Int,
    currentPage: Int,
    totalpage: Int,
    totalElements: Int,
  }

  type UserGet {
    address: String
    balance: Float,
    lockBalance: Float,
    isLock: Boolean,
    totalGameCount: Int,
    totalGameAmount: Float,
    totalDepositCount: Int,
    totalDepositAmount: Float,
    totalUserLose: Int,
    totalUserWin: Int,
    totalWithdrawCount: Int,
    totalWithdrawAmount: Float,
  }
  type GetListUser {
    data: [UserGet]
    message: String,
    pageSize: Int,
    currentPage: Int,
    totalpage: Int,
    totalElements: Int,
  }
  type FundGet {
    address: String,
    balance: Float,
    totalGameCount: Int,
    totalGameAmount: Float,
    totalUserCount: Int,
    totalDepositCount: Int,
    totalDepositAmount: Float,
    totalUserLose: Int,
    totalUserWin: Int,
    totalServerWin: Int,
    totalServerLose: Int,
    totalWithdrawCount: Int,
    totalWithdrawAmount: Float,
  }
  type ChangeBalanceUser {
    message: String,
    balance: Float,
  }
  type LockUser {
    message: String,
    isLock: Boolean,
    balance: Float,
    lockBalance: Float,
  }
  type Query {
    fundGet: FundGet
    userGet(address: String!): UserGet
    userGameHistoryGet(address: String!, pageNumber: Int!, pageSize: Int!): ResponseHistory
    getListUser(pageNumber: Int!, pageSize: Int!) : GetListUser
    gameGet(gameId: String!): History
  }
  
  type Mutation {
    registerUser(address: String!): UserGet
    userPlay(address: String!, number: Int!, amount: Float!): Result
    userWithdraw(address: String!, amount: Float!): String
    changeBalanceUser(fromAddress: String!, toAddress: String!, amount: Float!): ChangeBalanceUser
    lockUser(address: String): LockUser
    unLockUser(address: String): LockUser
    removeUser(address: String): String
  }

  type Subscription {
    userSub: UserGet
  }
`;
