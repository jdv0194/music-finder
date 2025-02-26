import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import { createContext } from "../../graphql/context";
import { NextRequest } from "next/server";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return error;
  },
});

// Create Next.js handler
const apolloHandler = startServerAndCreateNextHandler(server, {
  context: async (ctx) => createContext(ctx),
});

// Export GET and POST functions with proper signatures
export async function GET(request: NextRequest, context: any) {
  return apolloHandler(request);
}

export async function POST(request: NextRequest, context: any) {
  return apolloHandler(request);
}
