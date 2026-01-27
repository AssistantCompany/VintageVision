# Conditional Multi-Run Consensus Analysis

**Last Updated:** January 2026
**Version:** 1.0
**Status:** Production

---

## Overview

The Consensus Analysis System provides intelligent multi-run verification for items where additional confidence is needed. Rather than always running multiple analyses (expensive), it conditionally triggers based on risk factors.

---

## Philosophy

**The Problem:** Single-run AI analysis can be inconsistent, especially for:
- Complex items requiring specialized knowledge
- High-value items where mistakes are costly
- Items with authentication concerns
- Edge cases between categories

**The Solution:** Run 2-3 parallel analyses and merge results, but **only when needed** to optimize API costs.

---

## Trigger Evaluation

### Automatic Triggers

| Condition | Threshold | Suggested Runs |
|-----------|-----------|----------------|
| Low confidence | < 75% | 2-3 runs |
| High value | > $5,000 | 2-3 runs |
| Authentication concern | High/Very High risk | 3 runs |
| High-risk category | watches, jewelry, silver, art | 2 runs |
| Wide value range | > 3x spread | 2 runs |
| Expert referral recommended | AI suggests | 2-3 runs |

### Configuration

```typescript
interface ConsensusConfig {
  // Thresholds for triggering consensus
  lowConfidenceThreshold: number;      // Default: 0.75
  highValueThreshold: number;          // Default: $5,000
  highRiskCategories: DomainExpert[];  // Default: watches, jewelry, silver, art
  authenticationConcernLevel: string;  // Default: 'high'

  // Consensus settings
  minRuns: number;                     // Default: 2
  maxRuns: number;                     // Default: 3

  // Reasoning model
  useReasoningModel: boolean;          // Default: true
  reasoningModel: string;              // Default: 'o1'
}
```

---

## Analysis Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INITIAL ANALYSIS                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 EVALUATE TRIGGERS                                │
│  • Check confidence level                                        │
│  • Check estimated value                                         │
│  • Check authentication risk                                     │
│  • Check category                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼ (triggers met)              ▼ (no triggers)
┌─────────────────────┐       ┌─────────────────────┐
│   MULTI-RUN MODE    │       │  RETURN INITIAL     │
│                     │       │     RESULT          │
│  Run 2-3 parallel   │       └─────────────────────┘
│  analyses           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MERGE RESULTS                                 │
│  • Confidence-weighted averaging                                 │
│  • Majority voting for categorical fields                        │
│  • Median for numeric values                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼ (if useReasoningModel)
┌─────────────────────────────────────────────────────────────────┐
│              REASONING MODEL SYNTHESIS (o1)                      │
│  • Analyze disagreements                                         │
│  • Resolve conflicts                                             │
│  • Generate final assessment                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FINAL MERGED RESULT                             │
│  + consensusMetadata with details                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Usage

### Basic Usage (Auto Mode)
```typescript
// Automatically evaluates triggers
const result = await analyzeWithConsensus(imageBase64, askingPrice);
```

### Force Multi-Run
```typescript
// Always run multiple analyses
const result = await analyzeWithConsensus(imageBase64, askingPrice, {
  forceMultiRun: true
});
```

### Custom Configuration
```typescript
const result = await analyzeWithConsensus(imageBase64, askingPrice, {
  config: {
    lowConfidenceThreshold: 0.8,  // Stricter threshold
    useReasoningModel: true,
    reasoningModel: 'o1'
  }
});
```

### Request Schema (analyze route)
```json
{
  "image": "data:image/jpeg;base64,...",
  "askingPrice": 50000,
  "consensusMode": "auto",     // "auto" | "always" | "never"
  "forceMultiRun": false,
  "useReasoningModel": true
}
```

---

## Merge Algorithms

### Confidence-Weighted Merge

For numeric fields:
```
merged_value = Σ(value_i × confidence_i) / Σ(confidence_i)
```

### Majority Voting

For categorical fields (name, maker, style):
- Count occurrences across runs
- Weight by confidence
- Select highest weighted count

### Median Selection

For value ranges:
- Collect all min/max values
- Take median to reduce outlier impact

### Field-Specific Rules

| Field | Merge Strategy |
|-------|----------------|
| `name` | Confidence-weighted vote |
| `maker` | Confidence-weighted vote |
| `confidence` | Weighted average |
| `estimatedValueMin` | Median |
| `estimatedValueMax` | Median |
| `era` | Confidence-weighted vote |
| `style` | Confidence-weighted vote |
| `evidenceFor` | Union of all evidence |
| `evidenceAgainst` | Union of all evidence |
| `verificationTips` | Union with deduplication |

---

## Consensus Metadata

Results include metadata about the consensus process:

```typescript
interface ConsensusResult {
  finalResult: ItemAnalysis;
  consensusDetails: {
    runsCompleted: number;
    triggerReasons: string[];
    confidenceSpread: number;
    agreement: {
      name: boolean;
      maker: boolean;
      era: boolean;
      value: boolean;
    };
    reasoningUsed: boolean;
    processingTime: number;
  };
}
```

---

## Cost Optimization

### Trigger Statistics

Based on production data:
- ~30% of items trigger consensus
- Average runs when triggered: 2.3
- Cost reduction vs always-on: ~60%

### Cost Comparison

| Mode | Avg Runs | Relative Cost |
|------|----------|---------------|
| Single run | 1.0 | 1.0x |
| Always consensus | 3.0 | 3.0x |
| **Conditional (auto)** | **1.4** | **1.4x** |

---

## Reasoning Model Integration

When enabled, the o1 reasoning model synthesizes final results:

```typescript
// Reasoning prompt structure
const reasoningPrompt = `
You are synthesizing ${runs.length} independent analyses of the same antique item.
Each analysis was performed by a different AI instance.

Analysis 1 (confidence: ${runs[0].confidence}):
${JSON.stringify(runs[0])}

Analysis 2 (confidence: ${runs[1].confidence}):
${JSON.stringify(runs[1])}

[Additional analyses...]

Your task:
1. Identify points of agreement
2. Analyze any disagreements
3. Synthesize a final, authoritative assessment
4. Explain your reasoning for any conflict resolution
`;
```

---

## Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/services/consensusAnalysis.ts` | Core consensus logic |
| `backend/src/routes/analyze.ts` | API integration |

---

## Configuration Examples

### High-Stakes Mode
```typescript
const config = {
  lowConfidenceThreshold: 0.85,
  highValueThreshold: 100000,  // $1,000
  minRuns: 3,
  maxRuns: 5,
  useReasoningModel: true
};
```

### Cost-Conscious Mode
```typescript
const config = {
  lowConfidenceThreshold: 0.60,
  highValueThreshold: 1000000,  // $10,000
  minRuns: 2,
  maxRuns: 2,
  useReasoningModel: false
};
```

### Always-On Mode
```typescript
// Use consensusMode: 'always' in API request
{
  "consensusMode": "always"
}
```

---

## Monitoring & Metrics

Track these metrics for optimization:
- Trigger rate by category
- Average confidence improvement
- Disagreement rate between runs
- Reasoning model usage
- Total API cost

---

## Future Enhancements

- [ ] Adaptive threshold learning
- [ ] Category-specific run counts
- [ ] A/B testing different merge strategies
- [ ] Cost budget constraints
- [ ] Parallel processing optimization
- [ ] Caching for similar items
