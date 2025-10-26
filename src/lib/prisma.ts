import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance to prevent multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const poolerUrl = process.env.EXTERNAL_TRANSACTION_POOLER_DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: poolerUrl
      ? {
          db: {
            url: poolerUrl,
          },
        }
      : undefined,
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
