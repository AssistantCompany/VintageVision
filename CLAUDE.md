# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Organization Standards

This project follows the shared development standards.

### Quick Links
- [Development Standards](../../docs/dev/README.md) - Main navigation
- [Glossary](../../docs/dev/definitions/glossary.md) - Terminology definitions
- [PR Workflow](../../docs/dev/standards/pull-request-workflow.md) - How to create PRs
- [Defect Workflow](../../docs/dev/standards/defect-workflow.md) - How to fix bugs
- [Git Workflow](../../docs/dev/standards/git-workflow.md) - Branch and commit conventions

### Key Principles
- One branch = one PR = one unit of work
- PR is the container for changes, not the problem itself
- Follow defect workflow for bug fixes
- Follow PR workflow for features and tasks
- Use consistent terminology from the glossary

---

## Build & Development Commands

### Backend (Node.js + Hono)
```bash
cd backend
npm run dev          # Development with hot reload (tsx watch)
npm run build        # TypeScript compilation
npm run typecheck    # Type checking without emit
npm run start        # Run compiled JS
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev          # Vite dev server
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Docker (Production)
```bash
docker compose up -d                           # Start all services
docker compose build api && docker compose up -d api  # Rebuild API only
docker compose logs api --tail 50 -f           # Follow API logs
docker compose down                            # Stop all services
```

### Log Management
```bash
./scripts/logs/log-manager.sh export   # Export today's logs
./scripts/logs/log-manager.sh status   # Show log storage stats
```

## Architecture

### Request Flow
```
Traefik (HTTPS) → Frontend (Nginx/React) → API (Hono) → PostgreSQL/Redis/MinIO
                                             ↓
                                        OpenAI GPT-5.2
```

### Backend Structure (`backend/src/`)
- **`index.ts`** - Main server, OAuth routes, middleware setup
- **`config/env.ts`** - Environment validation with Zod
- **`utils/logger.ts`** - Structured logging with LOG_LEVEL/DEBUG toggle
- **`db/schema.ts`** - Drizzle ORM schema (PostgreSQL)
- **`db/client.ts`** - Database connection pool
- **`services/openai.ts`** - GPT-5.2 Vision analysis pipeline (triage → evidence → identification → synthesis)
- **`services/session.ts`** - Redis session management
- **`services/auth.ts`** - User creation/lookup
- **`storage/client.ts`** - MinIO S3 client for image storage
- **`middleware/auth.ts`** - Session validation middleware
- **`middleware/error.ts`** - Global error handler
- **`routes/*.ts`** - API route handlers

### OpenAI Analysis Pipeline (`services/openai.ts`)
The analysis runs in 4 sequential stages using GPT-5.2 Vision:
1. **Triage** - Quick categorization, domain expert assignment, visible text extraction
2. **Evidence** - Detailed evidence gathering with confidence scoring
3. **Identification** - Final identification with maker attribution
4. **Synthesis** - Combine all stages into final `ItemAnalysis` response

Each stage uses Zod schemas for structured output parsing.

### Frontend Structure (`frontend/src/`)
- **`components/enhanced/`** - Main UI components (PremiumAnalysisResult, AuthenticationWizard, etc.)
- **`components/ui/`** - Reusable UI primitives (GlassCard, etc.)
- **`hooks/useVintageAnalysis.ts`** - Analysis API hook
- **`types/index.ts`** - TypeScript interfaces matching backend responses
- **`lib/api.ts`** - API client with auth handling

### Database Schema (Drizzle ORM)
Key tables in `backend/src/db/schema.ts`:
- `users` - Google OAuth users
- `item_analyses` - AI analysis results with authentication fields
- `collection_items` - User's saved items
- `marketplace_links` - Generated shopping links

## Debug Mode

Edit `.env`:
```bash
LOG_LEVEL=debug   # debug | info | warn | error
DEBUG=true        # Enables verbose logging
```
Then restart: `docker compose up -d api`

## Key Environment Variables

| Variable | Purpose |
|----------|---------|
| `LOG_LEVEL` | Logging verbosity |
| `DEBUG` | Enable verbose debug output |
| `OPENAI_API_KEY` | GPT-5.2 Vision API |
| `GOOGLE_CLIENT_ID/SECRET` | OAuth credentials |
| `DATABASE_URL` | PostgreSQL connection |
| `REDIS_URL` | Session store |
| `MINIO_*` | S3-compatible storage |

## OAuth Flow

Manual implementation in `index.ts` (not using @hono/oauth-providers):
- `GET /api/auth/google` - Initiates OAuth OR handles callback (checks for `code` param)
- `GET /api/auth/debug` - Shows current OAuth config for troubleshooting
- Redirect URI: `https://vintagevision.space/api/auth/google`

---

## E2E Testing (Playwright)

### Running Tests
```bash
npx playwright test --config=playwright.config.ts --project=chromium --reporter=line
```

### Test Files
- `tests/e2e/analysis.spec.ts` - Analysis flow and result tabs
- `tests/e2e/authentication.spec.ts` - OAuth and session management
- `tests/e2e/collection.spec.ts` - Collection CRUD operations
- `tests/e2e/wishlist-preferences.spec.ts` - Wishlist and settings

### Critical Patterns (Lessons Learned)

#### Auth Race Condition
**Problem:** Protected routes redirect before auth state loads when using `page.goto()`.

**Solution:** Use client-side navigation (click links) instead of `page.goto()` for protected routes:
```typescript
// BAD - causes full page reload, loses React state
await page.goto('/collection');

// GOOD - preserves React context and auth state
await page.locator('button:has-text("Collection")').click();
```

#### Headless UI Tab Selectors
**Problem:** Headless UI Tab components use `role="tab"` not `role="button"`.
```typescript
// BAD
await page.getByRole('button', { name: /evidence/i }).click();

// GOOD
await page.getByRole('tab', { name: /evidence/i }).click();
```

#### Strict Mode Violations
**Problem:** Selectors matching multiple elements fail in strict mode.
```typescript
// BAD - matches multiple elements
await expect(page.getByText(/moderate/i)).toBeVisible();

// GOOD - use .first() or more specific locator
await expect(page.getByText('Moderate').first()).toBeVisible();
```

#### Mock Data Alignment
Ensure mock data values match what tests expect:
- `estimatedValueMin: 1500` (not 150000) for "$1,500" display

### GitHub Issue Tracking
E2E test issues tracked at: https://github.com/AssistantCompany/VintageVision/issues/1
