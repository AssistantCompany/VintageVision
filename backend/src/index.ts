/**
 * VintageVision API Server
 * Self-Hosted on ScaledMinds_07
 * January 2026 - Manual OAuth 2.0 Implementation (bulletproof)
 */

// Initialize Sentry FIRST before any other imports
import { initSentry, sentryMiddleware, flushSentry, reportErrorToSentry } from './services/sentry.js';
initSentry();

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { compress } from 'hono/compress';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import crypto from 'crypto';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { checkDatabaseHealth, closeDatabaseConnection } from './db/client.js';
import { checkStorageHealth, initializeBucket } from './storage/client.js';
import { checkOpenAIHealth } from './services/openai.js';
import { errorHandler } from './middleware/error.js';
import { requireAuth, requireCurrentUser } from './middleware/auth.js';
import { initializeSessionStore, createSession, deleteSession } from './services/session.js';
import { findOrCreateUser, type GoogleUserInfo } from './services/auth.js';

// ============================================================================
// MANUAL OAUTH 2.0 CONFIGURATION - Full control for debugging
// ============================================================================
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

// THE redirect_uri - this MUST exactly match what's in Google Console
// Using same route for both initiate and callback (no /callback suffix)
const OAUTH_REDIRECT_URI = `${env.FRONTEND_URL}/api/auth/google`;

// Log debug status
if (logger.isDebug) {
  console.log('🐛 DEBUG MODE ENABLED - Verbose logging active');
}
console.log(`📊 Log level: ${logger.level}`);

console.log('🔐 OAuth Configuration:');
console.log(`   Client ID: ${env.GOOGLE_CLIENT_ID.substring(0, 20)}...`);
console.log(`   Redirect URI: ${OAUTH_REDIRECT_URI}`);

// Import routes
import analyzeRoutes from './routes/analyze.js';
import collectionRoutes from './routes/collection.js';
import wishlistRoutes from './routes/wishlist.js';
import preferencesRoutes from './routes/preferences.js';
import feedbackRoutes from './routes/feedback.js';
import analyticsRoutes from './routes/analytics.js';
import errorRoutes from './routes/errors.js';
import imageRoutes from './routes/images.js';
import testingRoutes from './routes/testing.js';
import stripeRoutes from './routes/stripe.js';

// Create Hono app
const app = new Hono();

// Sentry request tracking middleware (must be early in the chain)
app.use('*', sentryMiddleware());

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
// AUTHENTICATION ROUTES - Manual OAuth 2.0 (Bulletproof Implementation)
// ============================================================================

/**
 * Debug endpoint - shows exactly what redirect_uri we're using
 * Visit /api/auth/debug to see the configuration
 */
app.get('/api/auth/debug', (c) => {
  return c.json({
    message: 'OAuth Debug Information',
    redirect_uri: OAUTH_REDIRECT_URI,
    client_id: env.GOOGLE_CLIENT_ID,
    instructions: [
      'The redirect_uri above MUST be added to Google Cloud Console',
      'Go to: console.cloud.google.com > APIs & Services > Credentials',
      'Find your OAuth 2.0 Client ID and click Edit',
      'Add the redirect_uri to "Authorized redirect URIs"',
      'Wait 5 minutes for changes to propagate',
    ],
  });
});

/**
 * Google OAuth - Single route handles both initiation and callback
 * If no 'code' param: redirect to Google
 * If 'code' param present: handle callback
 */
app.get('/api/auth/google', async (c) => {
  const code = c.req.query('code');

  // If no code, this is the initiation - redirect to Google
  if (!code) {
    // Generate random state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Build the authorization URL manually
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: OAUTH_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state: state,
      access_type: 'offline',
      prompt: 'consent',
    });

    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;

    console.log('🔐 OAuth Initiation:');
    console.log(`   Redirect URI: ${OAUTH_REDIRECT_URI}`);
    console.log(`   State: ${state.substring(0, 16)}...`);
    console.log(`   Full Auth URL: ${authUrl.substring(0, 100)}...`);

    // Store state in cookie for verification
    setCookie(c, 'oauth_state', state, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 600, // 10 minutes
    });

    return c.redirect(authUrl, 302);
  }

  // Code is present - this is the callback from Google
  try {
    const state = c.req.query('state');
    const error = c.req.query('error');
    const errorDescription = c.req.query('error_description');

    console.log('🔐 OAuth Callback received:');
    console.log(`   Code: present`);
    console.log(`   State: ${state ? state.substring(0, 16) + '...' : 'missing'}`);
    console.log(`   Error: ${error || 'none'}`);

    // Check for errors from Google
    if (error) {
      console.error(`❌ Google OAuth error: ${error} - ${errorDescription}`);
      return c.redirect(`${env.FRONTEND_URL}?auth=error&reason=${encodeURIComponent(error)}`, 302);
    }

    // Verify state matches
    const savedState = getCookie(c, 'oauth_state');
    if (!savedState || savedState !== state) {
      console.error('❌ State mismatch - possible CSRF attack');
      console.error(`   Saved: ${savedState?.substring(0, 16)}...`);
      console.error(`   Received: ${state?.substring(0, 16)}...`);
      return c.redirect(`${env.FRONTEND_URL}?auth=error&reason=state_mismatch`, 302);
    }

    // Clear the state cookie
    deleteCookie(c, 'oauth_state', { path: '/' });

    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...');
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: OAUTH_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token exchange failed:', errorText);
      return c.redirect(`${env.FRONTEND_URL}?auth=error&reason=token_exchange`, 302);
    }

    const tokens = await tokenResponse.json() as { access_token: string; id_token?: string };
    console.log('✅ Tokens received');

    // Get user info from Google
    console.log('🔄 Fetching user info...');
    const userResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('❌ User info fetch failed:', errorText);
      return c.redirect(`${env.FRONTEND_URL}?auth=error&reason=userinfo`, 302);
    }

    const googleUser = await userResponse.json() as GoogleUserInfo;
    console.log('✅ Google OAuth successful:', googleUser.email);

    // Find or create user in our database
    const user = await findOrCreateUser(googleUser);

    // Create session
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
    console.error('❌ OAuth callback error:', error);
    return c.redirect(`${env.FRONTEND_URL}?auth=error&reason=server_error`, 302);
  }
});

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
app.route('/api/testing', testingRoutes);
app.route('/api', stripeRoutes);

// Image serving route - must be registered directly to handle wildcard paths
app.get('/api/images/*', async (c) => {
  try {
    // Get the full path after /api/images/
    const fullPath = c.req.path;
    const pathAfterImages = fullPath.replace('/api/images/', '');

    if (!pathAfterImages) {
      return c.json({ success: false, error: 'Image path required' }, 400);
    }

    // Storage keys include 'images/' prefix, so add it back
    const storageKey = `images/${pathAfterImages}`;
    console.log(`📸 Serving image: ${storageKey}`);

    // Fetch image from MinIO
    const { getImage } = await import('./storage/client.js');
    const { stream } = await import('hono/streaming');
    const { body, contentType } = await getImage(storageKey);

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
  // Report error to Sentry before handling
  reportErrorToSentry(err, c);
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
    // Flush Sentry events before shutdown
    await flushSentry(2000);

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
      console.log(`║  🤖 AI:         OpenAI GPT-5.2 Pro               ║`);
      console.log('║                                                   ║');
      console.log('╚═══════════════════════════════════════════════════╝');
      console.log('');
      console.log('✅ Ready to accept requests!');
      console.log('');
    }
  );
}

export { app, start };

// Only start if run directly
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  start().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
}
