/**
 * Session Management Service
 * Redis-based sessions for authenticated users
 * November 2025
 */

import { createClient } from 'redis';
import { nanoid } from 'nanoid';

let redisClient: ReturnType<typeof createClient>;

export interface SessionData {
  user_id: string;
  expires_at: number;
}

/**
 * Initialize Redis client for sessions
 */
export async function initializeSessionStore() {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379',
  });

  redisClient.on('error', (err) => console.error('❌ Redis Session Error:', err));
  redisClient.on('connect', () => console.log('✅ Redis session store connected'));

  await redisClient.connect();
  return redisClient;
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
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  await redisClient.del(`session:${token}`);
  console.log('✅ Session deleted');
}

/**
 * Refresh session expiry
 */
export async function refreshSession(token: string): Promise<void> {
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
