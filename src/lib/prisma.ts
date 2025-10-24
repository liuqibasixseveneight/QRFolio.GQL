import { PrismaClient } from '@prisma/client';
import {
  EXTERNAL_TRANSACTION_POOLER_DATABASE_URL,
  EXTERNAL_DATABASE_URL,
} from '../config';

// Use direct connection locally, pooler in production
const databaseUrl =
  process.env.NODE_ENV === 'production'
    ? EXTERNAL_TRANSACTION_POOLER_DATABASE_URL
    : EXTERNAL_DATABASE_URL;

// Create a singleton Prisma client instance to prevent multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Default Prisma client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
