/**
 * Session Management Service
 * Redis-based sessions for authenticated users
 * January 2026 - Added reconnection strategy
 */

import { createClient } from 'redis';
import { nanoid } from 'nanoid';

let redisClient: ReturnType<typeof createClient>;
let isConnected = false;

export interface SessionData {
  user_id: string;
  expires_at: number;
}

/**
 * Initialize Redis client for sessions with reconnection strategy
 */
export async function initializeSessionStore() {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 20) {
          console.error('❌ Redis: Max reconnection attempts reached');
          return new Error('Max reconnection attempts reached');
        }
        const delay = Math.min(retries * 100, 3000);
        console.log(`🔄 Redis: Reconnecting in ${delay}ms (attempt ${retries})...`);
        return delay;
      },
      connectTimeout: 10000,
    },
  });

  redisClient.on('error', (err) => {
    if (isConnected) {
      console.error('❌ Redis Session Error:', err.message);
    }
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis session store connected');
    isConnected = true;
  });

  redisClient.on('reconnecting', () => {
    console.log('🔄 Redis: Attempting to reconnect...');
    isConnected = false;
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis: Ready to accept commands');
    isConnected = true;
  });

  redisClient.on('end', () => {
    console.log('⚠️ Redis: Connection closed');
    isConnected = false;
  });

  await redisClient.connect();
  return redisClient;
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return isConnected && redisClient?.isOpen;
}

/**
 * Create session token
 */
export function createSessionToken(): string {
  return nanoid(32);
}

/**
 * Create a new session for user
 * Returns session token
 */
export async function createSession(userId: string): Promise<string> {
  if (!isRedisConnected()) {
    throw new Error('Redis not connected');
  }

  const token = createSessionToken();
  const expiresAt = Date.now() + (60 * 24 * 60 * 60 * 1000); // 60 days

  const sessionData: SessionData = {
    user_id: userId,
    expires_at: expiresAt,
  };

  // Store in Redis with TTL
  await redisClient.setEx(
    `session:${token}`,
    60 * 24 * 60 * 60, // 60 days in seconds
    JSON.stringify(sessionData)
  );

  console.log('✅ Session created for user:', userId);
  return token;
}

/**
 * Get session data by token
 */
export async function getSession(token: string): Promise<SessionData | null> {
  if (!isRedisConnected()) {
    console.warn('⚠️ Redis not connected, session lookup failed');
    return null;
  }

  try {
    const data = await redisClient.get(`session:${token}`);

    if (!data) {
      return null;
    }

    const session: SessionData = JSON.parse(data);

    // Check if expired
    if (session.expires_at < Date.now()) {
      await deleteSession(token);
      return null;
    }

    return session;
  } catch (error) {
    console.error('❌ Session lookup error:', error);
    return null;
  }
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  if (!isRedisConnected()) {
    console.warn('⚠️ Redis not connected, cannot delete session');
    return;
  }

  await redisClient.del(`session:${token}`);
  console.log('✅ Session deleted');
}

/**
 * Refresh session expiry
 */
export async function refreshSession(token: string): Promise<void> {
  if (!isRedisConnected()) {
    return;
  }

  const session = await getSession(token);

  if (!session) {
    return;
  }

  // Extend TTL
  const newExpiresAt = Date.now() + (60 * 24 * 60 * 60 * 1000);
  session.expires_at = newExpiresAt;

  await redisClient.setEx(
    `session:${token}`,
    60 * 24 * 60 * 60,
    JSON.stringify(session)
  );
}
