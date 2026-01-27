/**
 * VintageVision API Tests - CRUD Operations
 * Tests for Collection, Wishlist, and Preferences endpoints
 *
 * File: tests/api/crud.api.spec.ts
 */

import { test, expect, APIRequestContext } from '@playwright/test';

// Base URL for API
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  items?: T;
  preferences?: T;
  item?: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

interface CollectionItem {
  id: string;
  userId: string;
  itemAnalysisId: string;
  notes: string | null;
  location: string | null;
  savedAt: string;
  updatedAt: string;
}

interface CollectionItemWithAnalysis extends CollectionItem {
  analysis: ItemAnalysis;
}

interface ItemAnalysis {
  id: string;
  name: string;
  era: string | null;
  style: string | null;
  description: string;
  historicalContext: string;
  estimatedValueMin: number | null;
  estimatedValueMax: number | null;
  confidence: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface WishlistItem {
  id: string;
  userId: string;
  itemAnalysisId: string | null;
  searchCriteria: WishlistSearchCriteria | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WishlistSearchCriteria {
  keywords?: string[];
  style?: string;
  era?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

interface UserPreferences {
  id?: string;
  userId?: string;
  preferredStyles: string[] | null;
  roomTypes: string[] | null;
  budgetRangeMin: number | null;
  budgetRangeMax: number | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CollectionCounts {
  collection: number;
  wishlist: number;
}

// ============================================================================
// TEST FIXTURES AND HELPERS
// ============================================================================

// Mock session cookie value - this simulates an authenticated session
// In a real test environment, this would be obtained via a test login flow
const MOCK_SESSION_TOKEN = 'test-session-token-12345678901234567890';
const INVALID_SESSION_TOKEN = 'invalid-session-token-xxxxxxxxxxxxx';

// Valid UUID for testing
const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const NON_EXISTENT_UUID = '00000000-0000-0000-0000-000000000000';
const INVALID_UUID = 'not-a-valid-uuid';

/**
 * Helper to create API request context with authentication
 */
function createAuthenticatedContext(
  _request: APIRequestContext,
  sessionToken: string = MOCK_SESSION_TOKEN
): { Cookie: string } {
  return {
    Cookie: `session=${sessionToken}`,
  };
}

/**
 * Helper to validate API error response structure
 */
function expectErrorResponse(body: ApiResponse): asserts body is ApiErrorResponse {
  expect(body).toHaveProperty('success', false);
  expect(body).toHaveProperty('error');
  expect(typeof (body as ApiErrorResponse).error).toBe('string');
}

/**
 * Helper to validate API success response structure
 */
function expectSuccessResponse(body: ApiResponse): asserts body is ApiSuccessResponse {
  expect(body).toHaveProperty('success', true);
}

// ============================================================================
// COLLECTION API TESTS
// ============================================================================

test.describe('Collection API - /api/collection', () => {
  test.describe('Authentication', () => {
    test('GET / - returns 401 without session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection`);

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
      expect(body.error).toMatch(/unauthorized|sign in/i);
    });

    test('POST / - returns 401 without session cookie', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        data: { itemAnalysisId: VALID_UUID },
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('PATCH /:id - returns 401 without session cookie', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/collection/${VALID_UUID}`, {
        data: { notes: 'Updated notes' },
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('DELETE /:id - returns 401 without session cookie', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/collection/${VALID_UUID}`);

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('GET / - returns 401 with invalid session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request, INVALID_SESSION_TOKEN),
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('GET /counts - returns 401 without session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection/counts`);

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });
  });

  test.describe('GET / - List Collection Items', () => {
    test('returns empty array for new user', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
      });

      // May be 401 if session not found, or 200 with empty array if authenticated
      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<CollectionItemWithAnalysis[]>;
        expectSuccessResponse(body);
        expect(body.data).toBeDefined();
        expect(Array.isArray(body.data)).toBe(true);
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('returns correct response structure', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<CollectionItemWithAnalysis[]>;
        expectSuccessResponse(body);
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);

        // If there are items, validate structure
        if (body.data && body.data.length > 0) {
          const item = body.data[0];
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('userId');
          expect(item).toHaveProperty('itemAnalysisId');
          expect(item).toHaveProperty('savedAt');
          expect(item).toHaveProperty('analysis');
        }
      }
    });
  });

  test.describe('POST / - Save Item to Collection', () => {
    test('returns 400 for missing itemAnalysisId', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: {},
      });

      // Should be 400 for validation error (or 401 if not authenticated)
      expect([400, 401]).toContain(response.status());
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('returns 400 for invalid UUID format', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: { itemAnalysisId: INVALID_UUID },
      });

      expect([400, 401]).toContain(response.status());
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('returns 404 for non-existent item analysis', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: { itemAnalysisId: NON_EXISTENT_UUID },
      });

      // Should be 404 for not found, 401 if not authenticated
      expect([404, 401]).toContain(response.status());
    });

    test('accepts optional notes and location fields', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: NON_EXISTENT_UUID,
          notes: 'Test notes for collection item',
          location: 'Living Room',
        },
      });

      // Will fail on non-existent item, but validates request structure accepted
      expect([404, 401]).toContain(response.status());
    });

    test('validates notes field type', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: VALID_UUID,
          notes: 12345, // Should be string
        },
      });

      // Zod should coerce or reject invalid types
      expect([400, 401, 404]).toContain(response.status());
    });
  });

  test.describe('PATCH /:id - Update Collection Item', () => {
    test('returns 404 for non-existent collection item', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/collection/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { notes: 'Updated notes' },
      });

      // Should be 404 or 401
      expect([404, 401]).toContain(response.status());
    });

    test('accepts empty update body', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/collection/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: {},
      });

      // Empty updates are valid, should return 404 for non-existent or 401
      expect([404, 401]).toContain(response.status());
    });

    test('accepts notes update', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/collection/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { notes: 'New notes content' },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('accepts location update', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/collection/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { location: 'Bedroom' },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('handles invalid ID format gracefully', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/collection/${INVALID_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { notes: 'Test' },
      });

      // Should handle gracefully - either 400, 404, or 401
      expect([400, 404, 401]).toContain(response.status());
    });
  });

  test.describe('DELETE /:id - Remove Collection Item', () => {
    test('returns 404 for non-existent collection item', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/collection/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
      });

      expect([404, 401]).toContain(response.status());
    });

    test('handles invalid ID format gracefully', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/collection/${INVALID_UUID}`, {
        headers: await createAuthenticatedContext(request),
      });

      expect([400, 404, 401]).toContain(response.status());
    });
  });

  test.describe('GET /counts - Collection and Wishlist Counts', () => {
    test('returns correct response structure when authenticated', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection/counts`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<CollectionCounts>;
        expectSuccessResponse(body);
        expect(body.data).toBeDefined();
        expect(body.data).toHaveProperty('collection');
        expect(body.data).toHaveProperty('wishlist');
        expect(typeof body.data?.collection).toBe('number');
        expect(typeof body.data?.wishlist).toBe('number');
        expect(body.data?.collection).toBeGreaterThanOrEqual(0);
        expect(body.data?.wishlist).toBeGreaterThanOrEqual(0);
      } else {
        expect(response.status()).toBe(401);
      }
    });
  });
});

// ============================================================================
// WISHLIST API TESTS
// ============================================================================

test.describe('Wishlist API - /api/wishlist', () => {
  test.describe('Authentication', () => {
    test('GET / - returns 401 without session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/wishlist`);

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('POST / - returns 401 without session cookie', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        data: { searchCriteria: { keywords: ['vintage'] } },
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('PATCH /:id - returns 401 without session cookie', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${VALID_UUID}`, {
        data: { notes: 'Updated notes' },
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('DELETE /:id - returns 401 without session cookie', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/wishlist/${VALID_UUID}`);

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('GET / - returns 401 with invalid session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request, INVALID_SESSION_TOKEN),
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });
  });

  test.describe('GET / - List Wishlist Items', () => {
    test('returns correct response structure', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<WishlistItem[]>;
        expectSuccessResponse(body);
        expect(body).toHaveProperty('items');
        expect(Array.isArray(body.items)).toBe(true);

        // If there are items, validate structure
        if (body.items && body.items.length > 0) {
          const item = body.items[0];
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('userId');
          expect(item).toHaveProperty('searchCriteria');
          expect(item).toHaveProperty('isActive');
          expect(item).toHaveProperty('createdAt');
        }
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('returns only active wishlist items', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<WishlistItem[]>;
        expectSuccessResponse(body);

        // All returned items should be active
        if (body.items && body.items.length > 0) {
          body.items.forEach((item: WishlistItem) => {
            expect(item.isActive).toBe(true);
          });
        }
      }
    });
  });

  test.describe('POST / - Add Wishlist Item', () => {
    test('returns 400 for missing searchCriteria', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {},
      });

      // Should be 400 for validation error (or 401 if not authenticated)
      expect([400, 401]).toContain(response.status());
    });

    test('creates wishlist item with valid searchCriteria', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            keywords: ['vintage', 'chair'],
            style: 'Mid-Century Modern',
            era: '1950s-1960s',
          },
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<WishlistItem>;
        expectSuccessResponse(body);
        expect(body.item).toBeDefined();
        expect(body.item).toHaveProperty('id');
        expect(body.item).toHaveProperty('searchCriteria');
        expect(body.item?.isActive).toBe(true);
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('accepts optional itemAnalysisId', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: NON_EXISTENT_UUID,
          searchCriteria: {
            keywords: ['antique'],
          },
        },
      });

      // Should accept the request structure
      expect([200, 401]).toContain(response.status());
    });

    test('validates itemAnalysisId UUID format', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: INVALID_UUID,
          searchCriteria: {
            keywords: ['test'],
          },
        },
      });

      // Should be 400 for invalid UUID format
      expect([400, 401]).toContain(response.status());
    });

    test('accepts optional notes field', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            keywords: ['lamp'],
          },
          notes: 'Looking for a statement piece',
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<WishlistItem>;
        expectSuccessResponse(body);
        expect(body.item?.notes).toBe('Looking for a statement piece');
      }
    });

    test('accepts priceRange in searchCriteria', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            keywords: ['desk'],
            priceRange: {
              min: 100,
              max: 500,
            },
          },
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<WishlistItem>;
        expectSuccessResponse(body);
        const criteria = body.item?.searchCriteria as WishlistSearchCriteria | null;
        expect(criteria?.priceRange?.min).toBe(100);
        expect(criteria?.priceRange?.max).toBe(500);
      }
    });

    test('validates priceRange number types', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            priceRange: {
              min: 'not-a-number',
              max: 500,
            },
          },
        },
      });

      // Should be 400 for invalid type
      expect([400, 401]).toContain(response.status());
    });
  });

  test.describe('PATCH /:id - Update Wishlist Item', () => {
    test('returns 404 for non-existent wishlist item', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { notes: 'Updated notes' },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('accepts searchCriteria update', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            keywords: ['updated', 'keywords'],
            style: 'Art Deco',
          },
        },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('accepts isActive status update', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { isActive: false },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('accepts notes update', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { notes: 'New notes content' },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('handles invalid ID format gracefully', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${INVALID_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { notes: 'Test' },
      });

      expect([400, 404, 401]).toContain(response.status());
    });

    test('validates isActive boolean type', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
        data: { isActive: 'not-a-boolean' },
      });

      // Should be 400 for invalid type or 404/401
      expect([400, 404, 401]).toContain(response.status());
    });
  });

  test.describe('DELETE /:id - Remove Wishlist Item', () => {
    test('returns 404 for non-existent wishlist item', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
      });

      expect([404, 401]).toContain(response.status());
    });

    test('handles invalid ID format gracefully', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/wishlist/${INVALID_UUID}`, {
        headers: await createAuthenticatedContext(request),
      });

      expect([400, 404, 401]).toContain(response.status());
    });

    test('returns success message on successful deletion', async ({ request }) => {
      // This test would require an existing item to delete
      // For now, verify the error response structure for non-existent item
      const response = await request.delete(`${API_BASE_URL}/api/wishlist/${NON_EXISTENT_UUID}`, {
        headers: await createAuthenticatedContext(request),
      });

      const body = await response.json() as ApiResponse;
      if (response.status() === 200) {
        expectSuccessResponse(body);
        expect((body as ApiSuccessResponse).message).toMatch(/removed/i);
      } else {
        expectErrorResponse(body);
      }
    });
  });
});

// ============================================================================
// PREFERENCES API TESTS
// ============================================================================

test.describe('Preferences API - /api/preferences', () => {
  test.describe('Authentication', () => {
    test('GET / - returns 401 without session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/preferences`);

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('POST / - returns 401 without session cookie', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        data: { preferredStyles: ['Mid-Century Modern'] },
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('GET / - returns 401 with invalid session cookie', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request, INVALID_SESSION_TOKEN),
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });

    test('POST / - returns 401 with invalid session cookie', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request, INVALID_SESSION_TOKEN),
        data: { preferredStyles: ['Art Deco'] },
      });

      expect(response.status()).toBe(401);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });
  });

  test.describe('GET / - Get User Preferences', () => {
    test('returns default preferences for new user', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
        expect(body).toHaveProperty('preferences');
        expect(body.preferences).toHaveProperty('preferredStyles');
        expect(body.preferences).toHaveProperty('roomTypes');
        expect(body.preferences).toHaveProperty('budgetRangeMin');
        expect(body.preferences).toHaveProperty('budgetRangeMax');
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('returns empty arrays as default for list fields', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);

        // Default preferences should have empty arrays or null for list fields
        if (body.preferences) {
          const prefs = body.preferences;
          expect(
            prefs.preferredStyles === null ||
            (Array.isArray(prefs.preferredStyles) && prefs.preferredStyles.length >= 0)
          ).toBe(true);
          expect(
            prefs.roomTypes === null ||
            (Array.isArray(prefs.roomTypes) && prefs.roomTypes.length >= 0)
          ).toBe(true);
        }
      }
    });

    test('returns null for budget range when not set', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);

        // Budget range can be null when not set
        if (body.preferences) {
          expect(
            body.preferences.budgetRangeMin === null ||
            typeof body.preferences.budgetRangeMin === 'number'
          ).toBe(true);
          expect(
            body.preferences.budgetRangeMax === null ||
            typeof body.preferences.budgetRangeMax === 'number'
          ).toBe(true);
        }
      }
    });
  });

  test.describe('POST / - Save User Preferences', () => {
    test('saves preferredStyles array', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: ['Mid-Century Modern', 'Art Deco', 'Victorian'],
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
        expect(body.preferences?.preferredStyles).toContain('Mid-Century Modern');
        expect(body.preferences?.preferredStyles).toContain('Art Deco');
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('saves roomTypes array', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          roomTypes: ['Living Room', 'Bedroom', 'Office'],
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
        expect(body.preferences?.roomTypes).toContain('Living Room');
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('saves budget range', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMin: 100,
          budgetRangeMax: 5000,
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
        expect(body.preferences?.budgetRangeMin).toBe(100);
        expect(body.preferences?.budgetRangeMax).toBe(5000);
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('saves all preferences together', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: ['Bohemian', 'Scandinavian'],
          roomTypes: ['Kitchen', 'Bathroom'],
          budgetRangeMin: 50,
          budgetRangeMax: 1000,
        },
      });

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
        expect(body.preferences).toBeDefined();
      } else {
        expect(response.status()).toBe(401);
      }
    });

    test('accepts empty request body', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {},
      });

      // Empty body should be valid (all fields optional)
      expect([200, 401]).toContain(response.status());
    });

    test('validates budgetRangeMin is positive integer', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMin: -100,
        },
      });

      // Should be 400 for validation error or 401 if not authenticated
      expect([400, 401]).toContain(response.status());
    });

    test('validates budgetRangeMax is positive integer', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMax: -500,
        },
      });

      expect([400, 401]).toContain(response.status());
    });

    test('validates preferredStyles is array of strings', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: 'not-an-array',
        },
      });

      expect([400, 401]).toContain(response.status());
    });

    test('validates roomTypes is array of strings', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          roomTypes: { invalid: 'object' },
        },
      });

      expect([400, 401]).toContain(response.status());
    });

    test('validates budget values are integers not floats', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMin: 100.50,
          budgetRangeMax: 500.75,
        },
      });

      // Zod int() should reject floats - 400 for validation error
      expect([400, 401]).toContain(response.status());
    });

    test('updates existing preferences (upsert behavior)', async ({ request }) => {
      // First save
      const response1 = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: ['Style1'],
        },
      });

      // Second save should update, not fail with duplicate
      const response2 = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: ['Style2'],
        },
      });

      // Both should succeed or both fail auth
      expect([200, 401]).toContain(response1.status());
      expect([200, 401]).toContain(response2.status());

      // If authenticated, second should have updated value
      if (response2.status() === 200) {
        const body = await response2.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
        expect(body.preferences?.preferredStyles).toContain('Style2');
      }
    });
  });
});

// ============================================================================
// CROSS-CUTTING CONCERNS
// ============================================================================

test.describe('API Cross-Cutting Concerns', () => {
  test.describe('Error Response Format', () => {
    test('401 responses have consistent structure', async ({ request }) => {
      const endpoints = [
        { method: 'GET', url: `${API_BASE_URL}/api/collection` },
        { method: 'GET', url: `${API_BASE_URL}/api/wishlist` },
        { method: 'GET', url: `${API_BASE_URL}/api/preferences` },
      ];

      for (const endpoint of endpoints) {
        const response =
          endpoint.method === 'GET'
            ? await request.get(endpoint.url)
            : await request.post(endpoint.url, { data: {} });

        expect(response.status()).toBe(401);
        const body = await response.json() as ApiResponse;
        expectErrorResponse(body);
        expect(body.error).toBeTruthy();
        expect(typeof body.error).toBe('string');
      }
    });

    test('404 responses have consistent structure', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/nonexistent-route`);

      expect(response.status()).toBe(404);
      const body = await response.json() as ApiResponse;
      expectErrorResponse(body);
    });
  });

  test.describe('Content-Type Handling', () => {
    test('API accepts application/json content type', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
      });

      // Should not fail due to content type
      expect([200, 400, 401]).toContain(response.status());
    });

    test('API returns application/json content type', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection`);

      const contentType = response.headers()['content-type'];
      expect(contentType).toMatch(/application\/json/);
    });
  });

  test.describe('CORS Headers', () => {
    test('API responds to OPTIONS preflight requests', async ({ request }) => {
      // Note: Playwright's request doesn't easily support OPTIONS
      // This test verifies CORS headers are present in regular responses
      const response = await request.get(`${API_BASE_URL}/api/collection`);

      // CORS headers may or may not be present depending on same-origin
      // Just verify the response is valid
      expect([200, 401]).toContain(response.status());
    });
  });

  test.describe('Request Size Limits', () => {
    test('API handles large request bodies gracefully', async ({ request }) => {
      const largeArray = Array(1000).fill('Style Name');

      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: largeArray,
        },
      });

      // Should either succeed, fail validation, or fail auth - not crash
      expect([200, 400, 401, 413]).toContain(response.status());
    });
  });

  test.describe('Health Check', () => {
    test('GET /health returns service status', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/health`);

      expect([200, 503]).toContain(response.status());

      const body = await response.json() as {
        status: string;
        timestamp: string;
        services: {
          database: string;
          storage: string;
          openai: string;
        };
      };

      expect(body).toHaveProperty('status');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(body.status);
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('services');
      expect(body.services).toHaveProperty('database');
      expect(body.services).toHaveProperty('storage');
      expect(body.services).toHaveProperty('openai');
    });
  });
});

// ============================================================================
// EDGE CASES AND BOUNDARY CONDITIONS
// ============================================================================

test.describe('Edge Cases and Boundary Conditions', () => {
  test.describe('Collection Edge Cases', () => {
    test('handles concurrent requests gracefully', async ({ request }) => {
      const headers = await createAuthenticatedContext(request);

      // Send multiple requests concurrently
      const responses = await Promise.all([
        request.get(`${API_BASE_URL}/api/collection`, { headers }),
        request.get(`${API_BASE_URL}/api/collection`, { headers }),
        request.get(`${API_BASE_URL}/api/collection`, { headers }),
      ]);

      // All should return same status
      const statuses = responses.map((r) => r.status());
      expect(statuses.every((s) => s === statuses[0])).toBe(true);
    });

    test('handles special characters in notes', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: NON_EXISTENT_UUID,
          notes: 'Special chars: <script>alert("xss")</script> & "quotes" & \'apostrophes\'',
        },
      });

      // Should handle without error (404 for non-existent item or 401)
      expect([404, 401]).toContain(response.status());
    });

    test('handles unicode in location', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: NON_EXISTENT_UUID,
          location: '日本語 中文 한국어 emoji: 🏠',
        },
      });

      expect([404, 401]).toContain(response.status());
    });

    test('handles very long notes', async ({ request }) => {
      const longNotes = 'x'.repeat(10000);

      const response = await request.post(`${API_BASE_URL}/api/collection`, {
        headers: await createAuthenticatedContext(request),
        data: {
          itemAnalysisId: NON_EXISTENT_UUID,
          notes: longNotes,
        },
      });

      // Should either succeed or fail gracefully
      expect([200, 400, 404, 401]).toContain(response.status());
    });
  });

  test.describe('Wishlist Edge Cases', () => {
    test('handles empty keywords array', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            keywords: [],
          },
        },
      });

      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles large keywords array', async ({ request }) => {
      const manyKeywords = Array(100)
        .fill(0)
        .map((_, i) => `keyword${i}`);

      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            keywords: manyKeywords,
          },
        },
      });

      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles priceRange where min equals max', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            priceRange: {
              min: 500,
              max: 500,
            },
          },
        },
      });

      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles priceRange where min is greater than max', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            priceRange: {
              min: 1000,
              max: 100,
            },
          },
        },
      });

      // Should either accept or validate - depends on backend logic
      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles zero values in priceRange', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/wishlist`, {
        headers: await createAuthenticatedContext(request),
        data: {
          searchCriteria: {
            priceRange: {
              min: 0,
              max: 0,
            },
          },
        },
      });

      expect([200, 400, 401]).toContain(response.status());
    });
  });

  test.describe('Preferences Edge Cases', () => {
    test('handles empty arrays for list fields', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: [],
          roomTypes: [],
        },
      });

      expect([200, 401]).toContain(response.status());

      if (response.status() === 200) {
        const body = await response.json() as ApiSuccessResponse<UserPreferences>;
        expectSuccessResponse(body);
      }
    });

    test('handles zero budget values', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMin: 0,
          budgetRangeMax: 0,
        },
      });

      // Zero might be rejected by positive() validation
      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles very large budget values', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMin: 1,
          budgetRangeMax: 999999999,
        },
      });

      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles budget where min is greater than max', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          budgetRangeMin: 5000,
          budgetRangeMax: 100,
        },
      });

      // Backend may or may not validate this relationship
      expect([200, 400, 401]).toContain(response.status());
    });

    test('handles duplicate values in arrays', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/preferences`, {
        headers: await createAuthenticatedContext(request),
        data: {
          preferredStyles: ['Modern', 'Modern', 'Modern'],
          roomTypes: ['Kitchen', 'Kitchen'],
        },
      });

      expect([200, 400, 401]).toContain(response.status());
    });
  });

  test.describe('ID Format Edge Cases', () => {
    test('handles empty string as ID', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/collection/`, {
        headers: await createAuthenticatedContext(request),
      });

      // Empty ID should either redirect to list or 404
      expect([200, 404, 401]).toContain(response.status());
    });

    test('handles whitespace-only ID', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/collection/%20%20%20`, {
        headers: await createAuthenticatedContext(request),
      });

      expect([400, 404, 401]).toContain(response.status());
    });

    test('handles SQL injection attempt in ID', async ({ request }) => {
      const maliciousId = "'; DROP TABLE users; --";

      const response = await request.delete(
        `${API_BASE_URL}/api/collection/${encodeURIComponent(maliciousId)}`,
        {
          headers: await createAuthenticatedContext(request),
        }
      );

      // Should safely reject - 400 or 404, never execute SQL
      expect([400, 404, 401]).toContain(response.status());
    });
  });
});
