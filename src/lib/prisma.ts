import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance to prevent multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const poolerUrl = process.env.EXTERNAL_TRANSACTION_POOLER_DATABASE_URL;

// Add pgbouncer=true parameter to connection string if using a transaction pooler
// This tells Prisma to work in transaction mode, avoiding prepared statement conflicts
const getConnectionUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;

  try {
    // Use proper URL parsing to check if pgbouncer parameter exists
    const urlObj = new URL(url);
    if (urlObj.searchParams.has('pgbouncer')) {
      return url;
    }
    // Add pgbouncer=true parameter
    urlObj.searchParams.set('pgbouncer', 'true');
    return urlObj.toString();
  } catch {
    // Fallback to string-based check if URL parsing fails (shouldn't happen with valid URLs)
    // Check if pgbouncer parameter is already present (using more precise check)
    if (url.includes('pgbouncer=')) {
      return url;
    }
    // Add pgbouncer=true parameter
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}pgbouncer=true`;
  }
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: poolerUrl
      ? {
          db: {
            url: getConnectionUrl(poolerUrl),
          },
        }
      : undefined,
    log: ['query', 'info', 'warn', 'error'],
  });

// Handle graceful shutdown
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ensure proper cleanup on shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
