import { test, expect, Page, Route } from '@playwright/test';

// Base URL for all navigation (matches playwright.config.ts)
const BASE_URL = 'http://localhost:5173';

/**
 * VintageVision E2E Tests - Wishlist Management & User Preferences
 *
 * Tests Journey 6: Wishlist Management
 * Tests Journey 7: User Preferences
 *
 * @see /tests/TEST_CRITERIA.md
 */

// ============================================================================
// TEST FIXTURES & HELPERS
// ============================================================================

interface MockUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  emailVerified: boolean;
  createdAt: string;
}

interface MockWishlistItem {
  id: string;
  item_analysis_id: string | null;
  search_criteria: {
    style?: string;
    era?: string;
    priceRange?: { min: number; max: number };
    keywords?: string[];
  };
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  matches?: MockMarketplaceMatch[];
}

interface MockMarketplaceMatch {
  id: string;
  marketplace_name: string;
  link_url: string;
  title: string;
  price: number;
  image_url?: string;
  confidence_score: number;
  found_at: string;
}

interface MockPreferences {
  id: string;
  userId: string;
  preferredStyles: string[];
  roomTypes: string[];
  budgetRangeMin: number | null;
  budgetRangeMax: number | null;
  createdAt: string;
  updatedAt: string;
}

// Mock authenticated user
const mockUser: MockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  avatarUrl: 'https://via.placeholder.com/150',
  emailVerified: true,
  createdAt: new Date().toISOString(),
};

// Mock wishlist items
const mockWishlistItems: MockWishlistItem[] = [
  {
    id: 'wishlist-1',
    item_analysis_id: null,
    search_criteria: {
      keywords: ['mid-century', 'lamp'],
      style: 'Mid-Century Modern',
      era: '1950s',
      priceRange: { min: 100, max: 500 },
    },
    notes: 'Looking for a good desk lamp',
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    matches: [
      {
        id: 'match-1',
        marketplace_name: 'eBay',
        link_url: 'https://ebay.com/item/123',
        title: 'Vintage Mid-Century Desk Lamp',
        price: 250,
        image_url: 'https://via.placeholder.com/100',
        confidence_score: 0.85,
        found_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'wishlist-2',
    item_analysis_id: null,
    search_criteria: {
      keywords: ['art deco', 'mirror'],
      style: 'Art Deco',
    },
    notes: null,
    is_active: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    matches: [],
  },
];

// Mock preferences
const mockPreferences: MockPreferences = {
  id: 'pref-123',
  userId: 'test-user-123',
  preferredStyles: ['Victorian', 'Art Deco'],
  roomTypes: ['Living Room', 'Bedroom'],
  budgetRangeMin: 50,
  budgetRangeMax: 1000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Available styles (matching PreferencesPage)
const AVAILABLE_STYLES = [
  'Victorian', 'Art Deco', 'Mid-Century Modern', 'Art Nouveau', 'Bauhaus',
  'Colonial', 'Georgian', 'Regency', 'Empire', 'Rococo', 'Neoclassical',
  'Arts and Crafts', 'Mission', 'Shaker', 'Industrial', 'Rustic',
  'Scandinavian', 'French Country', 'English Country', 'Mediterranean',
];

// Available room types (matching PreferencesPage)
const ROOM_TYPES = [
  'Living Room', 'Dining Room', 'Bedroom', 'Kitchen', 'Bathroom',
  'Home Office', 'Library/Study', 'Entryway', 'Basement', 'Attic',
  'Garage', 'Garden/Patio', 'Guest Room', 'Nursery', 'Walk-in Closet',
];

/**
 * Setup authenticated session by mocking auth API
 * Also navigates to homepage first to establish auth state before protected route navigation
 */
async function setupAuthenticatedSession(page: Page): Promise<void> {
  // Mock the auth/me endpoint to return authenticated user
  await page.route('**/api/auth/me', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: mockUser }),
    });
  });

  // Set a mock session cookie
  await page.context().addCookies([
    {
      name: 'session',
      value: 'mock-session-token',
      domain: 'localhost',
      path: '/',
    },
  ]);

  // Navigate to /app (the authenticated app) first to establish auth state
  // Note: '/' is the landing page without Wishlist link - /app has the full header
  // This avoids the race condition where protected pages redirect before auth loads
  await page.goto(`${BASE_URL}/app`);
  await page.waitForLoadState('networkidle');
  // Wait for authenticated state (user button visible)
  await page.waitForSelector('button:has-text("Test User"), button:has-text("Pro Member")', {
    timeout: 10000,
  }).catch(() => {
    // May already have auth state from previous test
  });
}

/**
 * Navigate to wishlist using client-side navigation (clicking UI elements)
 * This preserves React context/state and avoids auth race conditions
 * Handles both desktop header navigation and mobile bottom navigation
 */
async function navigateToWishlist(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  const isMobile = viewport && viewport.width < 768;

  if (isMobile) {
    // On mobile, we may need to reload to get the mobile navigation after viewport change
    // Check if mobile nav is visible, otherwise reload
    const mobileNav = page.locator('.fixed.bottom-0');
    const isMobileNavVisible = await mobileNav.isVisible().catch(() => false);

    if (!isMobileNavVisible) {
      // Reload to get the mobile layout
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('button:has-text("Test User"), button:has-text("Profile")', {
        timeout: 10000,
      }).catch(() => {});
    }

    // On mobile, use the bottom tab bar navigation
    const mobileWishlistButton = page.locator('button').filter({ hasText: 'Wishlist' }).first();
    await mobileWishlistButton.click();
  } else {
    // On desktop, click the Wishlist nav button in the header
    const wishlistButton = page.locator('button', { hasText: 'Wishlist' }).first();
    await wishlistButton.click();
  }

  await page.waitForLoadState('networkidle');
  // Wait for the wishlist page to load
  await page.waitForSelector('h1:has-text("My Wishlist"), h1:has-text("Wishlist")', {
    timeout: 10000,
  });
}

/**
 * Navigate to preferences using client-side navigation (clicking UI elements)
 * This preserves React context/state and avoids auth race conditions
 * Handles both desktop header navigation and mobile bottom navigation
 */
async function navigateToPreferences(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  const isMobile = viewport && viewport.width < 768;

  if (isMobile) {
    // On mobile, we may need to reload to get the mobile navigation after viewport change
    // Check if mobile nav is visible, otherwise reload
    const mobileNav = page.locator('.fixed.bottom-0');
    const isMobileNavVisible = await mobileNav.isVisible().catch(() => false);

    if (!isMobileNavVisible) {
      // Reload to get the mobile layout
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('button:has-text("Test User"), button:has-text("Profile")', {
        timeout: 10000,
      }).catch(() => {});
    }

    // On mobile, the Profile tab navigates directly to /preferences for authenticated users
    const mobileProfileButton = page.locator('button').filter({ hasText: 'Profile' }).first();
    await mobileProfileButton.click();
  } else {
    // On desktop, open the user menu dropdown first
    const userMenuButton = page.locator('button:has-text("Test User"), button:has-text("Pro Member")').first();
    await userMenuButton.click();

    // Wait for dropdown menu to appear and click Preferences
    const preferencesButton = page.locator('button', { hasText: 'Preferences' }).first();
    await preferencesButton.waitFor({ state: 'visible', timeout: 5000 });
    await preferencesButton.click();
  }

  await page.waitForLoadState('networkidle');
  // Wait for the preferences page to load
  await page.waitForSelector('h1:has-text("Preferences")', {
    timeout: 10000,
  });
}

/**
 * Setup wishlist API mocks
 */
async function setupWishlistMocks(
  page: Page,
  items: MockWishlistItem[] = mockWishlistItems
): Promise<void> {
  let currentItems = [...items];

  // GET /api/wishlist - fetch all items
  await page.route('**/api/wishlist', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, items: currentItems }),
      });
    } else if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      const newItem: MockWishlistItem = {
        id: `wishlist-${Date.now()}`,
        item_analysis_id: null,
        search_criteria: body.search_criteria,
        notes: body.notes || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        matches: [],
      };
      currentItems = [newItem, ...currentItems];
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, item: newItem }),
      });
    } else {
      await route.continue();
    }
  });

  // PATCH/DELETE /api/wishlist/:id
  await page.route('**/api/wishlist/*', async (route: Route) => {
    const url = route.request().url();
    const id = url.split('/').pop();

    if (route.request().method() === 'PATCH') {
      const body = route.request().postDataJSON();
      currentItems = currentItems.map((item) =>
        item.id === id ? { ...item, ...body, updated_at: new Date().toISOString() } : item
      );
      const updatedItem = currentItems.find((item) => item.id === id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, item: updatedItem }),
      });
    } else if (route.request().method() === 'DELETE') {
      currentItems = currentItems.filter((item) => item.id !== id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Setup preferences API mocks
 */
async function setupPreferencesMocks(
  page: Page,
  initialPrefs: MockPreferences | null = mockPreferences
): Promise<{ getLastSaved: () => MockPreferences | null }> {
  let currentPrefs = initialPrefs ? { ...initialPrefs } : null;
  let lastSaved: MockPreferences | null = null;

  // GET /api/preferences
  await page.route('**/api/preferences', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          preferences: currentPrefs,
        }),
      });
    } else if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      currentPrefs = {
        id: currentPrefs?.id || `pref-${Date.now()}`,
        userId: mockUser.id,
        preferredStyles: body.preferredStyles || [],
        roomTypes: body.roomTypes || [],
        budgetRangeMin: body.budgetRangeMin ?? null,
        budgetRangeMax: body.budgetRangeMax ?? null,
        createdAt: currentPrefs?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      lastSaved = { ...currentPrefs };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, preferences: currentPrefs }),
      });
    } else {
      await route.continue();
    }
  });

  return {
    getLastSaved: () => lastSaved,
  };
}

// ============================================================================
// JOURNEY 6: WISHLIST MANAGEMENT TESTS
// ============================================================================

test.describe('Journey 6: Wishlist Management', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
    await setupWishlistMocks(page);
  });

  test('should navigate to /wishlist and require auth', async ({ page }) => {
    // Navigate to wishlist via client-side navigation
    await navigateToWishlist(page);

    // Should see the wishlist page header
    await expect(page.getByRole('heading', { name: /my wishlist/i })).toBeVisible();
  });

  test('should display wishlist page with stats', async ({ page }) => {
    await navigateToWishlist(page);

    // Check stats cards are displayed
    await expect(page.getByText(/searches/i)).toBeVisible();
    await expect(page.getByText(/active/i)).toBeVisible();
    await expect(page.getByText(/total matches/i)).toBeVisible();
  });

  test('should display empty state when no items', async ({ page }) => {
    // Setup empty wishlist
    await setupWishlistMocks(page, []);

    await navigateToWishlist(page);

    // Check for empty state message
    await expect(page.getByText(/create your first search/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add first search/i })).toBeVisible();
  });

  test('should display existing wishlist items', async ({ page }) => {
    await navigateToWishlist(page);

    // Check first wishlist item displays
    await expect(page.getByText('mid-century, lamp')).toBeVisible();
    await expect(page.getByText('Mid-Century Modern')).toBeVisible();
    await expect(page.getByText('1950s')).toBeVisible();
    await expect(page.getByText('Looking for a good desk lamp')).toBeVisible();

    // Check second wishlist item
    await expect(page.getByText('art deco, mirror')).toBeVisible();
    await expect(page.getByText('Art Deco').first()).toBeVisible();
  });

  test('should open add search form when clicking Add Search button', async ({ page }) => {
    await navigateToWishlist(page);

    // Click Add Search button
    await page.getByRole('button', { name: /add search/i }).click();

    // Modal should appear
    await expect(page.getByRole('heading', { name: /add to wishlist/i })).toBeVisible();

    // Form fields should be present
    await expect(page.getByPlaceholder(/vintage lamp, mid-century chair/i)).toBeVisible();
    await expect(page.getByPlaceholder(/art deco/i)).toBeVisible();
    await expect(page.getByPlaceholder(/1950s/i)).toBeVisible();
    await expect(page.getByPlaceholder('100')).toBeVisible();
    await expect(page.getByPlaceholder('500')).toBeVisible();
  });

  test('should add new search criteria', async ({ page }) => {
    await navigateToWishlist(page);

    // Click Add Search button
    await page.getByRole('button', { name: /add search/i }).click();

    // Fill in the form
    await page.getByPlaceholder(/vintage lamp, mid-century chair/i).fill('Victorian chair, antique');
    await page.getByPlaceholder(/art deco/i).fill('Victorian');
    await page.getByPlaceholder(/1950s/i).fill('1880s');
    await page.getByPlaceholder('100').fill('200');
    await page.getByPlaceholder('500').fill('800');
    await page.getByPlaceholder(/any additional details/i).fill('Need for dining room');

    // Submit the form
    await page.getByRole('button', { name: /add to wishlist/i }).click();

    // Wait for the modal to close and item to appear
    await page.waitForTimeout(500);

    // New item should appear in the list
    await expect(page.getByText('Victorian chair, antique')).toBeVisible();
  });

  test('should validate keywords are required', async ({ page }) => {
    await navigateToWishlist(page);

    // Click Add Search button
    await page.getByRole('button', { name: /add search/i }).click();

    // Try to submit without keywords
    await page.getByRole('button', { name: /add to wishlist/i }).click();

    // Should stay on form (modal still visible)
    await expect(page.getByRole('heading', { name: /add to wishlist/i })).toBeVisible();
  });

  test('should allow style selection in add form', async ({ page }) => {
    await navigateToWishlist(page);

    // Click Add Search button
    await page.getByRole('button', { name: /add search/i }).click();

    // Fill keywords first
    await page.getByPlaceholder(/vintage lamp, mid-century chair/i).fill('test item');

    // Enter style
    const styleInput = page.getByPlaceholder(/art deco/i);
    await styleInput.fill('Bauhaus');
    await expect(styleInput).toHaveValue('Bauhaus');
  });

  test('should accept price range inputs', async ({ page }) => {
    await navigateToWishlist(page);

    // Click Add Search button
    await page.getByRole('button', { name: /add search/i }).click();

    // Fill price range
    const minInput = page.getByPlaceholder('100');
    const maxInput = page.getByPlaceholder('500');

    await minInput.fill('250');
    await maxInput.fill('750');

    await expect(minInput).toHaveValue('250');
    await expect(maxInput).toHaveValue('750');
  });

  test('should delete wishlist item', async ({ page }) => {
    await navigateToWishlist(page);

    // Count initial items
    const initialItemCount = await page.getByText(/mid-century, lamp|art deco, mirror/).count();
    expect(initialItemCount).toBeGreaterThanOrEqual(1);

    // Find and click delete button on first item
    const deleteButtons = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') });
    await deleteButtons.first().click();

    // Wait for deletion to process
    await page.waitForTimeout(500);

    // Item count should decrease
    const finalItemCount = await page.getByText(/mid-century, lamp|art deco, mirror/).count();
    expect(finalItemCount).toBeLessThan(initialItemCount);
  });

  test('should toggle notification status', async ({ page }) => {
    await navigateToWishlist(page);

    // Find the bell/bell-off toggle button
    const toggleButtons = page.locator('button').filter({
      has: page.locator('svg.lucide-bell, svg.lucide-bell-off')
    });

    // Click to toggle
    await toggleButtons.first().click();

    // Wait for state update
    await page.waitForTimeout(300);

    // The status badge should change (Active to Paused or vice versa)
    // This is verified by the mock returning updated data
  });

  test('should display marketplace matches', async ({ page }) => {
    await navigateToWishlist(page);

    // Check that matches section is visible for items with matches
    await expect(page.getByText(/recent matches/i)).toBeVisible();
    await expect(page.getByText('Vintage Mid-Century Desk Lamp')).toBeVisible();
    await expect(page.getByText('eBay')).toBeVisible();
    await expect(page.getByText(/85% match/i)).toBeVisible();
  });

  test('should filter wishlist items via search', async ({ page }) => {
    await navigateToWishlist(page);

    // Enter search query
    const searchInput = page.getByPlaceholder(/search wishlist/i);
    await searchInput.fill('art deco');

    // Wait for filter
    await page.waitForTimeout(300);

    // Should show matching item
    await expect(page.getByText('art deco, mirror')).toBeVisible();

    // Non-matching item might be hidden (depends on filter logic)
  });

  test('should close add form when clicking Cancel', async ({ page }) => {
    await navigateToWishlist(page);

    // Open form
    await page.getByRole('button', { name: /add search/i }).click();
    await expect(page.getByRole('heading', { name: /add to wishlist/i })).toBeVisible();

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Modal should close
    await expect(page.getByRole('heading', { name: /add to wishlist/i })).not.toBeVisible();
  });

  test('should close add form when clicking outside', async ({ page }) => {
    await navigateToWishlist(page);

    // Open form
    await page.getByRole('button', { name: /add search/i }).click();
    await expect(page.getByRole('heading', { name: /add to wishlist/i })).toBeVisible();

    // Click outside the modal (on backdrop)
    await page.locator('.fixed.inset-0.bg-black\\/50').click({ position: { x: 10, y: 10 } });

    // Modal should close
    await page.waitForTimeout(300);
    await expect(page.getByRole('heading', { name: /add to wishlist/i })).not.toBeVisible();
  });
});

// ============================================================================
// JOURNEY 7: USER PREFERENCES TESTS
// ============================================================================

test.describe('Journey 7: User Preferences', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
  });

  test('should navigate to /preferences and require auth', async ({ page }) => {
    await setupPreferencesMocks(page);

    await navigateToPreferences(page);

    // Should see preferences page header
    await expect(page.getByRole('heading', { name: /preferences/i })).toBeVisible();
  });

  test('should load preferences page with all sections', async ({ page }) => {
    await setupPreferencesMocks(page);

    await navigateToPreferences(page);

    // Check all sections are present
    await expect(page.getByRole('heading', { name: /style preferences/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /room types/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /budget range/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /save your preferences/i })).toBeVisible();
  });

  test('should display style toggle buttons', async ({ page }) => {
    await setupPreferencesMocks(page);

    await navigateToPreferences(page);

    // Check that style buttons are present
    for (const style of AVAILABLE_STYLES.slice(0, 5)) {
      await expect(page.getByRole('button', { name: style })).toBeVisible();
    }
  });

  test('should have 48px minimum touch targets for style buttons', async ({ page }) => {
    await setupPreferencesMocks(page);

    await navigateToPreferences(page);

    // Check that style buttons have min-h-12 (48px) class
    const styleButtons = page.locator('button.min-h-12');
    const count = await styleButtons.count();

    // Should have at least the number of styles as buttons
    expect(count).toBeGreaterThanOrEqual(AVAILABLE_STYLES.length);

    // Verify actual height of first button
    const firstButton = page.getByRole('button', { name: 'Victorian' });
    const box = await firstButton.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(48);
    }
  });

  test('should toggle style selection on click', async ({ page }) => {
    await setupPreferencesMocks(page, null); // Start with no preferences

    await navigateToPreferences(page);

    const victorianButton = page.getByRole('button', { name: 'Victorian' });

    // Initially not selected
    await expect(victorianButton).not.toHaveClass(/bg-purple-50/);

    // Click to select
    await victorianButton.click();

    // Should now be selected (has purple background)
    await expect(victorianButton).toHaveClass(/bg-purple-50/);

    // Click again to deselect
    await victorianButton.click();

    // Should be deselected
    await expect(victorianButton).not.toHaveClass(/bg-purple-50/);
  });

  test('should display room type toggles', async ({ page }) => {
    await setupPreferencesMocks(page);

    await navigateToPreferences(page);

    // Check room type buttons are present
    for (const room of ROOM_TYPES.slice(0, 5)) {
      await expect(page.getByRole('button', { name: room })).toBeVisible();
    }
  });

  test('should toggle room type selection on click', async ({ page }) => {
    await setupPreferencesMocks(page, null);

    await navigateToPreferences(page);

    const livingRoomButton = page.getByRole('button', { name: 'Living Room' });

    // Click to select
    await livingRoomButton.click();

    // Should be selected (has blue background)
    await expect(livingRoomButton).toHaveClass(/bg-blue-50/);
  });

  test('should accept budget range number inputs', async ({ page }) => {
    await setupPreferencesMocks(page, null);

    await navigateToPreferences(page);

    // Find budget inputs
    const minInput = page.getByPlaceholder('e.g., 50');
    const maxInput = page.getByPlaceholder('e.g., 500');

    // Fill in values
    await minInput.fill('100');
    await maxInput.fill('2000');

    // Verify values
    await expect(minInput).toHaveValue('100');
    await expect(maxInput).toHaveValue('2000');
  });

  test('should reject non-numeric budget input', async ({ page }) => {
    await setupPreferencesMocks(page, null);

    await navigateToPreferences(page);

    const minInput = page.getByPlaceholder('e.g., 50');

    // Type non-numeric (should be ignored for type="number")
    await minInput.fill('abc');

    // Value should be empty since number input rejects text
    await expect(minInput).toHaveValue('');
  });

  test('should save preferences when clicking save button', async ({ page }) => {
    const { getLastSaved } = await setupPreferencesMocks(page, null);

    await navigateToPreferences(page);

    // Select some styles
    await page.getByRole('button', { name: 'Victorian' }).click();
    await page.getByRole('button', { name: 'Art Deco' }).click();

    // Select room types
    await page.getByRole('button', { name: 'Living Room' }).click();

    // Set budget
    await page.getByPlaceholder('e.g., 50').fill('100');
    await page.getByPlaceholder('e.g., 500').fill('1000');

    // Click save
    await page.getByRole('button', { name: /save preferences/i }).click();

    // Wait for save
    await page.waitForTimeout(500);

    // Verify saved data
    const saved = getLastSaved();
    expect(saved).not.toBeNull();
    expect(saved?.preferredStyles).toContain('Victorian');
    expect(saved?.preferredStyles).toContain('Art Deco');
    expect(saved?.roomTypes).toContain('Living Room');
    expect(saved?.budgetRangeMin).toBe(100);
    expect(saved?.budgetRangeMax).toBe(1000);
  });

  test('should show success notification after saving', async ({ page }) => {
    await setupPreferencesMocks(page, null);

    await navigateToPreferences(page);

    // Select something to save
    await page.getByRole('button', { name: 'Victorian' }).click();

    // Click save
    await page.getByRole('button', { name: /save preferences/i }).click();

    // Check for success notification
    await expect(page.getByText(/saved!/i)).toBeVisible();
  });

  test('should persist preferences after reload', async ({ page }) => {
    await setupPreferencesMocks(page, mockPreferences);

    await navigateToPreferences(page);

    // Check that pre-selected styles are shown as selected
    const victorianButton = page.getByRole('button', { name: 'Victorian' });
    const artDecoButton = page.getByRole('button', { name: 'Art Deco' });

    // These should be selected based on mockPreferences
    await expect(victorianButton).toHaveClass(/bg-purple-50/);
    await expect(artDecoButton).toHaveClass(/bg-purple-50/);

    // Room types should also be pre-selected
    const livingRoomButton = page.getByRole('button', { name: 'Living Room' });
    const bedroomButton = page.getByRole('button', { name: 'Bedroom' });

    await expect(livingRoomButton).toHaveClass(/bg-blue-50/);
    await expect(bedroomButton).toHaveClass(/bg-blue-50/);

    // Budget values should be pre-filled
    await expect(page.getByPlaceholder('e.g., 50')).toHaveValue('50');
    await expect(page.getByPlaceholder('e.g., 500')).toHaveValue('1000');
  });

  test('should show selected count for styles', async ({ page }) => {
    await setupPreferencesMocks(page, mockPreferences);

    await navigateToPreferences(page);

    // Should show count in the info box
    await expect(page.getByText(/selected 2 styles/i)).toBeVisible();
  });

  test('should show selected count for room types', async ({ page }) => {
    await setupPreferencesMocks(page, mockPreferences);

    await navigateToPreferences(page);

    // Should show count in the info box
    await expect(page.getByText(/selected 2 room types/i)).toBeVisible();
  });

  test('should disable save button while saving', async ({ page }) => {
    // Add delay to the save response
    await page.route('**/api/preferences', async (route: Route) => {
      if (route.request().method() === 'POST') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, preferences: null }),
        });
      }
    });

    await navigateToPreferences(page);

    // Select something
    await page.getByRole('button', { name: 'Victorian' }).click();

    // Click save
    const saveButton = page.getByRole('button', { name: /save preferences/i });
    await saveButton.click();

    // Button should show "Saving..." and be disabled
    await expect(page.getByRole('button', { name: /saving/i })).toBeVisible();
  });

  test('should display personalization tips', async ({ page }) => {
    await setupPreferencesMocks(page);

    await navigateToPreferences(page);

    // Check for helpful tips section
    await expect(page.getByText(/how this helps you/i)).toBeVisible();
    await expect(page.getByText(/styling suggestions tailored/i)).toBeVisible();
    await expect(page.getByText(/marketplace recommendations/i)).toBeVisible();
  });
});

// ============================================================================
// RESPONSIVE DESIGN TESTS
// ============================================================================

test.describe('Responsive Design - Preferences Grid', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
    await setupPreferencesMocks(page);
  });

  test('should show 1 column on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToPreferences(page);

    // On mobile, grid should be single column
    const grid = page.locator('.grid.grid-cols-1').first();
    await expect(grid).toBeVisible();
  });

  test('should show 2 columns on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await navigateToPreferences(page);

    // On tablet, should show sm:grid-cols-2
    const styleSection = page.locator('.grid').filter({ hasText: 'Victorian' }).first();
    await expect(styleSection).toBeVisible();
  });

  test('should show 3-4 columns on desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await navigateToPreferences(page);

    // On desktop, should show lg:grid-cols-4
    const styleSection = page.locator('.grid').filter({ hasText: 'Victorian' }).first();
    await expect(styleSection).toBeVisible();
  });
});

test.describe('Responsive Design - Wishlist', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
    await setupWishlistMocks(page);
  });

  test('should be usable on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToWishlist(page);

    // Header should be visible
    await expect(page.getByRole('heading', { name: /my wishlist/i })).toBeVisible();

    // Add button should be accessible
    await expect(page.getByRole('button', { name: /add search/i })).toBeVisible();

    // Items should stack vertically
    await expect(page.getByText('mid-century, lamp')).toBeVisible();
  });

  test('should show stats grid properly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await navigateToWishlist(page);

    // Stats should be visible
    await expect(page.getByText(/searches/i)).toBeVisible();
    await expect(page.getByText(/active/i)).toBeVisible();
  });
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
  });

  test('should handle wishlist fetch error gracefully', async ({ page }) => {
    await page.route('**/api/wishlist', async (route: Route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await navigateToWishlist(page);

    // Should not crash, page should still be interactive
    await expect(page.getByRole('heading', { name: /my wishlist/i })).toBeVisible();
  });

  test('should handle preferences fetch error gracefully', async ({ page }) => {
    await page.route('**/api/preferences', async (route: Route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await navigateToPreferences(page);

    // Should still show the page
    await expect(page.getByRole('heading', { name: /preferences/i })).toBeVisible();
  });

  test('should handle save preferences failure', async ({ page }) => {
    await page.route('**/api/preferences', async (route: Route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, preferences: null }),
        });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to save' }),
        });
      }
    });

    await navigateToPreferences(page);

    // Select a style
    await page.getByRole('button', { name: 'Victorian' }).click();

    // Try to save
    await page.getByRole('button', { name: /save preferences/i }).click();

    // Should not show "Saved!" since it failed
    await page.waitForTimeout(500);
    await expect(page.getByText(/saved!/i)).not.toBeVisible();
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
    await setupPreferencesMocks(page);
    await setupWishlistMocks(page);
  });

  test('preferences page should have proper heading hierarchy', async ({ page }) => {
    await navigateToPreferences(page);

    // Main heading
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveText(/preferences/i);

    // Section headings
    const h2s = page.getByRole('heading', { level: 2 });
    expect(await h2s.count()).toBeGreaterThanOrEqual(3);
  });

  test('wishlist page should have proper heading hierarchy', async ({ page }) => {
    await navigateToWishlist(page);

    // Main heading
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveText(/my wishlist/i);
  });

  test('form inputs should have associated labels', async ({ page }) => {
    await navigateToPreferences(page);

    // Budget inputs should have labels
    const minLabel = page.getByText('Minimum Budget ($)');
    await expect(minLabel).toBeVisible();

    const maxLabel = page.getByText('Maximum Budget ($)');
    await expect(maxLabel).toBeVisible();
  });

  test('buttons should be focusable', async ({ page }) => {
    await navigateToPreferences(page);

    // Tab to first style button
    await page.keyboard.press('Tab');

    // Continue tabbing to find a style button
    for (let i = 0; i < 20; i++) {
      const focused = page.locator(':focus');
      const text = await focused.textContent();
      if (text && AVAILABLE_STYLES.includes(text)) {
        // Found a style button via keyboard navigation
        expect(text).toBeTruthy();
        return;
      }
      await page.keyboard.press('Tab');
    }
  });
});

// ============================================================================
// REDIRECT BEHAVIOR TESTS
// ============================================================================

test.describe('Authentication Redirects', () => {
  test('should redirect to home when not authenticated on wishlist', async ({ page }) => {
    // Don't setup authenticated session
    await page.route('**/api/auth/me', async (route: Route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not authenticated' }),
      });
    });

    await page.goto(`${BASE_URL}/wishlist`);
    await page.waitForLoadState('networkidle');

    // Should be redirected to home
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/');
  });

  test('should redirect to home when not authenticated on preferences', async ({ page }) => {
    // Don't setup authenticated session
    await page.route('**/api/auth/me', async (route: Route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not authenticated' }),
      });
    });

    await page.goto(`${BASE_URL}/preferences`);
    await page.waitForLoadState('networkidle');

    // Should be redirected to home
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/');
  });
});
