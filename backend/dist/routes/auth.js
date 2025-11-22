// Authentication Routes
// Google OAuth with Passport.js (replacing Mocha)
// October 2025
import { Hono } from 'hono';
import passport from '../auth/passport.js';
const auth = new Hono();
// Initiate Google OAuth flow
auth.get('/google', (c) => {
    const req = c.req.raw;
    const res = c.res;
    return new Promise((resolve) => {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, () => {
            resolve();
        });
    });
});
// Google OAuth callback
auth.get('/google/callback', (c) => {
    const req = c.req.raw;
    const res = c.res;
    return new Promise((resolve) => {
        passport.authenticate('google', {
            failureRedirect: '/auth/failure',
            successRedirect: '/',
        })(req, res, () => {
            resolve();
        });
    });
});
// Auth failure page
auth.get('/failure', (c) => {
    return c.json({
        success: false,
        error: 'Authentication failed. Please try again.',
    }, 401);
});
// Get current user
auth.get('/me', (c) => {
    const req = c.req.raw;
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return c.json({ success: false, error: 'Not authenticated' }, 401);
    }
    return c.json({
        success: true,
        data: {
            id: req.user.id,
            email: req.user.email,
            displayName: req.user.displayName,
            avatarUrl: req.user.avatarUrl,
            emailVerified: req.user.emailVerified,
            createdAt: req.user.createdAt,
        },
    });
});
// Logout
auth.post('/logout', (c) => {
    const req = c.req.raw;
    return new Promise((resolve) => {
        req.logout((err) => {
            if (err) {
                console.error('❌ Logout error:', err);
                return resolve(c.json({ success: false, error: 'Logout failed' }, 500));
            }
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    console.error('❌ Session destroy error:', destroyErr);
                }
                return resolve(c.json({ success: true, message: 'Logged out successfully' }));
            });
        });
    });
});
export default auth;
//# sourceMappingURL=auth.js.map