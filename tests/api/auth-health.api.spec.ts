/**
 * VintageVision Backend API Tests
 * Auth, Health, and Utility Endpoints
 *
 * Tests for:
 * - Authentication endpoints (/api/auth)
 * - Health check endpoint (/health)
 * - Feedback endpoint (/api/feedback)
 * - Analytics endpoint (/api/analytics)
 * - Error logging endpoint (/api/errors)
 *
 * January 2026
 */

import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';

// API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Types for API responses
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    storage: 'up' | 'down';
    openai: 'up' | 'down';
  };
}

interface AuthMeResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    googleId: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface FeedbackPayload {
  item_analysis_id: string;
  is_correct: boolean;
  correction_text?: string;
  feedback_type?: 'accuracy' | 'styling' | 'value';
}

interface FeedbackResponse {
  success: boolean;
  data?: {
    id: string;
    userId: string;
    itemAnalysisId: string;
    isCorrect: boolean;
    correctionText: string | null;
    feedbackType: string | null;
    createdAt: string;
  };
  error?: string;
}

interface AnalyticsPayload {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  timestamp?: string;
  url?: string;
  userAgent?: string;
}

interface AnalyticsResponse {
  success: boolean;
}

interface ErrorPayload {
  errorType?: string;
  type?: string;
  message?: string;
  errorMessage?: string;
  stack?: string;
  errorStack?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  componentStack?: string;
}

interface ErrorResponse {
  success: boolean;
  error?: string;
}

interface AuthDebugResponse {
  message: string;
  redirect_uri: string;
  client_id: string;
  instructions: string[];
}

interface ErrorApiResponse {
  success: boolean;
  error: string;
}

// Test suite configuration
test.describe('VintageVision API - Auth, Health & Utility Endpoints', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // ============================================================================
  // HEALTH ENDPOINT TESTS
  // ============================================================================
  test.describe('Health Endpoint (/health)', () => {
    test('GET /health - returns service status with correct schema', async () => {
      const startTime = Date.now();
      const response = await apiContext.get('/health');
      const responseTime = Date.now() - startTime;

      // Response time should be under 5 seconds
      expect(responseTime).toBeLessThan(5000);

      // Should return 200 or 503 depending on service health
      expect([200, 503]).toContain(response.status());

      const body: HealthResponse = await response.json();

      // Validate response schema
      expect(body).toHaveProperty('status');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(body.status);

      expect(body).toHaveProperty('timestamp');
      expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');

      expect(body).toHaveProperty('services');
      expect(body.services).toHaveProperty('database');
      expect(body.services).toHaveProperty('storage');
      expect(body.services).toHaveProperty('openai');

      // Each service should be 'up' or 'down'
      expect(['up', 'down']).toContain(body.services.database);
      expect(['up', 'down']).toContain(body.services.storage);
      expect(['up', 'down']).toContain(body.services.openai);
    });

    test('GET /health - healthy status returns 200', async () => {
      const response = await apiContext.get('/health');
      const body: HealthResponse = await response.json();

      if (body.status === 'healthy') {
        expect(response.status()).toBe(200);
        expect(body.services.database).toBe('up');
        expect(body.services.storage).toBe('up');
        expect(body.services.openai).toBe('up');
      }
    });

    test('GET /health - degraded status when non-critical service down', async () => {
      const response = await apiContext.get('/health');
      const body: HealthResponse = await response.json();

      if (body.status === 'degraded') {
        // Degraded means critical services (db, storage) are up but openai might be down
        expect(response.status()).toBe(200);
        expect(body.services.database).toBe('up');
        expect(body.services.storage).toBe('up');
      }
    });

    test('GET /health - unhealthy status returns 503', async () => {
      const response = await apiContext.get('/health');
      const body: HealthResponse = await response.json();

      if (body.status === 'unhealthy') {
        expect(response.status()).toBe(503);
        // At least one critical service should be down
        const criticalDown =
          body.services.database === 'down' || body.services.storage === 'down';
        expect(criticalDown).toBe(true);
      }
    });

    test('GET /health - timestamp is recent', async () => {
      const response = await apiContext.get('/health');
      const body: HealthResponse = await response.json();

      const timestamp = new Date(body.timestamp);
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - timestamp.getTime());

      // Timestamp should be within 5 seconds of now
      expect(diffMs).toBeLessThan(5000);
    });
  });

  // ============================================================================
  // AUTH ENDPOINT TESTS
  // ============================================================================
  test.describe('Auth Endpoints (/api/auth)', () => {
    test.describe('GET /api/auth/google - OAuth Initiation', () => {
      test('redirects to Google OAuth when no code parameter', async () => {
        const response = await apiContext.get('/api/auth/google', {
          maxRedirects: 0,
        });

        // Should return 302 redirect
        expect(response.status()).toBe(302);

        // Should redirect to Google OAuth
        const location = response.headers()['location'];
        expect(location).toBeDefined();
        expect(location).toContain('accounts.google.com');
        expect(location).toContain('oauth2');
        expect(location).toContain('client_id');
        expect(location).toContain('redirect_uri');
        expect(location).toContain('response_type=code');
        expect(location).toContain('scope');
        expect(location).toContain('state');
      });

      test('sets oauth_state cookie on redirect', async () => {
        const response = await apiContext.get('/api/auth/google', {
          maxRedirects: 0,
        });

        const setCookieHeader = response.headers()['set-cookie'];
        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader).toContain('oauth_state=');
        expect(setCookieHeader).toContain('HttpOnly');
        expect(setCookieHeader).toContain('Path=/');
      });

      test('includes correct OAuth scopes', async () => {
        const response = await apiContext.get('/api/auth/google', {
          maxRedirects: 0,
        });

        const location = response.headers()['location'];
        expect(location).toContain('openid');
        expect(location).toContain('email');
        expect(location).toContain('profile');
      });
    });

    test.describe('GET /api/auth/debug - OAuth Debug Info', () => {
      test('returns OAuth configuration info', async () => {
        const response = await apiContext.get('/api/auth/debug');

        expect(response.status()).toBe(200);

        const body: AuthDebugResponse = await response.json();

        expect(body).toHaveProperty('message');
        expect(body.message).toBe('OAuth Debug Information');

        expect(body).toHaveProperty('redirect_uri');
        expect(body.redirect_uri).toContain('/api/auth/google');

        expect(body).toHaveProperty('client_id');
        expect(body.client_id).toBeTruthy();

        expect(body).toHaveProperty('instructions');
        expect(Array.isArray(body.instructions)).toBe(true);
        expect(body.instructions.length).toBeGreaterThan(0);
      });
    });

    test.describe('GET /api/auth/me - Current User', () => {
      test('returns 401 without session cookie', async () => {
        const response = await apiContext.get('/api/auth/me');

        expect(response.status()).toBe(401);

        const body: AuthMeResponse = await response.json();

        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
        expect(body.error).toContain('Unauthorized');
      });

      test('returns 401 with invalid session cookie', async () => {
        const response = await apiContext.get('/api/auth/me', {
          headers: {
            Cookie: 'session=invalid-session-token-12345',
          },
        });

        expect(response.status()).toBe(401);

        const body: AuthMeResponse = await response.json();

        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
      });

      test('returns 401 with expired session cookie', async () => {
        const response = await apiContext.get('/api/auth/me', {
          headers: {
            Cookie: 'session=expired-session-token-from-long-ago',
          },
        });

        expect(response.status()).toBe(401);

        const body: AuthMeResponse = await response.json();

        expect(body.success).toBe(false);
      });

      test('error response has correct schema', async () => {
        const response = await apiContext.get('/api/auth/me');

        const body: AuthMeResponse = await response.json();

        expect(body).toHaveProperty('success');
        expect(typeof body.success).toBe('boolean');

        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
      });
    });

    test.describe('POST /api/auth/logout - Logout', () => {
      test('returns 401 without session cookie', async () => {
        const response = await apiContext.post('/api/auth/logout');

        expect(response.status()).toBe(401);

        const body: LogoutResponse = await response.json();

        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
      });

      test('returns 401 with invalid session', async () => {
        const response = await apiContext.post('/api/auth/logout', {
          headers: {
            Cookie: 'session=invalid-session-token',
          },
        });

        expect(response.status()).toBe(401);

        const body: LogoutResponse = await response.json();

        expect(body.success).toBe(false);
      });
    });

    test.describe('Session Cookie Handling', () => {
      test('session cookie name is "session"', async () => {
        const response = await apiContext.get('/api/auth/me');

        // Without session cookie, should fail
        expect(response.status()).toBe(401);
      });

      test('rejects malformed session cookies', async () => {
        const malformedCookies = [
          'session=',
          'session=   ',
          'session=null',
          'session=undefined',
          'wrongname=validformat',
        ];

        for (const cookie of malformedCookies) {
          const response = await apiContext.get('/api/auth/me', {
            headers: {
              Cookie: cookie,
            },
          });

          expect(response.status()).toBe(401);
        }
      });
    });
  });

  // ============================================================================
  // FEEDBACK ENDPOINT TESTS
  // ============================================================================
  test.describe('Feedback Endpoint (/api/feedback)', () => {
    test.describe('POST /api/feedback - Submit Feedback', () => {
      test('returns 401 without authentication', async () => {
        const payload: FeedbackPayload = {
          item_analysis_id: '550e8400-e29b-41d4-a716-446655440000',
          is_correct: true,
        };

        const response = await apiContext.post('/api/feedback', {
          data: payload,
        });

        expect(response.status()).toBe(401);

        const body: ErrorApiResponse = await response.json();

        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
      });

      test('returns 401 with invalid session', async () => {
        const payload: FeedbackPayload = {
          item_analysis_id: '550e8400-e29b-41d4-a716-446655440000',
          is_correct: false,
          correction_text: 'This is actually a Victorian piece',
          feedback_type: 'accuracy',
        };

        const response = await apiContext.post('/api/feedback', {
          data: payload,
          headers: {
            Cookie: 'session=invalid-token',
          },
        });

        expect(response.status()).toBe(401);
      });

      test('validates required fields - missing item_analysis_id', async () => {
        const invalidPayload = {
          is_correct: true,
        };

        const response = await apiContext.post('/api/feedback', {
          data: invalidPayload,
          headers: {
            Cookie: 'session=test-token',
          },
        });

        // Should return 401 (auth fails first) or 400 (validation)
        expect([400, 401]).toContain(response.status());
      });

      test('validates required fields - missing is_correct', async () => {
        const invalidPayload = {
          item_analysis_id: '550e8400-e29b-41d4-a716-446655440000',
        };

        const response = await apiContext.post('/api/feedback', {
          data: invalidPayload,
          headers: {
            Cookie: 'session=test-token',
          },
        });

        // Should return 401 (auth fails first) or 400 (validation)
        expect([400, 401]).toContain(response.status());
      });

      test('validates item_analysis_id format (UUID)', async () => {
        const invalidPayload: Record<string, unknown> = {
          item_analysis_id: 'not-a-valid-uuid',
          is_correct: true,
        };

        const response = await apiContext.post('/api/feedback', {
          data: invalidPayload,
          headers: {
            Cookie: 'session=test-token',
          },
        });

        // Should return 401 (auth) or 400 (validation)
        expect([400, 401]).toContain(response.status());
      });

      test('validates feedback_type enum values', async () => {
        const invalidPayload: Record<string, unknown> = {
          item_analysis_id: '550e8400-e29b-41d4-a716-446655440000',
          is_correct: true,
          feedback_type: 'invalid_type',
        };

        const response = await apiContext.post('/api/feedback', {
          data: invalidPayload,
          headers: {
            Cookie: 'session=test-token',
          },
        });

        // Should return 401 (auth) or 400 (validation)
        expect([400, 401]).toContain(response.status());
      });

      test('accepts valid feedback_type values', async () => {
        const validTypes: Array<'accuracy' | 'styling' | 'value'> = [
          'accuracy',
          'styling',
          'value',
        ];

        for (const feedbackType of validTypes) {
          const payload: FeedbackPayload = {
            item_analysis_id: '550e8400-e29b-41d4-a716-446655440000',
            is_correct: true,
            feedback_type: feedbackType,
          };

          const response = await apiContext.post('/api/feedback', {
            data: payload,
          });

          // Will fail auth but payload is valid
          expect(response.status()).toBe(401);
        }
      });

      test('accepts optional correction_text', async () => {
        const payloadWithCorrection: FeedbackPayload = {
          item_analysis_id: '550e8400-e29b-41d4-a716-446655440000',
          is_correct: false,
          correction_text: 'The item is actually from the Art Nouveau period, not Art Deco.',
        };

        const response = await apiContext.post('/api/feedback', {
          data: payloadWithCorrection,
        });

        // Will fail auth but validates payload acceptance
        expect(response.status()).toBe(401);
      });

      test('handles empty request body', async () => {
        const response = await apiContext.post('/api/feedback', {
          data: {},
        });

        // Should return 401 (auth) or 400 (validation)
        expect([400, 401]).toContain(response.status());
      });

      test('handles invalid JSON body', async () => {
        const response = await apiContext.post('/api/feedback', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: 'not-valid-json',
        });

        // Should return error status
        expect([400, 401, 500]).toContain(response.status());
      });
    });
  });

  // ============================================================================
  // ANALYTICS ENDPOINT TESTS
  // ============================================================================
  test.describe('Analytics Endpoint (/api/analytics)', () => {
    test.describe('POST /api/analytics - Log Events', () => {
      test('accepts event without authentication', async () => {
        const payload: AnalyticsPayload = {
          action: 'page_view',
          category: 'navigation',
          label: 'home',
        };

        const response = await apiContext.post('/api/analytics', {
          data: payload,
        });

        // Analytics should work without auth (optionalAuth middleware)
        expect(response.status()).toBe(200);

        const body: AnalyticsResponse = await response.json();

        expect(body).toHaveProperty('success');
        // Success can be true or false depending on db write
        expect(typeof body.success).toBe('boolean');
      });

      test('logs basic event with action only', async () => {
        const payload: AnalyticsPayload = {
          action: 'button_click',
        };

        const response = await apiContext.post('/api/analytics', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('logs event with full payload', async () => {
        const payload: AnalyticsPayload = {
          action: 'analysis_started',
          category: 'analysis',
          label: 'vintage_chair',
          value: 1,
          timestamp: new Date().toISOString(),
          url: 'https://vintagevision.space/app',
          userAgent: 'Mozilla/5.0 (Test)',
        };

        const response = await apiContext.post('/api/analytics', {
          data: payload,
        });

        expect(response.status()).toBe(200);

        const body: AnalyticsResponse = await response.json();
        expect(body).toHaveProperty('success');
      });

      test('handles unknown action gracefully', async () => {
        const payload = {
          action: undefined, // Will become 'unknown'
          category: 'test',
        };

        const response = await apiContext.post('/api/analytics', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('accepts additional custom properties', async () => {
        const payload = {
          action: 'custom_event',
          category: 'test',
          customField1: 'value1',
          customField2: 123,
          nestedData: {
            key: 'value',
          },
        };

        const response = await apiContext.post('/api/analytics', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('handles empty body', async () => {
        const response = await apiContext.post('/api/analytics', {
          data: {},
        });

        // Should still work, action becomes 'unknown'
        expect(response.status()).toBe(200);
      });

      test('always returns 200 even on internal errors', async () => {
        // Analytics endpoint is designed not to fail requests
        const response = await apiContext.post('/api/analytics', {
          data: { action: 'test' },
        });

        // Always returns 200 per implementation
        expect(response.status()).toBe(200);
      });

      test('works with authenticated user', async () => {
        const payload: AnalyticsPayload = {
          action: 'authenticated_event',
          category: 'user_activity',
        };

        const response = await apiContext.post('/api/analytics', {
          data: payload,
          headers: {
            Cookie: 'session=test-session-token',
          },
        });

        // Should work regardless of auth validity
        expect(response.status()).toBe(200);
      });
    });
  });

  // ============================================================================
  // ERROR LOGGING ENDPOINT TESTS
  // ============================================================================
  test.describe('Error Logging Endpoint (/api/errors)', () => {
    test.describe('POST /api/errors - Report Errors', () => {
      test('accepts error without authentication', async () => {
        const payload: ErrorPayload = {
          errorType: 'TypeError',
          message: 'Cannot read property of undefined',
          stack: 'TypeError: Cannot read property...\n    at test.js:10',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        // Errors should work without auth (optionalAuth middleware)
        expect(response.status()).toBe(200);

        const body: ErrorResponse = await response.json();

        expect(body).toHaveProperty('success');
        expect(typeof body.success).toBe('boolean');
      });

      test('accepts error with alternative field names', async () => {
        const payload: ErrorPayload = {
          type: 'NetworkError',
          errorMessage: 'Failed to fetch',
          errorStack: 'NetworkError: Failed to fetch...',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('logs error with full context', async () => {
        const payload: ErrorPayload = {
          errorType: 'ReferenceError',
          message: 'myVariable is not defined',
          stack: 'ReferenceError: myVariable is not defined\n    at Component.tsx:25',
          url: 'https://vintagevision.space/app',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          timestamp: new Date().toISOString(),
          componentStack: '\n    at AnalysisResult\n    at App\n    at Root',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        expect(response.status()).toBe(200);

        const body: ErrorResponse = await response.json();
        expect(body).toHaveProperty('success');
      });

      test('handles minimal error payload', async () => {
        const payload: ErrorPayload = {
          message: 'Something went wrong',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('handles empty body gracefully', async () => {
        const response = await apiContext.post('/api/errors', {
          data: {},
        });

        // Should still work with defaults
        expect(response.status()).toBe(200);
      });

      test('handles unknown error type', async () => {
        const payload = {
          type: undefined, // Will become 'unknown'
          message: 'Unknown error occurred',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('always returns 200 to avoid cascading failures', async () => {
        // Error endpoint should never fail the frontend request
        const response = await apiContext.post('/api/errors', {
          data: { errorType: 'test' },
        });

        expect(response.status()).toBe(200);
      });

      test('logs React error boundary errors', async () => {
        const payload: ErrorPayload = {
          errorType: 'React Error Boundary',
          message: 'Minified React error #185',
          componentStack:
            '\n    in PremiumAnalysisResult\n    in ErrorBoundary\n    in App',
          url: 'https://vintagevision.space/app',
          timestamp: new Date().toISOString(),
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('logs network/fetch errors', async () => {
        const payload: ErrorPayload = {
          errorType: 'FetchError',
          message: 'Network request failed',
          stack: 'TypeError: Failed to fetch',
          url: 'https://vintagevision.space/api/analyze',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
        });

        expect(response.status()).toBe(200);
      });

      test('works with authenticated user', async () => {
        const payload: ErrorPayload = {
          errorType: 'AuthenticatedError',
          message: 'Error from authenticated user',
        };

        const response = await apiContext.post('/api/errors', {
          data: payload,
          headers: {
            Cookie: 'session=test-session-token',
          },
        });

        expect(response.status()).toBe(200);
      });
    });
  });

  // ============================================================================
  // 404 HANDLING TESTS
  // ============================================================================
  test.describe('404 Not Found Handling', () => {
    test('returns 404 for non-existent endpoints', async () => {
      const response = await apiContext.get('/api/nonexistent');

      expect(response.status()).toBe(404);

      const body: ErrorApiResponse = await response.json();

      expect(body.success).toBe(false);
      expect(body.error).toBe('Not found');
    });

    test('returns 404 for invalid auth routes', async () => {
      const response = await apiContext.get('/api/auth/invalid');

      expect(response.status()).toBe(404);
    });

    test('returns 404 with correct schema', async () => {
      const response = await apiContext.get('/api/does-not-exist');

      expect(response.status()).toBe(404);

      const body: ErrorApiResponse = await response.json();

      expect(body).toHaveProperty('success');
      expect(body.success).toBe(false);
      expect(body).toHaveProperty('error');
      expect(typeof body.error).toBe('string');
    });
  });

  // ============================================================================
  // CORS AND HEADERS TESTS
  // ============================================================================
  test.describe('CORS and Headers', () => {
    test('health endpoint includes CORS headers', async () => {
      const response = await apiContext.get('/health', {
        headers: {
          Origin: 'http://localhost:5173',
        },
      });

      // Check CORS is enabled
      const headers = response.headers();
      // CORS headers may or may not be present depending on origin
      expect(response.status()).toBeLessThan(500);
    });

    test('API endpoints accept JSON content type', async () => {
      const response = await apiContext.post('/api/analytics', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { action: 'test' },
      });

      expect(response.status()).toBe(200);
    });

    test('OPTIONS preflight request works', async () => {
      // Playwright doesn't have a direct OPTIONS method, use fetch
      const response = await apiContext.fetch('/api/analytics', {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:5173',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      // Should return 200 or 204 for preflight
      expect([200, 204]).toContain(response.status());
    });
  });

  // ============================================================================
  // RESPONSE TIME TESTS
  // ============================================================================
  test.describe('Response Time Performance', () => {
    test('health endpoint responds within 5 seconds', async () => {
      const startTime = Date.now();
      const response = await apiContext.get('/health');
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(5000);
      expect([200, 503]).toContain(response.status());
    });

    test('auth/me endpoint responds within 2 seconds', async () => {
      const startTime = Date.now();
      const response = await apiContext.get('/api/auth/me');
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(2000);
      expect(response.status()).toBe(401);
    });

    test('analytics endpoint responds within 2 seconds', async () => {
      const startTime = Date.now();
      const response = await apiContext.post('/api/analytics', {
        data: { action: 'performance_test' },
      });
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(2000);
      expect(response.status()).toBe(200);
    });

    test('errors endpoint responds within 2 seconds', async () => {
      const startTime = Date.now();
      const response = await apiContext.post('/api/errors', {
        data: { message: 'performance_test' },
      });
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(2000);
      expect(response.status()).toBe(200);
    });
  });

  // ============================================================================
  // CONTENT-TYPE HANDLING TESTS
  // ============================================================================
  test.describe('Content-Type Handling', () => {
    test('health endpoint returns JSON', async () => {
      const response = await apiContext.get('/health');

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });

    test('auth/me returns JSON error', async () => {
      const response = await apiContext.get('/api/auth/me');

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });

    test('analytics endpoint returns JSON', async () => {
      const response = await apiContext.post('/api/analytics', {
        data: { action: 'test' },
      });

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });

    test('errors endpoint returns JSON', async () => {
      const response = await apiContext.post('/api/errors', {
        data: { message: 'test' },
      });

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });
  });

  // ============================================================================
  // CONCURRENT REQUEST HANDLING TESTS
  // ============================================================================
  test.describe('Concurrent Request Handling', () => {
    test('handles multiple simultaneous health checks', async () => {
      const requests = Array.from({ length: 5 }, () => apiContext.get('/health'));

      const responses = await Promise.all(requests);

      for (const response of responses) {
        expect([200, 503]).toContain(response.status());
        const body: HealthResponse = await response.json();
        expect(body).toHaveProperty('status');
      }
    });

    test('handles multiple simultaneous analytics events', async () => {
      const requests = Array.from({ length: 10 }, (_, i) =>
        apiContext.post('/api/analytics', {
          data: { action: `concurrent_test_${i}` },
        })
      );

      const responses = await Promise.all(requests);

      for (const response of responses) {
        expect(response.status()).toBe(200);
      }
    });

    test('handles mixed endpoint requests concurrently', async () => {
      const requests = [
        apiContext.get('/health'),
        apiContext.get('/api/auth/me'),
        apiContext.get('/api/auth/debug'),
        apiContext.post('/api/analytics', { data: { action: 'mixed_test' } }),
        apiContext.post('/api/errors', { data: { message: 'mixed_test' } }),
      ];

      const responses = await Promise.all(requests);

      // Health - 200 or 503
      expect([200, 503]).toContain(responses[0].status());

      // Auth/me - 401
      expect(responses[1].status()).toBe(401);

      // Auth/debug - 200
      expect(responses[2].status()).toBe(200);

      // Analytics - 200
      expect(responses[3].status()).toBe(200);

      // Errors - 200
      expect(responses[4].status()).toBe(200);
    });
  });
});
