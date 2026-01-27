# VintageVision System Architecture

**Last Updated:** January 2026
**Version:** 2.0

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRAEFIK REVERSE PROXY                                │
│                    (SSL/TLS, Load Balancing, Routing)                        │
│                         vintagevision.space                                  │
└────────────────┬────────────────────────────────────┬───────────────────────┘
                 │                                    │
                 ▼                                    ▼
┌────────────────────────────────┐    ┌───────────────────────────────────────┐
│       FRONTEND (Nginx)         │    │            BACKEND (Node.js)           │
│                                │    │                                        │
│  • React 18 + TypeScript       │    │  • Hono Framework                      │
│  • Vite Build                  │    │  • TypeScript                          │
│  • Tailwind CSS                │    │  • REST API + SSE                      │
│  • PWA Support                 │    │                                        │
│                                │    │  Routes:                               │
│  /                             │    │  • /api/analyze                        │
│  /analysis                     │    │  • /api/auth                           │
│  /collection                   │    │  • /api/collection                     │
│  /...                          │    │  • /api/images                         │
└────────────────────────────────┘    └───────────────┬───────────────────────┘
                                                      │
                 ┌────────────────────────────────────┼────────────────────────┐
                 │                                    │                        │
                 ▼                                    ▼                        ▼
┌────────────────────────┐    ┌────────────────────────┐    ┌─────────────────────┐
│      POSTGRESQL        │    │         REDIS          │    │       MINIO         │
│                        │    │                        │    │                     │
│  • User accounts       │    │  • Session storage     │    │  • Image storage    │
│  • Item analyses       │    │  • Rate limiting       │    │  • S3-compatible    │
│  • Collection items    │    │  • Caching             │    │                     │
│  • Analytics events    │    │                        │    │                     │
└────────────────────────┘    └────────────────────────┘    └─────────────────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                  │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │   OPENAI API     │  │  GOOGLE OAUTH    │  │  AUCTION APIs    │           │
│  │                  │  │                  │  │                  │           │
│  │  • GPT-5.2 Vision│  │  • Authentication│  │  • LiveAuctioneers│          │
│  │  • o1 Reasoning  │  │  • User info     │  │  • Invaluable    │           │
│  │                  │  │                  │  │  • eBay          │           │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Analysis Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IMAGE SUBMISSION                                     │
│                    (Single or Multi-Image)                                   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STAGE 1: SMART TRIAGE                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Categorize: antique | vintage | modern_branded | modern_generic  │    │
│  │  • Assign domain expert (15 specialists)                            │    │
│  │  • Set quality tier: museum | high | mid | low                     │    │
│  │  • Extract visible text                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   FURNITURE     │       │   CERAMICS      │       │    SILVER       │
│    EXPERT       │       │    EXPERT       │       │    EXPERT       │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 STAGE 2: EVIDENCE EXTRACTION                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Visual markers and construction details                          │    │
│  │  • Maker marks, signatures, labels                                  │    │
│  │  • Materials and techniques                                         │    │
│  │  • Condition assessment                                             │    │
│  │  • Confidence scoring for each evidence point                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│               STAGE 3: IDENTIFICATION & CANDIDATES                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Primary identification with confidence                           │    │
│  │  • Alternative candidates ranked by probability                     │    │
│  │  • Evidence FOR and AGAINST each candidate                          │    │
│  │  • Maker attribution with confidence                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STAGE 4: MARKET VALUATION                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Comparable sales research                                        │    │
│  │  • Market trend analysis                                            │    │
│  │  • Condition-adjusted pricing                                       │    │
│  │  • Deal analysis (if asking price provided)                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STAGE 5: AUTHENTICATION                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Authenticity risk assessment                                     │    │
│  │  • Known fake indicators check                                      │    │
│  │  • Verification guidance                                            │    │
│  │  • Expert referral recommendation                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 CONDITIONAL: CONSENSUS ANALYSIS                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  If triggered (low confidence, high value, auth concerns):          │    │
│  │  • Run 2-3 parallel analyses                                        │    │
│  │  • Merge results with confidence weighting                          │    │
│  │  • Optional: o1 reasoning model synthesis                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FINAL RESPONSE                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Complete ItemAnalysis object                                     │    │
│  │  • Marketplace links                                                │    │
│  │  • Escalation options (if applicable)                               │    │
│  │  • Interactive session (Vera) if confidence < 90%                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Service Architecture

```
backend/src/
├── index.ts                    # Main server entry, OAuth routes
├── config/
│   └── env.ts                 # Environment validation (Zod)
├── db/
│   ├── client.ts              # Database connection pool
│   └── schema.ts              # Drizzle ORM schema
├── middleware/
│   ├── auth.ts                # Session validation
│   └── error.ts               # Global error handler
├── routes/
│   └── analyze.ts             # Analysis + Vera endpoints
├── services/
│   ├── openai.ts              # GPT-5.2 Vision pipeline
│   ├── consensusAnalysis.ts   # Multi-run consensus
│   ├── interactiveAnalysis.ts # Vera assistant
│   ├── expertEscalation.ts    # Expert service
│   ├── marketData.ts          # Auction integrations
│   ├── selfLearning.ts        # Adaptive prompts
│   ├── auth.ts                # User management
│   └── session.ts             # Redis sessions
├── storage/
│   └── client.ts              # MinIO S3 client
├── testing/
│   ├── evaluationHarness.ts   # Ground truth testing
│   └── groundTruth.ts         # Test data
└── utils/
    └── logger.ts              # Structured logging
```

---

## Database Schema

### Core Tables

```sql
-- Users (Google OAuth)
users (
  id UUID PRIMARY KEY,
  google_id VARCHAR UNIQUE,
  email VARCHAR,
  name VARCHAR,
  picture VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Item Analyses
item_analyses (
  id UUID PRIMARY KEY,

  -- Core identification
  name VARCHAR NOT NULL,
  maker VARCHAR,
  model_number VARCHAR,
  brand VARCHAR,

  -- Categorization
  product_category VARCHAR,
  domain_expert VARCHAR,
  item_subcategory VARCHAR,

  -- Period and origin
  era VARCHAR,
  style VARCHAR,
  period_start INTEGER,
  period_end INTEGER,
  origin_region VARCHAR,

  -- Description
  description TEXT,
  historical_context TEXT,
  attribution_notes TEXT,

  -- Valuation
  estimated_value_min INTEGER,
  estimated_value_max INTEGER,
  current_retail_price INTEGER,
  comparable_sales JSONB,

  -- Confidence
  confidence NUMERIC,
  identification_confidence NUMERIC,
  maker_confidence NUMERIC,
  evidence_for JSONB,
  evidence_against JSONB,
  alternative_candidates JSONB,

  -- Verification
  verification_tips JSONB,
  red_flags JSONB,

  -- Deal analysis
  asking_price INTEGER,
  deal_rating VARCHAR,
  deal_explanation TEXT,
  profit_potential_min INTEGER,
  profit_potential_max INTEGER,

  -- Flip assessment
  flip_difficulty VARCHAR,
  flip_time_estimate VARCHAR,
  resale_channels JSONB,

  -- Authentication
  authentication_confidence NUMERIC,
  authenticity_risk VARCHAR,
  authentication_checklist JSONB,
  known_fake_indicators JSONB,
  additional_photos_requested JSONB,
  expert_referral_recommended BOOLEAN,
  expert_referral_reason TEXT,
  authentication_assessment TEXT,

  -- Storage
  image_url VARCHAR,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Collection items
collection_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  analysis_id UUID REFERENCES item_analyses,
  notes TEXT,
  created_at TIMESTAMP
)

-- Marketplace links
marketplace_links (
  id UUID PRIMARY KEY,
  item_analysis_id UUID REFERENCES item_analyses,
  marketplace_name VARCHAR,
  link_url VARCHAR,
  price_min INTEGER,
  price_max INTEGER,
  confidence_score NUMERIC
)

-- Analytics events
analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  event_type VARCHAR,
  event_data JSONB,
  created_at TIMESTAMP
)
```

---

## Domain Experts

| Expert | Specialty Areas |
|--------|-----------------|
| `furniture` | Tables, chairs, cabinets, case pieces |
| `ceramics` | Pottery, porcelain, dinnerware |
| `glass` | Art glass, Depression, Carnival |
| `silver` | Sterling, plate, hallmarks |
| `jewelry` | Rings, necklaces, period jewelry |
| `watches` | Wristwatches, pocket watches, clocks |
| `art` | Paintings, prints, photographs |
| `textiles` | Rugs, quilts, vintage clothing |
| `toys` | Antique toys, dolls, trains |
| `books` | First editions, rare books |
| `tools` | Hand tools, scientific instruments |
| `lighting` | Lamps, chandeliers, fixtures |
| `electronics` | Phones, computers, audio |
| `vehicles` | Cars, motorcycles, bicycles |
| `general` | Catch-all for other items |

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. NETWORK                                                                  │
│     • Traefik with automatic HTTPS (Let's Encrypt)                          │
│     • Docker network isolation                                               │
│     • Rate limiting at proxy level                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  2. APPLICATION                                                              │
│     • Input validation with Zod schemas                                      │
│     • Session-based authentication                                           │
│     • CORS configuration                                                     │
│     • Image type and size validation                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  3. DATA                                                                     │
│     • Environment variables for secrets                                      │
│     • No API keys in frontend                                               │
│     • Secure session storage in Redis                                       │
│     • PostgreSQL with connection pooling                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```yaml
# Docker Compose Services
services:
  traefik:      # Reverse proxy + SSL
  frontend:     # Nginx + React build
  api:          # Node.js backend
  postgres:     # Database
  redis:        # Session store
  minio:        # Object storage
```

### Resource Allocation

| Service | CPU | Memory |
|---------|-----|--------|
| api | 2 cores | 2GB |
| frontend | 0.5 cores | 256MB |
| postgres | 1 core | 1GB |
| redis | 0.5 cores | 256MB |
| minio | 0.5 cores | 512MB |

---

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Analysis time (single) | 15-25 seconds |
| Analysis time (consensus) | 30-60 seconds |
| API response (non-analysis) | < 100ms |
| Concurrent analyses | 10+ |
| Image size limit | 20MB |

---

## Monitoring Points

1. **API Health:** `/api/health`
2. **Database:** Connection pool metrics
3. **Redis:** Memory usage, hit rate
4. **OpenAI:** API latency, error rate
5. **Storage:** MinIO bucket metrics
