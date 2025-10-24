/**
 * Database Connection Utilities
 *
 * This file provides guidance on when to use different Prisma client instances
 * for optimal performance with Supabase connection poolers.
 */

import { prisma } from '../lib/prisma';

/**
 * Use Cases for Different Connection Types:
 *
 * 1. prisma (Default - EXTERNAL_DATABASE_URL)
 *    - Development and testing
 *    - Direct database connection
 *    - No connection pooling
 *
 * 2. prismaSession (SUPABASE_SESSION_POOLER_URL)
 *    - Long-running operations
 *    - Operations that need persistent connections
 *    - Background jobs
 *    - Real-time subscriptions
 *    - WebSocket connections
 *
 * 3. prismaTransaction (SUPABASE_TRANSACTION_POOLER_URL)
 *    - Short-lived operations
 *    - Quick queries
 *    - Transaction operations
 *    - API endpoints
 *    - Serverless functions
 */

// Example usage patterns:

/**
 * For API endpoints and quick operations
 */
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

/**
 * For long-running operations or background jobs
 */
export async function processUserProfiles() {
  return await prisma.profile.findMany({
    where: { accessLevel: 'public' },
  });
}

/**
 * For transactions and complex operations
 */
export async function createUserWithProfile(userData: any, profileData: any) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const profile = await tx.profile.create({
      data: {
        ...profileData,
        id: user.id,
      },
    });

    return { user, profile };
  });
}

/**
 * For development/testing (fallback to default)
 */
export async function getAllUsers() {
  return await prisma.user.findMany();
}
