import { ApolloServer } from "apollo-server";
import { CONFIG_API_PORT } from "./config";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";

export const initApollo = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: (req) => ({
        ...req,
      }),
    });
    const { url } = await server.listen({ port: CONFIG_API_PORT });
    console.log(`🚀 Apollo server ready at ${url}`);
  } catch (e) {
    throw e;
  }
};
