import { PrismaClient } from '@prisma/client';
import { EXTERNAL_TRANSACTION_POOLER_DATABASE_URL } from '../config';

// Debug logging
console.log('=== DATABASE CONNECTION DEBUG ===');
console.log(
  'EXTERNAL_TRANSACTION_POOLER_DATABASE_URL:',
  EXTERNAL_TRANSACTION_POOLER_DATABASE_URL ? 'SET' : 'NOT SET'
);
console.log(
  'URL starts with:',
  EXTERNAL_TRANSACTION_POOLER_DATABASE_URL?.substring(0, 30) + '...'
);
console.log('Full URL:', EXTERNAL_TRANSACTION_POOLER_DATABASE_URL);
console.log('================================');

// Force new Prisma client instance (no caching)
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: EXTERNAL_TRANSACTION_POOLER_DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});
