# VintageVision Test Criteria & User Journeys

## Overview
Comprehensive test suite for VintageVision - AI-powered vintage item analysis platform.
Last Updated: January 2026

---

## Success Criteria

### 1. Application Health
- [ ] Frontend loads without errors
- [ ] Backend health endpoint returns 200
- [ ] Database connection healthy
- [ ] Redis session store connected
- [ ] MinIO storage accessible

### 2. Performance Benchmarks
- [ ] Landing page loads in < 3 seconds
- [ ] API responses < 5 seconds (non-analysis)
- [ ] Analysis completion < 30 seconds
- [ ] No memory leaks in 10-minute session

### 3. Accessibility
- [ ] All interactive elements have 48px minimum touch targets
- [ ] Proper ARIA labels on buttons
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA

---

## User Journeys

### Journey 1: New Visitor Discovery
**Persona:** Sarah (Estate Sale Hunter)
**Goal:** Discover app and understand value proposition

**Steps:**
1. Land on homepage (/)
2. See hero section with clear value proposition
3. View feature highlights
4. See pricing information
5. Navigate to About page
6. Navigate to Features page
7. Return to home

**Success Criteria:**
- [ ] Landing page renders fully
- [ ] All navigation links work
- [ ] Feature cards display correctly
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1280px)

### Journey 2: Guest Analysis (No Auth)
**Persona:** Marcus (Interior Designer)
**Goal:** Try the analysis feature without signing up

**Steps:**
1. Navigate to /app
2. See image upload interface
3. Upload/capture an image
4. See analysis progress
5. View analysis results
6. See prompt to save (requires auth)

**Success Criteria:**
- [ ] Upload interface renders
- [ ] Camera capture works (if available)
- [ ] File upload accepts images
- [ ] Progress indicators display
- [ ] Analysis results show:
  - [ ] Item name and description
  - [ ] Era/period identification
  - [ ] Style classification
  - [ ] Value estimate range
  - [ ] Confidence score
  - [ ] Deal rating (if asking price provided)
- [ ] Save button prompts for login

### Journey 3: User Authentication
**Persona:** Eleanor (Heirloom Curator)
**Goal:** Sign in with Google to save items

**Steps:**
1. Click "Sign In" button
2. Redirect to Google OAuth
3. Complete Google authentication
4. Redirect back to app
5. See authenticated state
6. View profile information

**Success Criteria:**
- [ ] Sign in button visible
- [ ] OAuth redirect works
- [ ] Callback handles success
- [ ] Callback handles errors gracefully
- [ ] User session persists
- [ ] User info displays correctly
- [ ] Logout works

### Journey 4: Authenticated Analysis & Save
**Persona:** Sarah (Estate Sale Hunter)
**Goal:** Analyze item and save to collection

**Steps:**
1. Sign in (if not already)
2. Navigate to /app
3. Upload image with asking price
4. View analysis with deal rating
5. Click "Save to Collection"
6. Add notes and location
7. Confirm save
8. Navigate to /collection
9. See saved item

**Success Criteria:**
- [ ] Deal rating displays when price provided
- [ ] Save dialog opens
- [ ] Notes field works
- [ ] Location field works
- [ ] Save confirmation shows
- [ ] Item appears in collection
- [ ] All item data preserved

### Journey 5: Collection Management
**Persona:** Eleanor (Heirloom Curator)
**Goal:** View, edit, and organize collection

**Steps:**
1. Navigate to /collection
2. View collection grid
3. Switch to list view
4. Sort by different criteria
5. Click eye icon to view details
6. Edit item notes
7. Delete an item
8. Confirm deletion

**Success Criteria:**
- [ ] Collection page loads
- [ ] Grid view renders correctly
- [ ] List view renders correctly
- [ ] Sort functionality works
- [ ] Detail modal opens (NEW - fixed in UI overhaul)
- [ ] Edit notes saves correctly
- [ ] Delete confirmation shows
- [ ] Item removed from list

### Journey 6: Wishlist Management
**Persona:** Marcus (Interior Designer)
**Goal:** Create search criteria and find matches

**Steps:**
1. Navigate to /wishlist
2. View existing searches
3. Add new search criteria
4. Set style preferences
5. Set price range
6. View marketplace matches
7. Delete a wishlist item

**Success Criteria:**
- [ ] Wishlist page loads
- [ ] Existing items display
- [ ] Add form works
- [ ] Style selection works
- [ ] Price range inputs work
- [ ] Matches display correctly
- [ ] Delete works

### Journey 7: User Preferences
**Persona:** All users
**Goal:** Customize app experience

**Steps:**
1. Navigate to /preferences
2. Select preferred styles
3. Select room types
4. Set budget range
5. Save preferences
6. See confirmation

**Success Criteria:**
- [ ] Preferences page loads
- [ ] Style toggle buttons work (48px touch targets)
- [ ] Room type toggles work
- [ ] Budget inputs accept numbers
- [ ] Save persists to backend
- [ ] Success notification shows

### Journey 8: Analysis Result Tabs (NEW)
**Persona:** All users
**Goal:** Navigate tabbed analysis interface

**Steps:**
1. Complete an analysis
2. View Overview tab (default)
3. Click Evidence tab
4. View evidence for/against
5. Click Value tab
6. View flip assessment & comparables
7. Click Style tab
8. View styling suggestions
9. Click Vera tab
10. See assistant options

**Success Criteria:**
- [ ] Tab navigation works
- [ ] Tab content loads correctly
- [ ] Sticky header on scroll
- [ ] Mobile responsive tabs
- [ ] All 5 tabs accessible
- [ ] Badge indicators show

### Journey 9: Mobile Experience
**Persona:** Sarah (on phone at estate sale)
**Goal:** Quick analysis on mobile device

**Steps:**
1. Load app on mobile (375px)
2. Navigate via bottom nav
3. Use camera to capture
4. View analysis (scrollable)
5. Save to collection
6. View collection

**Success Criteria:**
- [ ] Bottom navigation visible
- [ ] All touch targets >= 48px
- [ ] Content not obscured by nav
- [ ] Camera capture works
- [ ] Scrolling smooth
- [ ] No horizontal overflow

### Journey 10: Error Recovery
**Persona:** All users
**Goal:** Graceful handling of errors

**Steps:**
1. Trigger network error
2. See error state
3. Click retry
4. See recovery
5. Trigger invalid image
6. See validation error
7. Trigger server error
8. See error state with help

**Success Criteria:**
- [ ] Network errors caught
- [ ] Error state component renders
- [ ] Retry button works
- [ ] Invalid inputs show validation
- [ ] Server errors handled gracefully
- [ ] Help link available

---

## API Test Criteria

### Analysis Endpoints
- [ ] POST /api/analyze - accepts image, returns analysis
- [ ] POST /api/analyze - handles asking price
- [ ] POST /api/analyze - handles multi-image
- [ ] POST /api/analyze/stream - SSE streaming works
- [ ] GET /api/analyze/:id - retrieves saved analysis
- [ ] POST /api/analyze/:id/interactive - starts Vera session
- [ ] GET /api/analyze/vera/info - returns assistant info

### Collection Endpoints
- [ ] GET /api/collection - returns user's items (auth required)
- [ ] POST /api/collection - saves item (auth required)
- [ ] PATCH /api/collection/:id - updates item (auth required)
- [ ] DELETE /api/collection/:id - removes item (auth required)
- [ ] Unauthorized requests return 401

### Wishlist Endpoints
- [ ] GET /api/wishlist - returns user's wishlist (auth required)
- [ ] POST /api/wishlist - adds item (auth required)
- [ ] PATCH /api/wishlist/:id - updates item (auth required)
- [ ] DELETE /api/wishlist/:id - removes item (auth required)

### Preferences Endpoints
- [ ] GET /api/preferences - returns preferences (auth required)
- [ ] POST /api/preferences - saves preferences (auth required)

### Auth Endpoints
- [ ] GET /api/auth/google - initiates OAuth
- [ ] GET /api/auth/me - returns current user (auth required)
- [ ] POST /api/auth/logout - ends session (auth required)

### Health & Utility
- [ ] GET /health - returns service status
- [ ] POST /api/feedback - accepts feedback (auth required)
- [ ] POST /api/analytics - logs events
- [ ] POST /api/errors - reports errors

---

## Test Data Requirements

### Test Images
- `/test-images/vintage-chair.jpg` - Furniture test
- `/test-images/antique-clock.jpg` - Collectibles test
- `/test-images/art-deco-lamp.jpg` - Lighting test
- `/test-images/victorian-vase.jpg` - Ceramics test

### Test User
- Mock Google OAuth user for authenticated tests
- Session cookie simulation

---

## Coverage Goals

| Area | Target | Current |
|------|--------|---------|
| Frontend E2E | 100% journeys | 0% |
| Backend API | 100% endpoints | ~20% |
| Error States | 100% scenarios | 0% |
| Mobile | 100% responsive | 0% |
| Accessibility | WCAG AA | 0% |

---

## Test Execution

```bash
# Run all tests
npm run test:e2e

# Run specific suite
npm run test:e2e -- --grep "Journey 1"

# Run with UI
npm run test:e2e -- --ui

# Generate report
npm run test:e2e -- --reporter=html
```
