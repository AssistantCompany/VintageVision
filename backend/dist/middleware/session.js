// Session Middleware Configuration
// October 2025 - Express Session + PostgreSQL Store
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import { env } from '../config/env.js';
const { Pool } = pg;
const PgSession = connectPgSimple(session);
// Separate connection pool for sessions
const sessionPool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
});
// Session store configuration
const sessionStore = new PgSession({
    pool: sessionPool,
    tableName: 'sessions',
    createTableIfMissing: false, // We created it in schema
    pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
});
// Session middleware
export const sessionMiddleware = session({
    store: sessionStore,
    secret: env.SESSION_SECRET,
    name: 'vintagevision.sid', // Custom session cookie name
    resave: false,
    saveUninitialized: false,
    rolling: true, // Refresh session on each request
    cookie: {
        secure: env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevent XSS attacks
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: env.NODE_ENV === 'production' ? 'lax' : 'lax',
        path: '/',
    },
});
// Graceful shutdown
export async function closeSessionStore() {
    try {
        await sessionPool.end();
        console.log('✅ Session store connection pool closed');
    }
    catch (error) {
        console.error('❌ Error closing session pool:', error);
    }
}
console.log('✅ Session middleware configured with PostgreSQL store');
//# sourceMappingURL=session.js.map