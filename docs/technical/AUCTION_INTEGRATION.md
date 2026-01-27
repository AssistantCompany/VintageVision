# Auction Database Integration

**Last Updated:** January 2026
**Version:** 1.0
**Status:** Production

---

## Overview

VintageVision integrates with major auction databases to provide real-time market data for accurate valuations. This enables:

- **Comparable Sales** - Recent auction results for similar items
- **Price Validation** - Cross-reference AI estimates with actual sales
- **Market Trends** - Track category and maker price movements
- **Confidence Boost** - Higher valuation accuracy with market data

---

## Integrated Sources

### 1. LiveAuctioneers

**Coverage:** 5,000+ auction houses worldwide
**Data:** Realized prices, estimates, images

```typescript
interface LiveAuctioneersResult {
  source: 'liveauctioneers';
  title: string;
  soldPrice: number;
  soldDate: string;
  auctionHouse: string;
  lotNumber: string;
  imageUrl?: string;
  categoryPath: string[];
}
```

**API Endpoint:** `https://api.liveauctioneers.com/v2/search`

### 2. Invaluable

**Coverage:** 4,000+ auction houses
**Data:** Past sales, upcoming lots, estimates

```typescript
interface InvaluableResult {
  source: 'invaluable';
  title: string;
  soldPrice: number;
  soldDate: string;
  auctionHouse: string;
  saleTitle: string;
  imageUrl?: string;
  medium?: string;
}
```

**API Endpoint:** `https://api.invaluable.com/v1/search`

### 3. eBay Sold Listings

**Coverage:** Consumer marketplace
**Data:** Completed sales, Buy It Now prices

```typescript
interface EbayResult {
  source: 'ebay';
  title: string;
  soldPrice: number;
  soldDate: string;
  condition: string;
  listingType: 'auction' | 'buy_it_now';
  imageUrl?: string;
}
```

**API:** eBay Finding API

---

## API Usage

### Search Single Source

```typescript
import { searchLiveAuctioneers, searchInvaluable, searchEbaySold } from './services/marketData';

// LiveAuctioneers
const laResults = await searchLiveAuctioneers('Gustav Stickley chair', {
  category: 'furniture',
  minPrice: 1000,
  maxPrice: 10000,
  limit: 20
});

// Invaluable
const invResults = await searchInvaluable('Meissen porcelain figurine', {
  category: 'ceramics',
  limit: 20
});

// eBay
const ebayResults = await searchEbaySold('Fiesta dinnerware red', {
  minPrice: 50,
  maxPrice: 500,
  limit: 30
});
```

### Search All Sources

```typescript
import { searchAllAuctionDatabases } from './services/marketData';

const { allResults, bySource, totalCount, sourcesQueried } = await searchAllAuctionDatabases(
  'Tiffany lamp base',
  {
    category: 'lighting',
    minPrice: 5000,
    maxPrice: 50000,
    limit: 50
  }
);

// allResults: Combined and sorted by date
// bySource: Results grouped by source with stats
// totalCount: Total matches found
// sourcesQueried: Which APIs responded
```

---

## Price Analytics

### Calculate Price Range

```typescript
import { calculatePriceRange } from './services/marketData';

const range = calculatePriceRange(soldListings);
// Returns:
// {
//   min: 1500,
//   max: 4500,
//   median: 2800,
//   average: 2950,
//   count: 15,
//   confidence: 0.85
// }
```

### Aggregated Results

```typescript
interface AggregatedAuctionResult {
  source: string;
  results: SoldListing[];
  priceRange: {
    min: number;
    max: number;
    median: number;
    average: number;
  };
  totalFound: number;
}
```

---

## Integration with Analysis Pipeline

The auction data integrates into Stage 4 (Market Valuation):

```typescript
// In openai.ts analysis pipeline
const auctionData = await searchAllAuctionDatabases(
  `${identification.maker} ${identification.name}`,
  {
    category: domainExpert,
    limit: 30
  }
);

const priceRange = calculatePriceRange(auctionData.allResults);

// Adjust AI estimate based on market data
const finalEstimate = {
  min: Math.round((aiEstimate.min + priceRange.min) / 2),
  max: Math.round((aiEstimate.max + priceRange.max) / 2),
  comparableSales: auctionData.allResults.slice(0, 5)
};
```

---

## Comparable Sales Display

Results are formatted for user display:

```json
{
  "comparableSales": [
    {
      "title": "Gustav Stickley #354 Dining Chair",
      "soldPrice": 325000,
      "soldDate": "2025-11-15",
      "source": "liveauctioneers",
      "auctionHouse": "Rago Arts and Auction"
    },
    {
      "title": "Stickley Mission Oak Chair",
      "soldPrice": 285000,
      "soldDate": "2025-10-22",
      "source": "invaluable",
      "auctionHouse": "Christie's"
    }
  ]
}
```

---

## Rate Limiting & Caching

### Rate Limits

| Source | Requests/Min | Daily Limit |
|--------|--------------|-------------|
| LiveAuctioneers | 60 | 10,000 |
| Invaluable | 30 | 5,000 |
| eBay | 100 | 25,000 |

### Caching Strategy

```typescript
// Cache configuration
const CACHE_TTL = {
  searchResults: 3600,      // 1 hour
  priceAnalytics: 86400,    // 24 hours
  trendData: 604800         // 7 days
};

// Cache key generation
const cacheKey = `auction:${source}:${hashSearchParams(params)}`;
```

---

## Error Handling

```typescript
try {
  const results = await searchAllAuctionDatabases(query);
} catch (error) {
  if (error.code === 'RATE_LIMITED') {
    // Use cached data or reduce request rate
  } else if (error.code === 'API_UNAVAILABLE') {
    // Continue with available sources
    console.log(`${error.source} unavailable, using ${error.availableSources.length} sources`);
  }
}
```

---

## Data Quality

### Filtering

Results are filtered for relevance:
- Price within reasonable range (10x min/max)
- Date within 2 years
- Category match when specified
- Title relevance scoring

### Normalization

Prices are normalized to USD cents:
- Currency conversion for international auctions
- Buyer's premium calculation
- Tax handling varies by jurisdiction

---

## Configuration

```typescript
// Environment variables
LIVEAUCTIONEERS_API_KEY=xxx
INVALUABLE_API_KEY=xxx
EBAY_APP_ID=xxx
EBAY_CERT_ID=xxx

// Service configuration
const config = {
  sources: ['liveauctioneers', 'invaluable', 'ebay'],
  defaultLimit: 20,
  maxLimit: 100,
  cacheEnabled: true,
  fallbackToCache: true
};
```

---

## Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/services/marketData.ts` | API integrations |
| `backend/src/services/openai.ts` | Pipeline integration |

---

## Future Enhancements

- [ ] Sotheby's API integration
- [ ] Christie's API integration
- [ ] Heritage Auctions integration
- [ ] Real-time price alerts
- [ ] Historical trend charts
- [ ] Category-specific APIs (PCGS for coins, etc.)
- [ ] Price prediction models
