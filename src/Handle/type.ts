export type historyDetail = {
  _id: string,
  address: string,
  result: number,
  payout: number,
  time: string,
};
export type playGame = {
  address: string,
  number: number;
  amount: number;
};
export type inputGetHistory = {
  address: string;
  pageNumber: number;
  pageSize: number;
};
export type transferBalance = {
  fromAddress: string,
  toAddress: string,
  amount: number,
}