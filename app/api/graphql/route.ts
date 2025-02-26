import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import { createContext } from "../../graphql/context";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return error;
  },
});

const handler = startServerAndCreateNextHandler(server, {
  context: createContext,
});

export { handler as GET, handler as POST };
