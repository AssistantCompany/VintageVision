# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
