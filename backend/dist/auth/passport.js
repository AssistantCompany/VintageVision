// Passport.js Configuration - Google OAuth 2.0
// Replaces Mocha Users Service with self-hosted authentication
// October 2025
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../config/env.js';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
// Serialize user to session (store user ID only)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        console.error('❌ Error deserializing user:', error);
        done(error, null);
    }
});
// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const displayName = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;
        if (!email || !googleId) {
            return done(new Error('Missing required Google profile data'), undefined);
        }
        // Check if user exists by Google ID
        let [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.googleId, googleId))
            .limit(1);
        if (existingUser) {
            // Update last login time
            const [updatedUser] = await db
                .update(users)
                .set({
                lastLoginAt: new Date(),
                displayName: displayName || existingUser.displayName,
                avatarUrl: avatarUrl || existingUser.avatarUrl,
            })
                .where(eq(users.id, existingUser.id))
                .returning();
            console.log(`✅ User logged in: ${email}`);
            return done(null, updatedUser);
        }
        // Check if user exists by email (maybe registered differently)
        [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        if (existingUser) {
            // Link Google account to existing user
            const [updatedUser] = await db
                .update(users)
                .set({
                googleId,
                emailVerified: true,
                lastLoginAt: new Date(),
                displayName: displayName || existingUser.displayName,
                avatarUrl: avatarUrl || existingUser.avatarUrl,
            })
                .where(eq(users.id, existingUser.id))
                .returning();
            console.log(`✅ Google account linked for: ${email}`);
            return done(null, updatedUser);
        }
        // Create new user
        const [newUser] = await db
            .insert(users)
            .values({
            email,
            googleId,
            displayName,
            avatarUrl,
            emailVerified: true,
            lastLoginAt: new Date(),
        })
            .returning();
        console.log(`✅ New user created: ${email}`);
        return done(null, newUser);
    }
    catch (error) {
        console.error('❌ Error in Google OAuth callback:', error);
        return done(error, undefined);
    }
}));
export default passport;
console.log('✅ Passport.js configured with Google OAuth');
//# sourceMappingURL=passport.js.map