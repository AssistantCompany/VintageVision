# Ground Truth Evaluation System

**Last Updated:** January 2026
**Version:** 1.0
**Status:** Production

---

## Overview

The Evaluation System provides automated accuracy measurement against a curated ground truth dataset. This enables:

- **Regression Testing** - Catch accuracy drops before deployment
- **Model Comparison** - Compare prompt/model changes
- **Category Analysis** - Identify weak domains
- **Continuous Improvement** - Track progress over time

---

## Test Battery

### Composition

50 curated items across 11 categories:

| Category | Items | Coverage |
|----------|-------|----------|
| Furniture | 10 | Chairs, tables, case pieces, various periods |
| Ceramics | 8 | American pottery, European porcelain, marks |
| Art | 6 | Paintings, prints, photographs |
| Jewelry | 6 | Period jewelry, costume, hallmarks |
| Silver | 5 | Sterling, plate, English hallmarks |
| Glass | 4 | Art glass, Depression, Carnival |
| Textiles | 3 | Rugs, quilts, clothing |
| Toys | 4 | Cast iron, tin, trains, dolls |
| Lighting | 2 | Tiffany, Handel |
| Books | 2 | First editions, rare books |

### Difficulty Distribution

- **Easy:** 15 items (clear identification, common makers)
- **Medium:** 25 items (requires specialist knowledge)
- **Hard:** 10 items (rare items, authentication challenges)

---

## Ground Truth Structure

```typescript
interface GroundTruthItem {
  id: string;
  imageUrl: string;
  imageDescription: string;
  expected: {
    name: string;
    nameKeywords: string[];      // Alternative acceptable terms
    maker: string | null;
    makerAlternatives?: string[];
    era: string;
    eraRange: { start: number; end: number };
    style: string;
    estimatedValueMin: number;   // In cents
    estimatedValueMax: number;
    productCategory: string;
    domainExpert: string;
    authenticityRisk: string;
  };
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    testReason: string;          // Why this item was included
  };
}
```

### Example Entry

```typescript
{
  id: 'furn-001',
  imageUrl: 'https://upload.wikimedia.org/...',
  imageDescription: 'Eames Lounge Chair and Ottoman',
  expected: {
    name: 'Eames Lounge Chair and Ottoman',
    nameKeywords: ['eames', 'lounge', 'chair', 'ottoman', '670', '671', 'herman miller'],
    maker: 'Herman Miller',
    makerAlternatives: ['Charles and Ray Eames', 'Eames'],
    era: '1956-present',
    eraRange: { start: 1956, end: 2026 },
    style: 'Mid-Century Modern',
    estimatedValueMin: 300000,   // $3,000
    estimatedValueMax: 800000,   // $8,000
    productCategory: 'modern_generic',
    domainExpert: 'furniture',
    authenticityRisk: 'medium'
  },
  metadata: {
    difficulty: 'easy',
    testReason: 'Tests iconic modern furniture identification'
  }
}
```

---

## Scoring Algorithm

### Component Weights

| Component | Weight | Description |
|-----------|--------|-------------|
| **Name Match** | 70% | Primary identification |
| **Maker Match** | 10% | Attribution accuracy |
| **Era Match** | 10% | Dating accuracy |
| **Value Match** | 10% | Valuation accuracy |

### Name Matching

Uses fuzzy matching with keyword support:

```typescript
function calculateNameScore(actual: string, expected: string, keywords: string[]): number {
  // Direct match: 100%
  if (normalize(actual) === normalize(expected)) return 1.0;

  // Keyword matching
  const actualLower = actual.toLowerCase();
  const keywordMatches = keywords.filter(k => actualLower.includes(k.toLowerCase()));
  const keywordScore = keywordMatches.length / keywords.length;

  // Fuzzy similarity
  const fuzzyScore = stringSimilarity(actual, expected);

  // Best of keyword or fuzzy
  return Math.max(keywordScore, fuzzyScore);
}
```

### Era Matching

Compares date ranges with tolerance:

```typescript
function calculateEraScore(
  actualEra: string,
  expectedRange: { start: number; end: number }
): number {
  const [actualStart, actualEnd] = parseEraRange(actualEra);

  // Check overlap
  const overlap = Math.min(actualEnd, expectedRange.end) -
                  Math.max(actualStart, expectedRange.start);
  const totalRange = expectedRange.end - expectedRange.start;

  return Math.max(0, overlap / totalRange);
}
```

### Value Matching

Checks if estimate overlaps with expected range:

```typescript
function calculateValueScore(
  actualMin: number,
  actualMax: number,
  expectedMin: number,
  expectedMax: number
): number {
  // Perfect overlap
  if (actualMin <= expectedMin && actualMax >= expectedMax) return 1.0;

  // Partial overlap
  const overlapMin = Math.max(actualMin, expectedMin);
  const overlapMax = Math.min(actualMax, expectedMax);

  if (overlapMin <= overlapMax) {
    const overlapRange = overlapMax - overlapMin;
    const expectedRange = expectedMax - expectedMin;
    return overlapRange / expectedRange;
  }

  // No overlap - penalize by distance
  const distance = overlapMin > expectedMax
    ? overlapMin - expectedMax
    : expectedMin - overlapMax;
  return Math.max(0, 1 - distance / expectedMax);
}
```

---

## Running Evaluations

### Full Evaluation

```bash
cd backend
npx tsx src/testing/evaluationHarness.ts
```

### Output

```
================================================================================
VINTAGEVISION EVALUATION HARNESS
================================================================================

[2026-01-18T15:41:06.085Z] INFO  Testing item: furn-001 - Eames Lounge Chair

═══════════════════════════════════════════════════════════════
🏺 VINTAGEVISION v2.0 - WORLD-CLASS ANALYSIS
📸 Analyzing 1 image(s)
═══════════════════════════════════════════════════════════════
🔍 Stage 1: Smart Triage...
📦 modern_generic | furniture | high
🔬 Stage 2: Deep Analysis with Honest Confidence...
✅ Analysis complete: Eames Lounge Chair and Ottoman (95% confidence)
⏱️  Completed in 18.1s
═══════════════════════════════════════════════════════════════

[2026-01-18T15:41:24.288Z] INFO  [1/50] furn-001: Score 91%

...

================================================================================
                    VINTAGEVISION EVALUATION REPORT
================================================================================
Timestamp: 2026-01-18T16:00:06.275Z
Items Tested: 50 of 50

OVERALL RESULTS
---------------
Average Score: 85.4%
Median Score:  91.0%
Pass Rate:     90.0%

SCORE DISTRIBUTION
------------------
Excellent (90-100): 29 items
Good (75-89):       9 items
Acceptable (60-74): 7 items
Poor (40-59):       5 items
Failed (<40):       0 items

CATEGORY PERFORMANCE
--------------------
furniture        92.6% (10 items)
ceramics         83.8% (8 items)
...
```

---

## Score Thresholds

| Rating | Score Range | Meaning |
|--------|-------------|---------|
| **Excellent** | 90-100% | Production ready |
| **Good** | 75-89% | Acceptable with minor issues |
| **Acceptable** | 60-74% | Needs improvement |
| **Poor** | 40-59% | Significant issues |
| **Failed** | <40% | Critical failure |

### Pass Criteria

- **Pass Rate:** Items scoring 75%+ (Good or better)
- **Target:** 90% pass rate for release

---

## Failure Analysis

The system identifies common failure patterns:

```
COMMON FAILURE PATTERNS
-----------------------
• Value estimation off in furniture (2 occurrences)
• Style identification failure for Colonial (2 occurrences)
• Name identification failure in ceramics (2 occurrences)
• Difficulty level "medium" items failing (2 occurrences)

IMPROVEMENT PRIORITIES
----------------------
• PRIORITY: Improve value estimation accuracy (current avg: 61.9%)
• PRIORITY: Improve feature identification (current avg: 19.5%)
```

---

## CI/CD Integration

```yaml
# Example GitHub Actions workflow
test-accuracy:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Run evaluation
      run: |
        cd backend
        npm install
        npx tsx src/testing/evaluationHarness.ts > results.txt
    - name: Check pass rate
      run: |
        PASS_RATE=$(grep "Pass Rate" results.txt | awk '{print $3}')
        if (( $(echo "$PASS_RATE < 85" | bc -l) )); then
          echo "Pass rate $PASS_RATE% below 85% threshold"
          exit 1
        fi
```

---

## Maintaining Ground Truth

### Adding New Items

```typescript
// In groundTruth.ts
const newItem: GroundTruthItem = {
  id: 'furn-011',
  imageUrl: 'https://...',
  imageDescription: 'Description for humans',
  expected: {
    name: 'Expected identification',
    nameKeywords: ['key', 'words'],
    // ... other fields
  },
  metadata: {
    difficulty: 'medium',
    testReason: 'Why this item matters'
  }
};
```

### Updating Expectations

When AI consistently identifies items differently but correctly:

```typescript
// Update nameKeywords to accept variation
nameKeywords: ['original', 'term', 'ai', 'variation'],
```

---

## Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/testing/evaluationHarness.ts` | Test runner |
| `backend/src/testing/groundTruth.ts` | Test data (50 items) |

---

## Metrics History

| Date | Average | Median | Pass Rate | Excellent |
|------|---------|--------|-----------|-----------|
| Jan 18, 2026 | 85.4% | 91.0% | 90.0% | 29/50 |
| Jan 17, 2026 | 85.3% | 90.0% | 90.0% | 30/50 |
| Jan 10, 2026 | 82.1% | 87.0% | 86.0% | 25/50 |

---

## Future Enhancements

- [ ] Automated regression alerts
- [ ] A/B testing framework
- [ ] Per-category threshold configuration
- [ ] Historical trend visualization
- [ ] Crowd-sourced ground truth expansion
- [ ] Cross-validation with expert reviews
