import { PrismaClient } from '@prisma/client';
import {
  EXTERNAL_DATABASE_URL,
  SUPABASE_SESSION_POOLER_URL,
  SUPABASE_TRANSACTION_POOLER_URL,
} from '../config';

// Create a singleton Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSession: PrismaClient | undefined;
  prismaTransaction: PrismaClient | undefined;
};

// Default Prisma client (uses EXTERNAL_DATABASE_URL)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: EXTERNAL_DATABASE_URL,
      },
    },
  });

// Session pooler Prisma client (for long-running sessions)
export const prismaSession =
  globalForPrisma.prismaSession ??
  new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_SESSION_POOLER_URL || EXTERNAL_DATABASE_URL,
      },
    },
  });

// Transaction pooler Prisma client (for short-lived transactions)
export const prismaTransaction =
  globalForPrisma.prismaTransaction ??
  new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_TRANSACTION_POOLER_URL || EXTERNAL_DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSession = prismaSession;
  globalForPrisma.prismaTransaction = prismaTransaction;
}
