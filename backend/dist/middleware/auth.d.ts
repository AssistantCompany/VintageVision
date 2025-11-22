/**
 * Authentication Middleware for Hono
 * Checks session cookies and loads user from Redis/database
 * November 2025
 */
import { Context, Next } from 'hono';
import type { User } from '../db/schema.js';
export type AuthUser = User;
/**
 * Middleware to require authentication
 * Checks session cookie and loads user
 */
export declare function requireAuth(c: Context, next: Next): Promise<Response | void>;
/**
 * Middleware to optionally check auth
 * Adds user to context if authenticated, but doesn't block
 */
export declare function optionalAuth(c: Context, next: Next): Promise<void>;
/**
 * Helper to get current user from context
 */
export declare function getCurrentUser(c: Context): AuthUser | undefined;
/**
 * Helper to require current user (throws if not authenticated)
 */
export declare function requireCurrentUser(c: Context): AuthUser;
/**
 * Helper to get user ID (returns null if not authenticated)
 */
export declare function getUserId(c: Context): string | null;
//# sourceMappingURL=auth.d.ts.map