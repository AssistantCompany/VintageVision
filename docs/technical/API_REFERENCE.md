# VintageVision API Reference

**Last Updated:** January 2026
**Version:** 2.0
**Base URL:** `https://vintagevision.space/api`

---

## Authentication

Most endpoints support optional authentication via session cookies.

```http
Cookie: session=<session_id>
```

### OAuth Flow
```
GET /api/auth/google          → Initiate Google OAuth
GET /api/auth/google?code=... → OAuth callback
GET /api/auth/debug           → Debug OAuth configuration
POST /api/auth/logout         → End session
GET /api/auth/me              → Get current user
```

---

## Analysis Endpoints

### Analyze Image

Analyze an antique/vintage item image.

```http
POST /api/analyze
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "askingPrice": 5000,           // Optional, in cents
  "additionalContext": "Found at estate sale",
  "additionalImages": [          // Optional, for multi-image analysis
    {
      "role": "marks",
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ],
  "multiImageAnalysis": true,
  "consensusMode": "auto",       // "auto" | "always" | "never"
  "forceMultiRun": false,
  "useReasoningModel": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Gustav Stickley #354 Dining Chair",
    "maker": "Gustav Stickley",
    "modelNumber": "#354",
    "brand": null,
    "productCategory": "antique",
    "domainExpert": "furniture",
    "itemSubcategory": "seating",
    "era": "1905-1912",
    "style": "Arts & Crafts / Mission",
    "periodStart": 1905,
    "periodEnd": 1912,
    "originRegion": "New York, USA",
    "description": "...",
    "historicalContext": "...",
    "attributionNotes": "...",
    "estimatedValueMin": 250000,
    "estimatedValueMax": 400000,
    "currentRetailPrice": null,
    "comparableSales": [...],
    "confidence": 0.92,
    "identificationConfidence": 0.94,
    "makerConfidence": 0.89,
    "evidenceFor": ["Red Stickley decal visible", "Quarter-sawn oak", "..."],
    "evidenceAgainst": ["Cannot confirm branded mark"],
    "alternativeCandidates": [...],
    "verificationTips": ["Check for red decal on back leg", "..."],
    "redFlags": [],
    "askingPrice": 5000,
    "dealRating": "exceptional",
    "dealExplanation": "Asking $50 for item worth $2,500-$4,000",
    "profitPotentialMin": 245000,
    "profitPotentialMax": 395000,
    "flipDifficulty": "easy",
    "flipTimeEstimate": "2-4 weeks",
    "resaleChannels": ["1stDibs", "eBay", "Local antique dealer"],
    "authenticationConfidence": 0.88,
    "authenticityRisk": "low",
    "authenticationChecklist": [...],
    "knownFakeIndicators": [],
    "additionalPhotosRequested": ["underside", "marks"],
    "expertReferralRecommended": false,
    "imageUrl": "/api/images/...",
    "marketplaceLinks": [...]
  }
}
```

### Analyze with Streaming

Real-time progress updates via Server-Sent Events.

```http
POST /api/analyze/stream
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "askingPrice": 5000
}
```

**SSE Events:**
```
event: stage:start
data: {"type":"stage:start","stage":"triage","message":"Categorizing item...","progress":10}

event: stage:complete
data: {"type":"stage:complete","stage":"triage","progress":25}

event: complete
data: {"type":"complete","progress":100,"data":{...}}
```

### Get Analysis by ID

```http
GET /api/analyze/:id
```

---

## Vera Interactive Session Endpoints

### Get Vera Info

```http
GET /api/analyze/vera/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assistantName": "Vera",
    "title": "VintageVision Authentication Assistant",
    "greeting": "Hello! I'm Vera...",
    "style": "professional, knowledgeable, encouraging",
    "expertise": "antiques, authentication, valuation"
  }
}
```

### Start Interactive Session

```http
POST /api/analyze/:analysisId/interactive
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "vera-...",
      "analysisId": "...",
      "informationNeeds": [...],
      "conversationHistory": [...],
      "confidenceProgress": [...],
      "status": "gathering_info"
    },
    "escalation": {...},
    "assistantName": "Vera"
  }
}
```

### Get Interactive Session

```http
GET /api/analyze/interactive/:sessionId
```

### Add User Response

```http
POST /api/analyze/interactive/:sessionId/respond
Content-Type: application/json

{
  "needId": "marks-photo",
  "type": "photo",           // "photo" | "text" | "measurement" | "document"
  "content": "data:image/jpeg;base64,..."
}
```

### Trigger Reanalysis

```http
POST /api/analyze/interactive/:sessionId/reanalyze
```

---

## Collection Endpoints

### Get User Collection

```http
GET /api/collection
```

### Add to Collection

```http
POST /api/collection
Content-Type: application/json

{
  "analysisId": "uuid",
  "notes": "Optional user notes"
}
```

### Remove from Collection

```http
DELETE /api/collection/:itemId
```

---

## Image Endpoints

### Get Image

```http
GET /api/images/:imageKey
```

Returns the image file from storage.

---

## Types Reference

### ProductCategory
```typescript
type ProductCategory =
  | 'antique'          // Pre-1920
  | 'vintage'          // 1920-1980
  | 'modern_branded'   // Modern with brand
  | 'modern_generic'   // Modern unbranded
  | 'unknown';
```

### DomainExpert
```typescript
type DomainExpert =
  | 'furniture' | 'ceramics' | 'glass' | 'silver'
  | 'jewelry' | 'watches' | 'art' | 'textiles'
  | 'toys' | 'books' | 'tools' | 'lighting'
  | 'electronics' | 'vehicles' | 'general';
```

### DealRating
```typescript
type DealRating =
  | 'exceptional'  // 300%+ ROI potential
  | 'good'         // 100-300% ROI
  | 'fair'         // 0-100% ROI
  | 'overpriced';  // Negative ROI
```

### FlipDifficulty
```typescript
type FlipDifficulty =
  | 'easy'       // Quick sale, broad market
  | 'moderate'   // Needs right buyer
  | 'hard'       // Specialized market
  | 'very_hard'; // Rare/niche item
```

### AuthenticityRisk
```typescript
type AuthenticityRisk =
  | 'low'       // High confidence authentic
  | 'medium'    // Some concerns
  | 'high'      // Significant concerns
  | 'very_high';// Strong fake indicators
```

### ImageRole (for multi-image)
```typescript
type ImageRole =
  | 'overview'    // Main item view
  | 'detail'      // Close-up detail
  | 'marks'       // Maker marks/signatures
  | 'underside'   // Bottom/base view
  | 'damage'      // Damage documentation
  | 'context'     // Item in context
  | 'additional'; // Other supporting images
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `EXTERNAL_SERVICE_ERROR` | 502 | OpenAI/external API failure |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Analysis | 10/minute per user |
| Collection | 60/minute per user |
| General | 100/minute per IP |

---

## Webhooks (Future)

```http
POST /api/webhooks/register
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["analysis.complete", "expert.complete"]
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: imageDataUrl,
    askingPrice: 5000
  })
});
const { data } = await response.json();
console.log(`Identified: ${data.name} (${data.confidence * 100}%)`);
```

### cURL

```bash
curl -X POST https://vintagevision.space/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,...",
    "askingPrice": 5000
  }'
```

---

## Changelog

### v2.0 (January 2026)
- Added Vera interactive session endpoints
- Added consensus analysis options
- Added multi-image analysis support
- Added expert escalation integration

### v1.0 (January 2026)
- Initial world-class API
- Multi-stage analysis pipeline
- Deal analysis
- Authentication assessment
