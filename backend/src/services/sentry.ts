/**
 * Sentry Error Monitoring Configuration
 * VintageVision Backend
 *
 * Initializes Sentry for error tracking and performance monitoring.
 * Only active in production with a configured DSN.
 */

import * as Sentry from '@sentry/node';
import type { Context, Next } from 'hono';
import { env } from '../config/env.js';

// Track whether Sentry has been initialized
let isInitialized = false;

/**
 * Initialize Sentry error monitoring
 *
 * - Only sends errors in production
 * - Performance tracing at 10% sample rate
 * - Filters out PII (no email, passwords, etc.)
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  const isProduction = env.NODE_ENV === 'production';

  // Skip initialization if no DSN configured
  if (!dsn) {
    console.log('[Sentry] No DSN configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: env.NODE_ENV,
    enabled: isProduction,

    // Performance Monitoring - 10% sample rate in production
    tracesSampleRate: isProduction ? 0.1 : 1.0,

    // Profiling - sample 10% of transactions
    profilesSampleRate: isProduction ? 0.1 : 1.0,

    // Release tracking
    release: process.env.npm_package_version,

    // Filter sensitive data
    beforeSend(event) {
      // Remove any potentially sensitive data from extras
      if (event.extra) {
        // Remove any keys that might contain sensitive data
        const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'cookie', 'apikey'];
        for (const key of Object.keys(event.extra)) {
          if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
            delete event.extra[key];
          }
        }
      }

      // Remove email from user context if present
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }

      // Remove sensitive headers from request
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['Authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['Cookie'];
        delete event.request.headers['x-api-key'];
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Network errors that are expected
      'ECONNREFUSED',
      'ECONNRESET',
      'ETIMEDOUT',
      'EPIPE',
      // Cancelled requests
      'AbortError',
      // Authentication errors (user-caused)
      'Authentication required',
      'Invalid credentials',
    ],
  });

  isInitialized = true;
  console.log(`[Sentry] Initialized for ${env.NODE_ENV} environment`);
}

/**
 * Check if Sentry is initialized
 */
export function isSentryInitialized(): boolean {
  return isInitialized;
}

/**
 * Set user context for Sentry
 * Call this after user authentication
 */
export function setSentryUser(userId: string, username?: string): void {
  if (!isInitialized) return;

  Sentry.setUser({
    id: userId,
    username,
    // Note: We intentionally don't include email for privacy
  });
}

/**
 * Clear user context from Sentry
 * Call this on logout
 */
export function clearSentryUser(): void {
  if (!isInitialized) return;
  Sentry.setUser(null);
}

/**
 * Capture an exception with additional context
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>
): string | undefined {
  if (!isInitialized) {
    console.error('[Sentry] Not initialized, logging error locally:', error);
    return undefined;
  }

  return Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    return Sentry.captureException(error);
  });
}

/**
 * Capture a message with a severity level
 */
export function captureMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info'
): string | undefined {
  if (!isInitialized) return undefined;
  return Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, unknown>
): void {
  if (!isInitialized) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Hono middleware for Sentry request tracking
 * Adds request context and captures unhandled errors
 */
export function sentryMiddleware() {
  return async (c: Context, next: Next) => {
    if (!isInitialized) {
      return next();
    }

    // Add request context
    Sentry.setContext('request', {
      method: c.req.method,
      url: c.req.url,
      path: c.req.path,
      query: c.req.query(),
    });

    // Add user context if available
    const user = (c.req.raw as any).user;
    if (user?.id) {
      setSentryUser(user.id, user.name);
    }

    // Add breadcrumb for this request
    addBreadcrumb(`${c.req.method} ${c.req.path}`, 'http', 'info');

    try {
      await next();
    } catch (error) {
      // Let the error propagate - it will be caught by the error handler
      throw error;
    }
  };
}

/**
 * Sentry error handler for Hono
 * Use this in your global error handler to report errors to Sentry
 */
export function reportErrorToSentry(error: Error, c: Context): string | undefined {
  if (!isInitialized) return undefined;

  return captureException(error, {
    method: c.req.method,
    path: c.req.path,
    query: c.req.query(),
    // Don't include full headers as they may contain sensitive data
    userAgent: c.req.header('user-agent'),
  });
}

/**
 * Flush Sentry events (useful before shutdown)
 */
export async function flushSentry(timeout: number = 2000): Promise<boolean> {
  if (!isInitialized) return true;
  return Sentry.flush(timeout);
}

// Re-export Sentry for direct access if needed
export { Sentry };
