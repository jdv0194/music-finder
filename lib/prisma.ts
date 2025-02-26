import { PrismaClient } from "@prisma/client";

// Create a global variable to store the Prisma Client instance
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
