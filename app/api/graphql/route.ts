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

// Wrap the context function so it receives the Next.js RouteContext
const handler = startServerAndCreateNextHandler(server, {
  context: async (ctx) => createContext(ctx),
});

export { handler as GET, handler as POST };
