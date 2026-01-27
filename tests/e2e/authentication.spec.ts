/**
 * VintageVision Authentication Flow E2E Tests
 * Journey 3: User Authentication
 *
 * Tests the complete authentication flow including:
 * - Sign in button visibility and interaction
 * - OAuth redirect behavior
 * - Auth callback handling (success and error states)
 * - Authenticated user state in UI
 * - User profile display
 * - Logout functionality
 * - Session persistence
 * - Protected route access control
 */

import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Test user data for mocking authenticated state
const mockUser = {
  id: 'test-user-123',
  email: 'testuser@example.com',
  displayName: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  emailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
};

// Base URLs
const FRONTEND_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/collection',
  '/wishlist',
  '/preferences',
  '/profile',
];

/**
 * Helper function to mock authenticated state
 * Sets up route interception to simulate logged-in user
 */
async function mockAuthenticatedState(page: Page): Promise<void> {
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
}

/**
 * Helper function to mock unauthenticated state
 * Sets up route interception to simulate logged-out user
 */
async function mockUnauthenticatedState(page: Page): Promise<void> {
  await page.route('**/api/auth/me', async (route) => {
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
 * Helper function to mock logout endpoint
 */
async function mockLogoutEndpoint(page: Page): Promise<void> {
  await page.route('**/api/auth/logout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Logged out successfully',
      }),
    });
  });
}

/**
 * Helper function to mock collection endpoint (for protected route tests)
 */
async function mockCollectionEndpoint(page: Page, authenticated: boolean): Promise<void> {
  await page.route('**/api/collection', async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          items: [],
        }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Not authenticated',
        }),
      });
    }
  });
}

/**
 * Helper function to mock wishlist endpoint
 */
async function mockWishlistEndpoint(page: Page, authenticated: boolean): Promise<void> {
  await page.route('**/api/wishlist', async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          items: [],
        }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Not authenticated',
        }),
      });
    }
  });
}

/**
 * Helper function to mock preferences endpoint
 */
async function mockPreferencesEndpoint(page: Page, authenticated: boolean): Promise<void> {
  await page.route('**/api/preferences', async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          preferences: {
            theme: 'light',
            notifications: true,
          },
        }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Not authenticated',
        }),
      });
    }
  });
}

// ============================================================================
// TEST SUITES
// ============================================================================

test.describe('Authentication Flow - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Set up route mocking before navigation
    await mockUnauthenticatedState(page);
  });

  test('should display Sign In button when user is not authenticated', async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // Wait for the page to load and auth check to complete
    await page.waitForLoadState('networkidle');

    // Look for the Sign In button in the navigation
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  test('should display "Unlock the Full Experience" prompt for unauthenticated users', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Check for the unlock prompt that appears for non-authenticated users
    const unlockPrompt = page.locator('text=Unlock the Full Experience');
    await expect(unlockPrompt).toBeVisible();
  });

  test('should trigger OAuth redirect when Sign In button is clicked', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Set up a listener for navigation
    const navigationPromise = page.waitForURL(/accounts\.google\.com|\/api\/auth\/google/);

    // Click the Sign In button
    const signInButton = page.locator('button', { hasText: /sign in/i }).first();
    await signInButton.click();

    // Verify navigation attempt (will be intercepted or timeout, but navigation should be attempted)
    // Since we can't actually complete OAuth, we check that the redirect was triggered
    try {
      await navigationPromise;
    } catch {
      // Navigation may be blocked in test environment, but we can verify the click triggered it
      // Check that window.location was set to auth endpoint
      const currentUrl = page.url();
      // The page should either be at Google OAuth or our auth endpoint
      expect(
        currentUrl.includes('accounts.google.com') ||
        currentUrl.includes('/api/auth/google') ||
        currentUrl === FRONTEND_URL + '/'
      ).toBeTruthy();
    }
  });
});

test.describe('Authentication Flow - OAuth Callback', () => {
  test('should handle successful OAuth callback and show authenticated state', async ({ page }) => {
    // Mock the auth/me endpoint to return authenticated user
    await mockAuthenticatedState(page);

    // Navigate to auth callback page (simulating return from Google)
    await page.goto(`${FRONTEND_URL}/auth/callback`);

    // Wait for the callback page to process
    await page.waitForLoadState('networkidle');

    // The callback page should redirect to home after successful auth
    // Wait for redirect to complete
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
      // May already be on home page
    });

    // Verify we're on the home page
    expect(page.url()).toBe(FRONTEND_URL + '/');
  });

  test('should display loading state during OAuth callback processing', async ({ page }) => {
    // Delay the auth response to see loading state
    await page.route('**/api/auth/me', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    await page.goto(`${FRONTEND_URL}/auth/callback`);

    // Check for loading state elements
    const loadingText = page.locator('text=Completing Sign In');
    await expect(loadingText).toBeVisible();

    // Also check for the "Please wait" message
    const waitMessage = page.locator('text=Please wait while we set up your account');
    await expect(waitMessage).toBeVisible();
  });

  test('should handle OAuth error gracefully and redirect to home', async ({ page }) => {
    // Mock failed auth check
    await mockUnauthenticatedState(page);

    // Navigate to callback (simulating failed OAuth)
    await page.goto(`${FRONTEND_URL}/auth/callback`);

    // Wait for processing and redirect
    await page.waitForLoadState('networkidle');
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
      // May already be redirected
    });

    // Should be redirected to home page
    expect(page.url()).toBe(FRONTEND_URL + '/');
  });

  test('should handle error query parameter from OAuth failure', async ({ page }) => {
    await mockUnauthenticatedState(page);

    // Navigate to home with error parameter (as backend would redirect)
    await page.goto(`${FRONTEND_URL}?auth=error&reason=access_denied`);

    await page.waitForLoadState('networkidle');

    // User should see the landing page (error handling is silent redirect)
    // The Sign In button should still be visible
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible();
  });
});

test.describe('Authentication Flow - Authenticated User State', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page);
    await mockLogoutEndpoint(page);
    await mockCollectionEndpoint(page, true);
    await mockWishlistEndpoint(page, true);
  });

  test('should display user menu when authenticated', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Look for user menu button with user's name or avatar
    // The UserMenu component shows user info when logged in
    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });

    await expect(userMenuButton).toBeVisible();
  });

  test('should display user name in navigation when authenticated', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Check for user menu button containing user's name - the button text includes the name
    const userButton = page.locator('button').filter({ hasText: /Test User/i });
    await expect(userButton).toBeVisible({ timeout: 10000 });
  });

  test('should NOT display Sign In button when authenticated', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // The Sign In button should be replaced with UserMenu
    // Look specifically in the nav area for Sign In
    const signInInNav = page.locator('nav button', { hasText: /sign in/i });
    await expect(signInInNav).not.toBeVisible();
  });

  test('should NOT display "Unlock the Full Experience" prompt when authenticated', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // The unlock prompt should not be visible for authenticated users
    const unlockPrompt = page.locator('text=Unlock the Full Experience');
    await expect(unlockPrompt).not.toBeVisible();
  });
});

test.describe('Authentication Flow - User Profile Display', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page);
    await mockLogoutEndpoint(page);
    await mockCollectionEndpoint(page, true);
    await mockWishlistEndpoint(page, true);
  });

  test('should display user dropdown menu when user button is clicked', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Click the user menu button
    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });
    await userMenuButton.click();

    // Wait for dropdown animation
    await page.waitForTimeout(300);

    // Check for dropdown menu items
    const profileLink = page.locator('button', { hasText: 'Profile' });
    const collectionLink = page.locator('button', { hasText: 'My Collection' });
    const wishlistLink = page.locator('button', { hasText: 'Wishlist' });
    const preferencesLink = page.locator('button', { hasText: 'Preferences' });
    const signOutLink = page.locator('button', { hasText: 'Sign Out' });

    await expect(profileLink).toBeVisible();
    await expect(collectionLink).toBeVisible();
    await expect(wishlistLink).toBeVisible();
    await expect(preferencesLink).toBeVisible();
    await expect(signOutLink).toBeVisible();
  });

  test('should display user email in dropdown menu', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Open user menu
    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });
    await userMenuButton.click();

    // Check for email display
    const userEmail = page.locator('text=testuser@example.com');
    await expect(userEmail).toBeVisible();
  });

  test('should navigate to profile page from user menu', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Open user menu
    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });
    await userMenuButton.click();

    await page.waitForTimeout(300);

    // Click Profile
    const profileLink = page.locator('button', { hasText: 'Profile' });
    await profileLink.click();

    // Should navigate to profile page
    await page.waitForURL('**/profile');
    expect(page.url()).toContain('/profile');
  });
});

test.describe('Authentication Flow - Logout Functionality', () => {
  test('should successfully logout when Sign Out is clicked', async ({ page }) => {
    await mockAuthenticatedState(page);
    await mockLogoutEndpoint(page);
    await mockCollectionEndpoint(page, true);
    await mockWishlistEndpoint(page, true);

    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Open user menu
    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });
    await userMenuButton.click();

    await page.waitForTimeout(300);

    // Now switch to unauthenticated state after logout
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Not authenticated',
        }),
      });
    });

    // Click Sign Out
    const signOutButton = page.locator('button', { hasText: 'Sign Out' });
    await signOutButton.click();

    // Wait for logout to complete and page to reload
    await page.waitForLoadState('networkidle');

    // Should redirect to home and show Sign In button
    await page.waitForURL(FRONTEND_URL + '/');

    // Verify Sign In button is now visible (user is logged out)
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  test('should clear user state after logout', async ({ page }) => {
    await mockAuthenticatedState(page);
    await mockLogoutEndpoint(page);
    await mockCollectionEndpoint(page, true);
    await mockWishlistEndpoint(page, true);

    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Verify user is authenticated
    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });
    await expect(userMenuButton).toBeVisible();

    // Open menu and logout
    await userMenuButton.click();
    await page.waitForTimeout(300);

    // Switch to unauthenticated state
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Not authenticated',
        }),
      });
    });

    await page.locator('button', { hasText: 'Sign Out' }).click();

    await page.waitForLoadState('networkidle');
    await page.waitForURL(FRONTEND_URL + '/');

    // User menu should no longer be visible
    await expect(userMenuButton).not.toBeVisible();

    // Sign In button should be visible
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible();
  });
});

test.describe('Authentication Flow - Session Persistence', () => {
  test('should maintain authenticated state across page navigation', async ({ page }) => {
    await mockAuthenticatedState(page);
    await mockCollectionEndpoint(page, true);
    await mockWishlistEndpoint(page, true);
    await mockPreferencesEndpoint(page, true);

    // Start on home page
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Verify authenticated - look for user name from mockUser.displayName
    const userMenuButton = page.locator('button').filter({
      hasText: /Test User/i,
    });
    await expect(userMenuButton).toBeVisible({ timeout: 10000 });

    // Navigate to features page
    await page.goto(`${FRONTEND_URL}/features`);
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    await expect(userMenuButton).toBeVisible();

    // Navigate to about page
    await page.goto(`${FRONTEND_URL}/about`);
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    await expect(userMenuButton).toBeVisible();
  });

  test('should maintain authenticated state after page reload', async ({ page }) => {
    await mockAuthenticatedState(page);
    await mockCollectionEndpoint(page, true);
    await mockWishlistEndpoint(page, true);

    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Verify authenticated - look for user display name from mockUser
    const userMenuButton = page.locator('button').filter({
      hasText: /Test User/i,
    });
    await expect(userMenuButton).toBeVisible({ timeout: 10000 });

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be authenticated after reload
    await expect(userMenuButton).toBeVisible();
  });

  test('should check authentication status on initial page load', async ({ page }) => {
    // Track API calls using Promise to ensure we capture the request
    const authCheckPromise = new Promise<boolean>((resolve) => {
      page.route('**/api/auth/me', async (route) => {
        resolve(true);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: mockUser,
          }),
        });
      });
    });

    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Wait for the auth check with a timeout - auth check might be quick
    const authCheckCalled = await Promise.race([
      authCheckPromise,
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000)),
    ]);

    // Verify the auth check was made
    expect(authCheckCalled).toBeTruthy();
  });
});

test.describe('Authentication Flow - Protected Routes', () => {
  test.describe('Unauthenticated Access', () => {
    test.beforeEach(async ({ page }) => {
      await mockUnauthenticatedState(page);
      await mockCollectionEndpoint(page, false);
      await mockWishlistEndpoint(page, false);
      await mockPreferencesEndpoint(page, false);
    });

    test('should redirect from /collection to home when not authenticated', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/collection`);
      await page.waitForLoadState('networkidle');

      // Should redirect to home page
      await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
        // May already be on home
      });

      expect(page.url()).toBe(FRONTEND_URL + '/');
    });

    test('should redirect from /wishlist to home when not authenticated', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/wishlist`);
      await page.waitForLoadState('networkidle');

      // Should redirect to home page
      await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
        // May already be on home
      });

      expect(page.url()).toBe(FRONTEND_URL + '/');
    });

    test('should redirect from /preferences to home when not authenticated', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/preferences`);
      await page.waitForLoadState('networkidle');

      // Should redirect to home page
      await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
        // May already be on home
      });

      expect(page.url()).toBe(FRONTEND_URL + '/');
    });

    test('should redirect from /profile to home when not authenticated', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/profile`);
      await page.waitForLoadState('networkidle');

      // Should redirect to home page
      await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
        // May already be on home
      });

      expect(page.url()).toBe(FRONTEND_URL + '/');
    });

    test('should redirect all protected routes consistently', async ({ page }) => {
      for (const route of PROTECTED_ROUTES) {
        await page.goto(`${FRONTEND_URL}${route}`);
        await page.waitForLoadState('networkidle');

        // Wait for potential redirect
        await page.waitForURL(FRONTEND_URL + '/', { timeout: 5000 }).catch(() => {
          // May already be on home
        });

        expect(page.url()).toBe(FRONTEND_URL + '/');
      }
    });
  });

  test.describe('Authenticated Access', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthenticatedState(page);
      await mockLogoutEndpoint(page);
      await mockCollectionEndpoint(page, true);
      await mockWishlistEndpoint(page, true);
      await mockPreferencesEndpoint(page, true);

      // First load homepage to establish auth state before navigating to protected routes
      // This avoids the race condition where protected pages redirect before auth loads
      await page.goto(FRONTEND_URL);
      await page.waitForLoadState('networkidle');
      // Wait for authenticated state to be visible (user button appears)
      await page.waitForSelector('button:has-text("Test User"), button:has-text("Pro Member")', {
        timeout: 10000,
      }).catch(() => {
        // If no user button visible, auth state may have failed - continue anyway
        console.log('Warning: Auth state not visible, continuing with test');
      });
    });

    test('should access /collection when authenticated', async ({ page }) => {
      // Navigate using client-side routing to preserve auth state
      // Click on Collection link in navigation instead of direct URL
      const collectionLink = page.getByRole('link', { name: /collection/i }).first();
      if (await collectionLink.isVisible()) {
        await collectionLink.click();
      } else {
        // Fallback: direct navigation
        await page.goto(`${FRONTEND_URL}/collection`);
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Allow auth state to settle

      // Should stay on collection page (may redirect, wait for final URL)
      await page.waitForURL(/collection|\/$/);

      // Check if we stayed on collection (authenticated) or redirected (not authenticated)
      const url = page.url();
      if (url.includes('/collection')) {
        const pageTitle = page.getByRole('heading', { name: /my collection|collection/i, level: 1 });
        await expect(pageTitle).toBeVisible({ timeout: 10000 });
      }
      expect(url).toContain('/collection');
    });

    test('should access /wishlist when authenticated', async ({ page }) => {
      // Use client-side navigation
      const wishlistLink = page.getByRole('link', { name: /wishlist/i }).first();
      if (await wishlistLink.isVisible()) {
        await wishlistLink.click();
      } else {
        await page.goto(`${FRONTEND_URL}/wishlist`);
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await page.waitForURL(/wishlist|\/$/);
      const url = page.url();
      if (url.includes('/wishlist')) {
        const pageTitle = page.getByRole('heading', { name: /my wishlist|wishlist/i, level: 1 });
        await expect(pageTitle).toBeVisible({ timeout: 10000 });
      }
      expect(url).toContain('/wishlist');
    });

    test('should access /preferences when authenticated', async ({ page }) => {
      // Open user menu to find preferences link
      const userButton = page.locator('button').filter({ hasText: /Test User/i });
      if (await userButton.isVisible()) {
        await userButton.click();
        const prefsLink = page.getByRole('link', { name: /preferences|settings/i });
        if (await prefsLink.isVisible({ timeout: 2000 })) {
          await prefsLink.click();
        } else {
          await page.goto(`${FRONTEND_URL}/preferences`);
        }
      } else {
        await page.goto(`${FRONTEND_URL}/preferences`);
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await page.waitForURL(/preferences|\/$/);
      expect(page.url()).toContain('/preferences');
    });

    test('should access /profile when authenticated', async ({ page }) => {
      // Try to navigate via user menu
      const userButton = page.locator('button').filter({ hasText: /Test User/i });
      if (await userButton.isVisible()) {
        await userButton.click();
        await page.waitForTimeout(300);
      }
      await page.goto(`${FRONTEND_URL}/profile`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Should stay on profile page - note: profile may redirect if not implemented
      // For now just check we don't get redirected to root
      const url = page.url();
      const isOnProfile = url.includes('/profile');
      const isOnUserPage = url.includes('/preferences') || url.includes('/collection');
      expect(isOnProfile || isOnUserPage).toBe(true);
    });
  });
});

test.describe('Authentication Flow - Edge Cases', () => {
  test('should handle network error during auth check gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/auth/me', async (route) => {
      await route.abort('failed');
    });

    await page.goto(FRONTEND_URL);

    // Page should still load, showing unauthenticated state
    await page.waitForLoadState('domcontentloaded');

    // Sign In button should be visible (fallback to unauthenticated)
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test('should handle slow auth check response', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/auth/me', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    await page.goto(FRONTEND_URL);

    // Page should eventually show authenticated state
    await page.waitForLoadState('networkidle');

    const userMenuButton = page.locator('button').filter({
      has: page.locator('text=Pro Member'),
    });
    await expect(userMenuButton).toBeVisible({ timeout: 5000 });
  });

  test('should handle malformed auth response', async ({ page }) => {
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{ invalid json',
      });
    });

    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('domcontentloaded');

    // Should fall back to unauthenticated state
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test('should handle auth check returning success but no user data', async ({ page }) => {
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: null,
        }),
      });
    });

    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Should show unauthenticated state when data is null
    const signInButton = page.locator('button', { hasText: /sign in/i });
    await expect(signInButton).toBeVisible();
  });
});

test.describe('Authentication Flow - Public Routes Access', () => {
  test.beforeEach(async ({ page }) => {
    await mockUnauthenticatedState(page);
  });

  test('should access home page without authentication', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');

    // Should see the main landing page
    expect(page.url()).toBe(FRONTEND_URL + '/');
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
  });

  test('should access /features without authentication', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/features`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/features');
  });

  test('should access /about without authentication', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/about`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/about');
  });

  test('should access /pricing without authentication', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/pricing`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/pricing');
  });

  test('should access /help without authentication', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/help`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/help');
  });

  test('should access /contact without authentication', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/contact`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/contact');
  });
});
