import { PrismaClient } from '@prisma/client';

const EXTERNAL_TRANSACTION_POOLER_DATABASE_URL =
  process.env.EXTERNAL_TRANSACTION_POOLER_DATABASE_URL;

// Debug logging
console.log('=== DATABASE CONNECTION DEBUG ===');
console.log(
  'EXTERNAL_TRANSACTION_POOLER_DATABASE_URL:',
  EXTERNAL_TRANSACTION_POOLER_DATABASE_URL ? 'SET' : 'NOT SET'
);
console.log('================================');

// Create a singleton Prisma client instance to prevent multiple connections
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
