import { PrismaClient } from "@/prisma/db-auth/generated/client-dbauth";

declare global {
  var prisma: PrismaClient | undefined;
}

export const dbAuth = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = dbAuth;