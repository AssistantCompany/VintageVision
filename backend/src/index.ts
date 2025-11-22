/**
 * VintageVision API Server
 * Self-Hosted on ScaledMinds_07
 * November 2025 - Native Hono OAuth Implementation
 */

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { compress } from 'hono/compress';
import { setCookie, deleteCookie } from 'hono/cookie';
import { googleAuth } from '@hono/oauth-providers/google';
import { env } from './config/env.js';
import { checkDatabaseHealth, closeDatabaseConnection } from './db/client.js';
import { checkStorageHealth, initializeBucket } from './storage/client.js';
import { checkOpenAIHealth } from './services/openai.js';
import { errorHandler } from './middleware/error.js';
import { requireAuth, requireCurrentUser } from './middleware/auth.js';
import { initializeSessionStore, createSession, deleteSession } from './services/session.js';
import { findOrCreateUser, type GoogleUserInfo } from './services/auth.js';

// Import routes
import analyzeRoutes from './routes/analyze.js';
import collectionRoutes from './routes/collection.js';
import wishlistRoutes from './routes/wishlist.js';
import preferencesRoutes from './routes/preferences.js';
import feedbackRoutes from './routes/feedback.js';
import analyticsRoutes from './routes/analytics.js';
import errorRoutes from './routes/errors.js';
import imageRoutes from './routes/images.js';

// Create Hono app
const app = new Hono();

// Logging middleware
app.use('*', honoLogger());

// Compression
app.use('*', compress());

// CORS configuration
app.use('*', cors({
  origin: [env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Set-Cookie'],
  maxAge: 86400,
}));

// Health check endpoint
app.get('/health', async (c) => {
  const dbHealthy = await checkDatabaseHealth();
  const storageHealthy = await checkStorageHealth();
  const openaiHealthy = await checkOpenAIHealth();

  // Only fail health check if critical services (DB or storage) are down
  const criticalServicesHealthy = dbHealthy && storageHealthy;
  const allHealthy = criticalServicesHealthy && openaiHealthy;

  return c.json(
    {
      status: allHealthy ? 'healthy' : criticalServicesHealthy ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
        storage: storageHealthy ? 'up' : 'down',
        openai: openaiHealthy ? 'up' : 'down',
      },
    },
    criticalServicesHealthy ? 200 : 503
  );
});

// ============================================================================
// AUTHENTICATION ROUTES - Native Hono OAuth
// ============================================================================

/**
 * Google OAuth Route
 * Handles both OAuth initiation and callback
 */
app.get(
  '/api/auth/google',
  googleAuth({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${env.FRONTEND_URL}/api/auth/google`, // Explicit redirect URI for nginx proxy
    scope: ['openid', 'email', 'profile'],
  }),
  async (c) => {
    try {
      // Get user info from Google
      const googleUser = c.get('user-google') as GoogleUserInfo;

      if (!googleUser) {
        console.error('❌ No user data returned from Google OAuth');
        return c.redirect(`${env.FRONTEND_URL}?auth=failed`, 302);
      }

      console.log('✅ Google OAuth successful:', googleUser.email);

      // Find or create user in our database
      const user = await findOrCreateUser(googleUser);

      // Create session (stores user.id, not googleId)
      const sessionToken = await createSession(user.id);

      console.log('✅ Session created for user:', user.email);

      // Set session cookie
      setCookie(c, 'session', sessionToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 24 * 60 * 60, // 60 days
      });

      console.log('🍪 Session cookie set, redirecting to frontend');

      // Redirect to frontend
      return c.redirect(env.FRONTEND_URL, 302);
    } catch (error) {
      console.error('❌ OAuth error:', error);
      return c.redirect(`${env.FRONTEND_URL}?auth=error`, 302);
    }
  }
);

/**
 * Get current authenticated user
 */
app.get('/api/auth/me', requireAuth, async (c) => {
  const user = requireCurrentUser(c);
  return c.json({
    success: true,
    data: user,
  });
});

/**
 * Logout - Delete session
 */
app.post('/api/auth/logout', requireAuth, async (c) => {
  const sessionToken = c.req.header('Cookie')?.match(/session=([^;]+)/)?.[1];

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  deleteCookie(c, 'session', {
    path: '/',
  });

  return c.json({ success: true, message: 'Logged out successfully' });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.route('/api/analyze', analyzeRoutes);
app.route('/api/collection', collectionRoutes);
app.route('/api/wishlist', wishlistRoutes);
app.route('/api/preferences', preferencesRoutes);
app.route('/api/feedback', feedbackRoutes);
app.route('/api/analytics', analyticsRoutes);
app.route('/api/errors', errorRoutes);

// Image serving route - must be registered directly to handle wildcard paths
app.get('/api/images/*', async (c) => {
  try {
    // Get the full path after /api/images/
    const fullPath = c.req.path;
    const path = fullPath.replace('/api/images/', '');

    if (!path) {
      return c.json({ success: false, error: 'Image path required' }, 400);
    }

    console.log(`📸 Serving image: ${path}`);

    // Fetch image from MinIO
    const { getImage } = await import('./storage/client.js');
    const { stream } = await import('hono/streaming');
    const { body, contentType } = await getImage(path);

    // Set headers
    c.header('Content-Type', contentType);
    c.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Stream the image body
    return stream(c, async (stream) => {
      // Convert body to buffer and write
      const chunks: Uint8Array[] = [];
      for await (const chunk of body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      await stream.write(buffer);
    });
  } catch (error: any) {
    console.error('❌ Error serving image:', error);

    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return c.json({ success: false, error: 'Image not found' }, 404);
    }

    return c.json({ success: false, error: 'Failed to load image' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: 'Not found' }, 404);
});

// Global error handler
app.onError((err, c) => {
  return errorHandler(err, c);
});

// Initialize services
async function initialize() {
  try {
    console.log('🚀 Initializing VintageVision API...');

    // Initialize Redis session store
    await initializeSessionStore();

    // Initialize MinIO bucket
    await initializeBucket();

    // Check database connection
    const dbHealthy = await checkDatabaseHealth();
    if (!dbHealthy) {
      throw new Error('Database health check failed');
    }

    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n⚠️  Received ${signal}, starting graceful shutdown...`);

  try {
    // Close database connection
    await closeDatabaseConnection();

    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Register shutdown handlers
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start server
async function start() {
  await initialize();

  const port = parseInt(env.PORT);

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════╗');
      console.log('║                                                   ║');
      console.log('║        🏺 VintageVision API Server               ║');
      console.log('║        Self-Hosted on ScaledMinds_07             ║');
      console.log('║                                                   ║');
      console.log('╠═══════════════════════════════════════════════════╣');
      console.log(`║  🌐 Server:     http://localhost:${info.port}           ║`);
      console.log(`║  📦 Mode:       ${env.NODE_ENV.padEnd(28)} ║`);
      console.log(`║  🔒 Auth:       Google OAuth (Native Hono)       ║`);
      console.log(`║  💾 Sessions:   Redis (60-day expiry)            ║`);
      console.log(`║  🗄️  Database:   PostgreSQL (Drizzle ORM)         ║`);
      console.log(`║  📁 Storage:    MinIO (S3-Compatible)            ║`);
      console.log(`║  🤖 AI:         OpenAI GPT-4o Vision             ║`);
      console.log('║                                                   ║');
      console.log('╚═══════════════════════════════════════════════════╝');
      console.log('');
      console.log('✅ Ready to accept requests!');
      console.log('');
    }
  );
}

start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
