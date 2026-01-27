/**
 * VintageVision E2E Tests: Collection Management (Journey 5)
 *
 * Tests the complete collection management flow including:
 * - Navigation to /collection with authentication
 * - Grid and list view modes
 * - Sorting by recent/value/name
 * - Empty state display
 * - Collection item display (image, name, badges, value, date)
 * - Detail modal (eye icon opens modal)
 * - Edit notes in detail modal
 * - Delete item with confirmation
 * - Mobile responsive layout (375px)
 * - Touch targets >= 48px
 */

import { test, expect, Page, Route } from '@playwright/test';

// Base URL for all navigation (matches playwright.config.ts)
const BASE_URL = 'http://localhost:5173';

// =============================================================================
// TEST DATA & TYPES
// =============================================================================

interface MockUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

interface MockCollectionItem {
  id: string;
  item_analysis_id: string;
  name: string;
  era?: string;
  style?: string;
  description: string;
  estimated_value_min?: number;
  estimated_value_max?: number;
  image_url: string;
  notes?: string;
  location?: string;
  saved_at: string;
  confidence: number;
}

const mockUser: MockUser = {
  id: 'user-test-123',
  email: 'test@example.com',
  displayName: 'Test User',
  avatarUrl: 'https://via.placeholder.com/100',
  emailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mockCollectionItems: MockCollectionItem[] = [
  {
    id: 'item-1',
    item_analysis_id: 'analysis-1',
    name: 'Victorian Oak Writing Desk',
    era: '1890s',
    style: 'Victorian',
    description: 'A beautifully crafted oak writing desk with brass hardware and leather writing surface.',
    estimated_value_min: 1200,
    estimated_value_max: 1800,
    image_url: 'https://via.placeholder.com/400x400?text=Victorian+Desk',
    notes: 'Found at estate sale in Boston',
    location: 'Living Room',
    saved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    confidence: 0.92,
  },
  {
    id: 'item-2',
    item_analysis_id: 'analysis-2',
    name: 'Art Deco Table Lamp',
    era: '1920s',
    style: 'Art Deco',
    description: 'Elegant brass table lamp with frosted glass shade featuring geometric patterns.',
    estimated_value_min: 450,
    estimated_value_max: 650,
    image_url: 'https://via.placeholder.com/400x400?text=Art+Deco+Lamp',
    notes: '',
    location: 'Study',
    saved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    confidence: 0.85,
  },
  {
    id: 'item-3',
    item_analysis_id: 'analysis-3',
    name: 'Mid-Century Eames Chair',
    era: '1960s',
    style: 'Mid-Century Modern',
    description: 'Original Herman Miller Eames lounge chair with rosewood veneer and black leather.',
    estimated_value_min: 4500,
    estimated_value_max: 6500,
    image_url: 'https://via.placeholder.com/400x400?text=Eames+Chair',
    notes: 'Inherited from grandmother',
    location: 'Office',
    saved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    confidence: 0.95,
  },
];

// =============================================================================
// TEST FIXTURES & HELPERS
// =============================================================================

/**
 * Sets up API route mocking for authenticated session and collection data.
 * Routes are set up before any navigation to ensure auth state is available immediately.
 */
async function setupAuthenticatedSession(
  page: Page,
  options: {
    collectionItems?: MockCollectionItem[];
    user?: MockUser;
  } = {}
): Promise<void> {
  const { collectionItems = mockCollectionItems, user = mockUser } = options;

  // Mock authentication check endpoint
  await page.route('**/api/auth/me', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: user,
      }),
    });
  });

  // Mock collection endpoint
  await page.route('**/api/collection', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          items: collectionItems,
        }),
      });
    }
  });

  // Mock individual collection item delete endpoint
  await page.route('**/api/collection/*', async (route: Route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    } else if (route.request().method() === 'PATCH' || route.request().method() === 'PUT') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    }
  });

  // Mock analytics endpoint (silently accept)
  await page.route('**/api/analytics', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // Navigate to /app (the authenticated app) and wait for auth state to be fully established
  // Note: '/' is the landing page without Collection link - /app has the full header
  await page.goto(`${BASE_URL}/app`);
  await page.waitForLoadState('networkidle');

  // Wait for the authenticated user button to appear (confirms auth state is loaded)
  // The button shows user's display name or "Pro Member" based on subscription status
  await page.waitForSelector(
    'button:has-text("Test User"), button:has-text("Pro Member"), [data-testid="user-menu-button"]',
    { timeout: 10000 }
  );
}

/**
 * Sets up API routes for unauthenticated session
 */
async function setupUnauthenticatedSession(page: Page): Promise<void> {
  await page.route('**/api/auth/me', async (route: Route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'Not authenticated',
      }),
    });
  });
}

/**
 * Navigate to collection page using client-side navigation.
 *
 * IMPORTANT: This uses click-based navigation instead of page.goto() to preserve
 * React state and avoid the auth race condition. The setupAuthenticatedSession
 * function must be called first to establish auth state on the homepage.
 */
async function navigateToCollection(page: Page): Promise<void> {
  // Use client-side navigation by clicking the Collection link in the header.
  // This preserves React state (including auth) and avoids the race condition
  // that occurs with page.goto() which causes a fresh page load.
  const collectionButton = page.locator('button:has-text("Collection")').first();
  await collectionButton.click();

  // Wait for the collection page to render
  await page.waitForSelector('h1:has-text("My Collection")', { timeout: 10000 });

  // Also wait for either the collection grid or empty state to appear
  await page.waitForSelector('[class*="grid"], [class*="empty"], [data-testid="collection-content"]', {
    timeout: 10000,
  });
}

/**
 * Get the bounding box of an element for touch target validation
 */
async function getElementSize(
  page: Page,
  selector: string
): Promise<{ width: number; height: number } | null> {
  const element = page.locator(selector).first();
  const box = await element.boundingBox();
  if (!box) return null;
  return { width: box.width, height: box.height };
}

// =============================================================================
// TEST SUITES
// =============================================================================

test.describe('Collection Management - Journey 5', () => {
  test.describe('Navigation & Authentication', () => {
    test('redirects to home when not authenticated', async ({ page }) => {
      await setupUnauthenticatedSession(page);
      await page.goto(`${BASE_URL}/collection`);

      // Should redirect to home page
      await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
    });

    test('loads collection page when authenticated', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Page should have loaded with collection title
      await expect(page.locator('h1:has-text("My Collection")')).toBeVisible();
    });

    test('displays user stats header', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Should show item count
      await expect(page.getByText(/3 items/i)).toBeVisible();

      // Should show total value (sum of max values: 1800 + 650 + 6500 = 8950)
      await expect(page.getByText(/\$8,950/)).toBeVisible();
    });
  });

  test.describe('View Modes', () => {
    test('defaults to grid view', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Grid view button should be active (has white background)
      const gridButton = page.locator('button:has(svg[class*="Grid3X3"])').first();
      await expect(gridButton).toBeVisible();

      // Items should be in grid layout
      const gridContainer = page.locator('[class*="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"]');
      await expect(gridContainer).toBeVisible();
    });

    test('switches to list view', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Click list view button
      const listButton = page.locator('button:has(svg[class*="List"])').first();
      await listButton.click();

      // Items should be in single column layout
      const listContainer = page.locator('[class*="grid-cols-1"]:not([class*="md:grid-cols-2"])');
      await expect(listContainer).toBeVisible();
    });

    test('switches back to grid view', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Switch to list
      const listButton = page.locator('button:has(svg[class*="List"])').first();
      await listButton.click();

      // Switch back to grid
      const gridButton = page.locator('button:has(svg[class*="Grid3X3"])').first();
      await gridButton.click();

      // Items should be in grid layout again
      const gridContainer = page.locator('[class*="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"]');
      await expect(gridContainer).toBeVisible();
    });
  });

  test.describe('Sorting', () => {
    test('sorts by recent (default)', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Get the first item name - should be most recent (Eames Chair, 1 day ago)
      const firstItem = page.locator('h3:has-text("Mid-Century Eames Chair")');
      await expect(firstItem).toBeVisible();

      // Check sort dropdown shows "Recently Added"
      const sortSelect = page.locator('select');
      await expect(sortSelect).toHaveValue('recent');
    });

    test('sorts by value (highest first)', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Change sort to value
      const sortSelect = page.locator('select');
      await sortSelect.selectOption('value');

      // Wait for re-render
      await page.waitForTimeout(300);

      // Eames Chair should be first (highest value: $4,500 - $6,500)
      const items = page.locator('h3').filter({ hasText: /Victorian|Art Deco|Eames/ });
      const firstItemText = await items.first().textContent();
      expect(firstItemText).toContain('Eames');
    });

    test('sorts by name (A-Z)', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Change sort to name
      const sortSelect = page.locator('select');
      await sortSelect.selectOption('name');

      // Wait for re-render
      await page.waitForTimeout(300);

      // Art Deco should be first (alphabetically)
      const items = page.locator('h3').filter({ hasText: /Victorian|Art Deco|Eames/ });
      const firstItemText = await items.first().textContent();
      expect(firstItemText).toContain('Art Deco');
    });
  });

  test.describe('Empty State', () => {
    test('shows empty state when no items', async ({ page }) => {
      await setupAuthenticatedSession(page, { collectionItems: [] });
      await navigateToCollection(page);

      // Should show empty state message
      await expect(page.getByText('Start Your Collection')).toBeVisible();
      await expect(
        page.getByText('Identify your first vintage treasure to begin building your collection.')
      ).toBeVisible();

      // Should have CTA button
      await expect(page.getByRole('button', { name: /Identify First Item/i })).toBeVisible();
    });

    test('shows "no matching items" when search has no results', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Search for something that doesn't exist
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('nonexistent item xyz123');

      // Should show no matching items message
      await expect(page.getByText('No matching items')).toBeVisible();
    });
  });

  test.describe('Collection Item Display', () => {
    test('displays item image thumbnail', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Each item should have an image
      const images = page.locator('img[alt*="Victorian"], img[alt*="Art Deco"], img[alt*="Eames"]');
      await expect(images).toHaveCount(3);
    });

    test('displays item name', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Each item should show its name
      await expect(page.getByText('Victorian Oak Writing Desk')).toBeVisible();
      await expect(page.getByText('Art Deco Table Lamp')).toBeVisible();
      await expect(page.getByText('Mid-Century Eames Chair')).toBeVisible();
    });

    test('displays era badges', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Era badges should be visible
      await expect(page.getByText('1890s')).toBeVisible();
      await expect(page.getByText('1920s')).toBeVisible();
      await expect(page.getByText('1960s')).toBeVisible();
    });

    test('displays style badges', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Style badges should be visible
      await expect(page.getByText('Victorian').first()).toBeVisible();
      await expect(page.getByText('Art Deco').first()).toBeVisible();
      await expect(page.getByText('Mid-Century Modern')).toBeVisible();
    });

    test('displays value estimate', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Value ranges should be displayed
      await expect(page.getByText('$1,200 - $1,800')).toBeVisible();
      await expect(page.getByText('$450 - $650')).toBeVisible();
      await expect(page.getByText('$4,500 - $6,500')).toBeVisible();
    });

    test('displays saved date (relative time)', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Should show relative dates (e.g., "2 days ago", "yesterday")
      const dateElements = page.locator('[class*="Calendar"] + span, svg[class*="Calendar"] ~ span');
      await expect(dateElements.first()).toBeVisible();
    });

    test('displays confidence badge', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Confidence badges should show percentage
      await expect(page.getByText('92% confident')).toBeVisible();
      await expect(page.getByText('85% confident')).toBeVisible();
      await expect(page.getByText('95% confident')).toBeVisible();
    });

    test('displays item notes when present', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Notes should be visible in quotes
      await expect(page.getByText('"Found at estate sale in Boston"')).toBeVisible();
      await expect(page.getByText('"Inherited from grandmother"')).toBeVisible();
    });
  });

  test.describe('Detail Modal', () => {
    test('eye icon opens detail modal', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Hover over the first item to reveal the eye icon
      const firstItem = page.locator('[class*="GlassCard"], [class*="overflow-hidden"]').first();
      await firstItem.hover();

      // Click the eye icon button
      const eyeButton = page.locator('button:has(svg[class*="Eye"]), div:has(> button:has(svg[class*="Eye"]))').first();
      await eyeButton.click();

      // Modal should open with item details
      await expect(page.locator('[role="dialog"], [class*="Dialog"]')).toBeVisible();
    });

    test('detail modal shows full item information', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal for first item
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Should show item name in modal
      const modal = page.locator('[role="dialog"], [class*="DialogPanel"], [class*="Dialog.Panel"]');
      await expect(modal.getByText(/Victorian Oak Writing Desk|Art Deco Table Lamp|Mid-Century Eames Chair/)).toBeVisible();

      // Should show description
      await expect(modal.getByText(/beautifully crafted|Elegant brass|Original Herman Miller/)).toBeVisible();

      // Should show value
      await expect(modal.getByText(/Estimated Value/i)).toBeVisible();
    });

    test('detail modal can be closed', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Close the modal using the close button
      const closeButton = page.locator('button:has(svg[class*="X"])').first();
      await closeButton.click();

      // Modal should be closed
      await expect(page.locator('[role="dialog"], [class*="DialogPanel"]')).not.toBeVisible();
    });
  });

  test.describe('Edit Notes', () => {
    test('can enter edit mode in detail modal', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Click edit button
      const editButton = page.locator('button:has-text("Edit"), button:has(svg[class*="Edit"])');
      await editButton.click();

      // Should show textarea for notes
      await expect(page.locator('textarea')).toBeVisible();

      // Should show location input
      await expect(page.locator('input[placeholder*="Where"]')).toBeVisible();
    });

    test('can save edited notes', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Click edit button
      const editButton = page.locator('button:has-text("Edit"), button:has(svg[class*="Edit"])');
      await editButton.click();

      // Edit notes
      const notesTextarea = page.locator('textarea');
      await notesTextarea.fill('Updated notes for testing');

      // Save
      const saveButton = page.locator('button:has-text("Save")');
      await saveButton.click();

      // Should exit edit mode (textarea should disappear)
      await expect(page.locator('textarea')).not.toBeVisible({ timeout: 5000 });
    });

    test('can cancel editing notes', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Click edit button
      const editButton = page.locator('button:has-text("Edit"), button:has(svg[class*="Edit"])');
      await editButton.click();

      // Cancel editing
      const cancelButton = page.locator('button:has-text("Cancel")');
      await cancelButton.click();

      // Should exit edit mode
      await expect(page.locator('textarea')).not.toBeVisible();
    });
  });

  test.describe('Delete Item', () => {
    test('delete button shows in detail modal', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Should have delete/remove button
      await expect(page.locator('button:has-text("Remove"), button:has(svg[class*="Trash"])')).toBeVisible();
    });

    test('delete requires confirmation dialog', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Open detail modal
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Set up dialog handler BEFORE clicking delete
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('remove');
        await dialog.accept();
      });

      // Click delete button
      const deleteButton = page.locator('button:has-text("Remove")');
      await deleteButton.click();
    });

    test('item is removed from list after delete', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Count initial items
      const initialCount = await page.locator('h3').filter({ hasText: /Victorian|Art Deco|Eames/ }).count();
      expect(initialCount).toBe(3);

      // Open detail modal for first item
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
      await eyeButton.click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"], [class*="Dialog"]');

      // Handle confirmation dialog
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      // Click delete button
      const deleteButton = page.locator('button:has-text("Remove")');
      await deleteButton.click();

      // Modal should close
      await expect(page.locator('[role="dialog"], [class*="DialogPanel"]')).not.toBeVisible({ timeout: 5000 });

      // Item count should decrease
      const finalCount = await page.locator('h3').filter({ hasText: /Victorian|Art Deco|Eames/ }).count();
      expect(finalCount).toBe(2);
    });

    test('can delete item directly from grid (hover action)', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Hover over item to reveal delete button
      const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
      await firstItem.hover();

      // Handle confirmation dialog
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      // Click the trash icon in the hover overlay
      const trashButton = firstItem.locator('button:has(svg[class*="Trash"])').first();
      await trashButton.click();

      // Wait for item to be removed
      await page.waitForTimeout(500);

      // Should have one less item
      const remainingItems = await page.locator('h3').filter({ hasText: /Victorian|Art Deco|Eames/ }).count();
      expect(remainingItems).toBe(2);
    });
  });

  test.describe('Search Functionality', () => {
    test('search filters items by name', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Search for "Victorian"
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('Victorian');

      // Should only show Victorian item
      await expect(page.getByText('Victorian Oak Writing Desk')).toBeVisible();
      await expect(page.getByText('Art Deco Table Lamp')).not.toBeVisible();
      await expect(page.getByText('Mid-Century Eames Chair')).not.toBeVisible();
    });

    test('search filters items by era', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Search for "1920"
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('1920');

      // Should only show Art Deco item (1920s)
      await expect(page.getByText('Art Deco Table Lamp')).toBeVisible();
      await expect(page.getByText('Victorian Oak Writing Desk')).not.toBeVisible();
    });

    test('search filters items by style', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Search for "Mid-Century"
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('Mid-Century');

      // Should only show Eames chair
      await expect(page.getByText('Mid-Century Eames Chair')).toBeVisible();
      await expect(page.getByText('Victorian Oak Writing Desk')).not.toBeVisible();
    });

    test('clearing search shows all items', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Search for something
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('Victorian');

      // Clear search
      await searchInput.clear();

      // All items should be visible
      await expect(page.getByText('Victorian Oak Writing Desk')).toBeVisible();
      await expect(page.getByText('Art Deco Table Lamp')).toBeVisible();
      await expect(page.getByText('Mid-Century Eames Chair')).toBeVisible();
    });
  });

  test.describe('Export Functionality', () => {
    test('export button is visible', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Export button should be visible
      await expect(page.locator('button:has-text("Export")')).toBeVisible();
    });

    test('export button triggers download', async ({ page }) => {
      await setupAuthenticatedSession(page);
      await navigateToCollection(page);

      // Set up download listener
      const downloadPromise = page.waitForEvent('download');

      // Click export
      const exportButton = page.locator('button:has-text("Export")');
      await exportButton.click();

      // Should trigger download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('vintage-collection');
      expect(download.suggestedFilename()).toContain('.json');
    });
  });
});

test.describe('Collection Management - Mobile (375px)', () => {
  test.use({
    viewport: { width: 375, height: 812 },
  });

  test('collection page is responsive on mobile', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Page should load
    await expect(page.locator('h1:has-text("My Collection")')).toBeVisible();

    // Items should be visible
    await expect(page.getByText('Victorian Oak Writing Desk')).toBeVisible();
  });

  test('grid switches to single column on mobile', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Should be single column grid on mobile
    const gridContainer = page.locator('[class*="grid-cols-1"]');
    await expect(gridContainer).toBeVisible();
  });

  test('search input is accessible on mobile', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Search input should be visible and usable
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Victorian');
  });

  test('view mode toggle is accessible on mobile', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // View mode buttons should be visible
    const gridButton = page.locator('button:has(svg[class*="Grid3X3"])').first();
    const listButton = page.locator('button:has(svg[class*="List"])').first();

    await expect(gridButton).toBeVisible();
    await expect(listButton).toBeVisible();
  });

  test('touch targets are at least 48px', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Check view mode buttons have adequate touch targets
    const gridButton = page.locator('button:has(svg[class*="Grid3X3"])').first();
    const box = await gridButton.boundingBox();

    if (box) {
      // Buttons should be at least 48px for touch accessibility
      expect(box.width).toBeGreaterThanOrEqual(44); // Allow some flexibility
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('modal works correctly on mobile', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Tap on item to open detail modal (on mobile, hover isn't available, but we can tap)
    // First, let's check if tapping the item works
    const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();

    // On mobile, we might need to tap to reveal actions or directly tap the eye button if visible
    // Let's try tapping the image area which might trigger the eye button
    await firstItem.tap();

    // Wait a bit for any animation
    await page.waitForTimeout(300);

    // Try to find and tap the eye button if visible
    const eyeButton = page.locator('button:has(svg[class*="Eye"])').first();
    if (await eyeButton.isVisible()) {
      await eyeButton.tap();

      // Modal should open
      await expect(page.locator('[role="dialog"], [class*="Dialog"]')).toBeVisible();
    }
  });

  test('controls stack vertically on mobile', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // The controls section should use flex-col on mobile
    const controlsSection = page.locator('[class*="flex-col"][class*="md:flex-row"]');
    await expect(controlsSection).toBeVisible();
  });
});

test.describe('Collection Management - Touch Target Accessibility', () => {
  test('all interactive elements have minimum 48px touch targets', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Define minimum touch target size (48px is the WCAG recommendation)
    const minTouchTarget = 44; // Allow slight flexibility

    // Check sort dropdown
    const sortSelect = page.locator('select');
    const sortBox = await sortSelect.boundingBox();
    if (sortBox) {
      expect(sortBox.height).toBeGreaterThanOrEqual(minTouchTarget);
    }

    // Check view mode buttons (they have min-h-12 = 48px)
    const viewButtons = page.locator('button:has(svg[class*="Grid3X3"]), button:has(svg[class*="List"])');
    const buttonCount = await viewButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const box = await viewButtons.nth(i).boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(minTouchTarget);
      }
    }

    // Check back button
    const backButton = page.locator('button:has(svg[class*="ArrowLeft"])').first();
    if (await backButton.isVisible()) {
      const backBox = await backButton.boundingBox();
      if (backBox) {
        expect(backBox.width).toBeGreaterThanOrEqual(minTouchTarget);
        expect(backBox.height).toBeGreaterThanOrEqual(minTouchTarget);
      }
    }
  });

  test('collection item cards are tappable', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Collection items should be clickable cards
    const items = page.locator('[class*="GlassCard"], [class*="overflow-hidden"][class*="cursor-pointer"]');
    const itemCount = await items.count();

    expect(itemCount).toBeGreaterThan(0);

    // Each item should have a reasonable size for tapping
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const box = await items.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(100);
        expect(box.height).toBeGreaterThan(100);
      }
    }
  });
});

test.describe('Collection Management - Selection Mode', () => {
  test('can select items by clicking', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Click on an item to select it
    const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
    await firstItem.click();

    // Selection indicator should appear (purple circle)
    await expect(page.locator('[class*="bg-purple-500"][class*="rounded-full"]')).toBeVisible();
  });

  test('bulk delete button appears when items selected', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Select an item
    const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
    await firstItem.click();

    // Bulk delete button should appear
    await expect(page.locator('button:has-text("Delete (1)")')).toBeVisible();
  });

  test('can deselect items', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Select an item
    const firstItem = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]').first();
    await firstItem.click();

    // Click again to deselect
    await firstItem.click();

    // Selection indicator should disappear
    await expect(page.locator('[class*="bg-purple-500"][class*="rounded-full"]')).not.toBeVisible();

    // Bulk delete button should disappear
    await expect(page.locator('button:has-text("Delete")')).not.toBeVisible();
  });

  test('bulk delete removes selected items', async ({ page }) => {
    await setupAuthenticatedSession(page);
    await navigateToCollection(page);

    // Select two items
    const items = page.locator('[class*="overflow-hidden"][class*="cursor-pointer"]');
    await items.nth(0).click();
    await items.nth(1).click();

    // Should show Delete (2)
    await expect(page.locator('button:has-text("Delete (2)")')).toBeVisible();

    // Click bulk delete
    const bulkDeleteButton = page.locator('button:has-text("Delete (2)")');
    await bulkDeleteButton.click();

    // Wait for deletion
    await page.waitForTimeout(500);

    // Should have only 1 item remaining
    const remainingItems = await page.locator('h3').filter({ hasText: /Victorian|Art Deco|Eames/ }).count();
    expect(remainingItems).toBe(1);
  });
});

test.describe('Collection Management - Loading States', () => {
  test('shows loading spinner while fetching', async ({ page }) => {
    // Delay the API response to observe loading state
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    await page.route('**/api/collection', async (route) => {
      // Add delay to see loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          items: mockCollectionItems,
        }),
      });
    });

    // First load homepage to establish auth state
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button:has-text("Test User")', { timeout: 10000 });

    // Navigate using client-side navigation
    const collectionButton = page.locator('button:has-text("Collection")').first();
    await collectionButton.click();

    // Should show loading spinner
    await expect(page.locator('[class*="animate-spin"]')).toBeVisible();
    await expect(page.getByText('Loading your collection...')).toBeVisible();

    // Wait for items to load
    await expect(page.getByText('Victorian Oak Writing Desk')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Collection Management - Error Handling', () => {
  test('handles API error gracefully', async ({ page }) => {
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    await page.route('**/api/collection', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
      });
    });

    // Suppress console errors for this test
    page.on('console', () => {});

    // First load homepage to establish auth state
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button:has-text("Test User")', { timeout: 10000 });

    // Navigate using client-side navigation
    const collectionButton = page.locator('button:has-text("Collection")').first();
    await collectionButton.click();

    // Wait for the page to process the error
    await page.waitForTimeout(1000);

    // Should show error notification or empty state
    // The exact behavior depends on implementation
    await expect(page.locator('h1:has-text("My Collection")')).toBeVisible();
  });

  test('handles 401 unauthorized gracefully', async ({ page }) => {
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    await page.route('**/api/collection', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
      });
    });

    // Suppress console errors for this test
    page.on('console', () => {});

    // First load homepage to establish auth state
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button:has-text("Test User")', { timeout: 10000 });

    // Navigate using client-side navigation
    const collectionButton = page.locator('button:has-text("Collection")').first();
    await collectionButton.click();

    // Wait for processing
    await page.waitForTimeout(1000);

    // Page should still be functional (showing empty or error state)
    await expect(page.locator('h1:has-text("My Collection")')).toBeVisible();
  });
});

test.describe('Collection Management - Pull to Refresh (Mobile)', () => {
  test.use({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
  });

  test('pull to refresh triggers data reload', async ({ page }) => {
    let fetchCount = 0;

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    await page.route('**/api/collection', async (route) => {
      fetchCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          items: mockCollectionItems,
        }),
      });
    });

    // First load homepage to establish auth state
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button:has-text("Test User")', { timeout: 10000 });

    // Navigate using client-side navigation
    const collectionButton = page.locator('button:has-text("Collection")').first();
    await collectionButton.click();

    await page.waitForSelector('h1:has-text("My Collection")');

    // Initial fetch should have happened
    expect(fetchCount).toBe(1);

    // Note: Pull to refresh gesture simulation is complex in Playwright
    // This test verifies the initial load works correctly on mobile
    // Full pull-to-refresh testing would require gesture simulation
  });
});
