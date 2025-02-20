import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PRD
    : process.env.DATABASE_URL_DEV;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Set the correct DATABASE_URL for Prisma
process.env.DATABASE_URL = databaseUrl;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
