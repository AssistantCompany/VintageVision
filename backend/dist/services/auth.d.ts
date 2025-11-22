/**
 * Authentication Service
 * User management and session helpers for Google OAuth with native Hono
 * November 2025
 */
import type { User } from '../db/schema.js';
export interface GoogleUserInfo {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
}
/**
 * Find or create user from Google OAuth profile
 */
export declare function findOrCreateUser(googleUser: GoogleUserInfo): Promise<User>;
/**
 * Get user by ID (UUID)
 */
export declare function getUserById(userId: string): Promise<User | null>;
/**
 * Get user by Google ID
 */
export declare function getUserByGoogleId(googleId: string): Promise<User | null>;
/**
 * Update user profile
 */
export declare function updateUserProfile(userId: string, updates: Partial<{
    displayName: string;
    avatarUrl: string;
    emailVerified: boolean;
}>): Promise<{
    id: string;
    email: string;
    googleId: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    emailVerified: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
} | null>;
//# sourceMappingURL=auth.d.ts.map