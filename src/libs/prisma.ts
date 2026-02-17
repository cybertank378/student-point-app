//Files: src/libs/prisma.ts
import "dotenv/config";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * =====================================================
 * DATABASE ADAPTER
 * =====================================================
 */
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

/**
 * =====================================================
 * GLOBAL PRISMA INSTANCE
 * =====================================================
 */
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({adapter,});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;

