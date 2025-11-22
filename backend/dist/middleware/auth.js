/**
 * Authentication Middleware for Hono
 * Checks session cookies and loads user from Redis/database
 * November 2025
 */
import { getCookie } from 'hono/cookie';
import { getSession } from '../services/session.js';
import { getUserById } from '../services/auth.js';
/**
 * Middleware to require authentication
 * Checks session cookie and loads user
 */
export async function requireAuth(c, next) {
    const sessionToken = getCookie(c, 'session');
    if (!sessionToken) {
        return c.json({
            success: false,
            error: 'Unauthorized. Please sign in.',
        }, 401);
    }
    // Get session from Redis
    const session = await getSession(sessionToken);
    if (!session) {
        return c.json({
            success: false,
            error: 'Session expired. Please sign in again.',
        }, 401);
    }
    // Get user from database
    const user = await getUserById(session.user_id);
    if (!user) {
        return c.json({
            success: false,
            error: 'User not found. Please sign in again.',
        }, 401);
    }
    // Store user in Hono context for easy access in routes
    c.set('user', user);
    await next();
}
/**
 * Middleware to optionally check auth
 * Adds user to context if authenticated, but doesn't block
 */
export async function optionalAuth(c, next) {
    const sessionToken = getCookie(c, 'session');
    if (sessionToken) {
        const session = await getSession(sessionToken);
        if (session) {
            const user = await getUserById(session.user_id);
            if (user) {
                c.set('user', user);
            }
        }
    }
    await next();
}
/**
 * Helper to get current user from context
 */
export function getCurrentUser(c) {
    return c.get('user');
}
/**
 * Helper to require current user (throws if not authenticated)
 */
export function requireCurrentUser(c) {
    const user = c.get('user');
    if (!user) {
        throw new Error('User not authenticated');
    }
    return user;
}
/**
 * Helper to get user ID (returns null if not authenticated)
 */
export function getUserId(c) {
    const user = getCurrentUser(c);
    return user?.id || null;
}
//# sourceMappingURL=auth.js.map