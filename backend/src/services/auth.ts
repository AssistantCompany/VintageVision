/**
 * Authentication Service
 * User management and session helpers for Google OAuth with native Hono
 * November 2025
 */

import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { User } from '../db/schema.js';

export interface GoogleUserInfo {
  sub: string; // Google user ID
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
export async function findOrCreateUser(googleUser: GoogleUserInfo): Promise<User> {
  console.log('🔑 Finding or creating user:', googleUser.email);

  try {
    // Check if user exists by Google ID
    let [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleUser.sub))
      .limit(1);

    if (existingUser) {
      console.log('🔄 Updating existing user:', googleUser.email);
      // Update existing user's last login, email and photo if changed
      const [updatedUser] = await db
        .update(users)
        .set({
          lastLoginAt: new Date(),
          email: googleUser.email,
          displayName: googleUser.name || existingUser.displayName,
          avatarUrl: googleUser.picture || existingUser.avatarUrl,
          emailVerified: googleUser.email_verified,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      console.log('✅ User updated:', updatedUser.email);
      return updatedUser;
    }

    // Check if user exists by email (maybe registered differently)
    [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email))
      .limit(1);

    if (existingUser) {
      console.log('🔗 Linking Google account to existing user:', googleUser.email);
      // Link Google account to existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          googleId: googleUser.sub,
          emailVerified: googleUser.email_verified,
          lastLoginAt: new Date(),
          displayName: googleUser.name || existingUser.displayName,
          avatarUrl: googleUser.picture || existingUser.avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      console.log('✅ Google account linked for:', updatedUser.email);
      return updatedUser;
    }

    console.log('➕ Creating new user:', googleUser.email);
    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email: googleUser.email,
        googleId: googleUser.sub,
        displayName: googleUser.name,
        avatarUrl: googleUser.picture,
        emailVerified: googleUser.email_verified,
        lastLoginAt: new Date(),
      })
      .returning();

    console.log('✅ New user created:', newUser.email);
    return newUser;
  } catch (error) {
    console.error('❌ Error in findOrCreateUser:', error);
    throw error;
  }
}

/**
 * Get user by ID (UUID)
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return null;
  }
}

/**
 * Get user by Google ID
 */
export async function getUserByGoogleId(googleId: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('❌ Error getting user by Google ID:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    displayName: string;
    avatarUrl: string;
    emailVerified: boolean;
  }>
) {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return null;
  }
}
