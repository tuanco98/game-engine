import axios from "axios";
import { resolvers } from "./resolvers";

type parameters = {
  before: { col: number, row: number },
  after: { col: number; row: number },
}

// export const sendRequestToServer = async (value: parameters) => {
//   const { before, after } = value;
//   let res = await axios(CONFIG_OPPONENT_URI, {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     data: JSON.stringify({
//       query: `
//         mutation{
//           chessMove(before:{col:${before.col},row:${before.row}},after:{col:${after.col},row:${after.row}})
//         }
//       `,
//     }),
//   });
//   const { data } = res;
//   return data;
// };


