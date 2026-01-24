/**
 * Sentry Error Monitoring Configuration
 * VintageVision Frontend
 *
 * Initializes Sentry for error tracking and performance monitoring.
 * Only active in production with a configured DSN.
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry error monitoring
 *
 * - Only sends errors in production
 * - Performance tracing at 10% sample rate
 * - Filters out PII (no email, passwords, etc.)
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const isProduction = import.meta.env.PROD;

  // Skip initialization if no DSN configured
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.log('[Sentry] No DSN configured, skipping initialization');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    enabled: isProduction,

    // Performance Monitoring - 10% sample rate in production
    tracesSampleRate: isProduction ? 0.1 : 1.0,

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration({
        // Track navigation and page loads
        enableInp: true,
      }),
      Sentry.replayIntegration({
        // Session replay for debugging - only on errors
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Session Replay - capture 10% of sessions, 100% on error
    replaysSessionSampleRate: isProduction ? 0.1 : 0,
    replaysOnErrorSampleRate: isProduction ? 1.0 : 0,

    // Filter sensitive data
    beforeSend(event) {
      // Remove any potentially sensitive request data
      if (event.request) {
        // Remove cookies from request
        delete event.request.cookies;

        // Remove authorization headers
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['Authorization'];
          delete event.request.headers['cookie'];
          delete event.request.headers['Cookie'];
        }
      }

      // Remove email from user context if present
      if (event.user) {
        delete event.user.email;
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.teletrax.co',
      'atomicFindClose',
      // Network errors that are expected
      'Network request failed',
      'Failed to fetch',
      'NetworkError',
      'AbortError',
      // User cancelled actions
      'ResizeObserver loop',
    ],

    // Deny URLs from third-party scripts
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      // Firefox extensions
      /^moz-extension:\/\//i,
      // Safari extensions
      /^safari-extension:\/\//i,
    ],
  });

  if (import.meta.env.DEV) {
    console.log('[Sentry] Initialized in development mode (errors not sent)');
  }
}

/**
 * Set user context for Sentry
 * Call this after user authentication
 */
export function setSentryUser(userId: string, username?: string): void {
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
  Sentry.setUser(null);
}

/**
 * Capture a custom error with additional context
 */
export function captureError(error: Error, context?: Record<string, unknown>): void {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureException(error);
  });
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
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

// Re-export Sentry for direct access if needed
export { Sentry };
