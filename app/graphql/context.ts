import { PrismaClient } from "@prisma/client";
import { getUserFromRequest } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export interface GraphQLContext {
  prisma: PrismaClient;
  userId: string | null;
}

export async function createContext(ctx: any): Promise<GraphQLContext> {
  // Get the request object, which might be in different places depending on the environment
  const req = ctx?.req || ctx?.request || ctx;

  // Get the user from the request
  const userInfo = getUserFromRequest(req);

  return {
    prisma,
    userId: userInfo?.userId || null,
  };
}
