// Database Client with Connection Pooling
// October 2025 - Drizzle ORM + PostgreSQL

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../config/env.js';
import * as schema from './schema.js';

const { Pool } = pg;

// Connection pool configuration (Oct 2025 best practices)
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Maximum pool size
  min: 5, // Minimum pool size
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout connection attempts after 10s
  maxUses: 7500, // Rotate connections after 7500 uses
  ssl: false, // Disabled for self-hosted PostgreSQL in Docker
});

// Drizzle instance
export const db = drizzle(pool, { schema, logger: env.NODE_ENV === 'development' });

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }
}

// Pool event listeners for monitoring
pool.on('connect', () => {
  console.log('📊 New database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

pool.on('remove', () => {
  console.log('📊 Database connection removed from pool');
});

console.log('✅ Database client initialized with connection pooling');
