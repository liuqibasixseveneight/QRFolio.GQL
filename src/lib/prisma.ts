import { PrismaClient } from '@prisma/client';
import { EXTERNAL_TRANSACTION_POOLER_DATABASE_URL } from '../config';

// Create a singleton Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Default Prisma client (uses EXTERNAL_TRANSACTION_POOLER_DATABASE_URL)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: EXTERNAL_TRANSACTION_POOLER_DATABASE_URL,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
