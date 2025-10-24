# Supabase Connection Pooler Setup

This project now supports Supabase connection poolers for optimal database performance. The setup includes three different Prisma client instances for different use cases.

## Environment Variables

Add these environment variables to your `.env` file:

```bash
# Session Pooler (for long-running sessions)
SUPABASE_SESSION_POOLER_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Transaction Pooler (for short-lived transactions)
SUPABASE_TRANSACTION_POOLER_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=0"
```

## Connection Types

### 1. Default Connection (`prisma`)

- **Use for**: Development, testing, direct database access
- **Connection**: Direct to Supabase database
- **Environment Variable**: `EXTERNAL_DATABASE_URL`

### 2. Session Pooler (`prismaSession`)

- **Use for**: Long-running operations, background jobs, real-time subscriptions
- **Connection**: Supabase session pooler
- **Environment Variable**: `SUPABASE_SESSION_POOLER_URL`
- **Benefits**: Persistent connections, better for WebSocket connections

### 3. Transaction Pooler (`prismaTransaction`)

- **Use for**: API endpoints, quick queries, serverless functions
- **Connection**: Supabase transaction pooler
- **Environment Variable**: `SUPABASE_TRANSACTION_POOLER_URL`
- **Benefits**: Fast connection establishment, optimized for short-lived operations

## Usage Examples

```typescript
import { prisma, prismaSession, prismaTransaction } from './lib/prisma';

// Quick API operation
const user = await prismaTransaction.user.findUnique({
  where: { id: userId },
});

// Long-running background job
const profiles = await prismaSession.profile.findMany({
  where: { accessLevel: 'public' },
});

// Transaction operation
await prismaTransaction.$transaction(async (tx) => {
  // Multiple operations in a single transaction
});
```

## Getting Your Supabase Pooler URLs

1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Find the "Connection Pooling" section
4. Copy the Session and Transaction pooler URLs
5. Replace `[YOUR-PROJECT-REF]`, `[YOUR-PASSWORD]`, and `[REGION]` with your actual values

## Fallback Behavior

If the pooler URLs are not provided, the system will fallback to using the `EXTERNAL_DATABASE_URL` for all connections, ensuring your application continues to work even without pooler configuration.
