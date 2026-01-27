# Expert Escalation System

**Last Updated:** January 2026
**Version:** 1.0
**Status:** Production

---

## Overview

The Expert Escalation System provides a human-in-the-loop capability for high-stakes items where AI confidence alone is insufficient. This creates a premium service tier while ensuring users can get professional authentication when needed.

---

## Service Tiers

### Tier 1: Quick Expert Review ($25)

| Attribute | Value |
|-----------|-------|
| **Price** | $25 |
| **Turnaround** | 24 hours |
| **Best For** | Items valued $100-$500, common categories |

**Includes:**
- Expert verification of AI identification
- Confidence validation
- Brief authentication notes

### Tier 2: Full Authentication ($150)

| Attribute | Value |
|-----------|-------|
| **Price** | $150 |
| **Turnaround** | 48 hours |
| **Best For** | Items valued $500-$5,000, authentication required |

**Includes:**
- Detailed authentication report
- Maker/period verification
- Condition assessment
- Market value validation
- Written certificate of authenticity

### Tier 3: Premium Written Appraisal ($500)

| Attribute | Value |
|-----------|-------|
| **Price** | $500 |
| **Turnaround** | 7 days |
| **Best For** | Items valued $5,000+, legal documentation |

**Includes:**
- USPAP-compliant written appraisal
- Detailed provenance research
- Comparable sales analysis
- Insurance/estate documentation
- Legal-grade authentication
- Follow-up consultation

---

## Escalation Triggers

The system automatically evaluates whether to offer escalation based on:

### Value-Based Triggers
| Mid-Value | Urgency | Recommended Tier |
|-----------|---------|------------------|
| $100-$499 | Medium | Quick Review |
| $500-$4,999 | High | Full Authentication |
| $5,000+ | High | Premium Appraisal |

### Confidence-Based Triggers
| Condition | Urgency | Action |
|-----------|---------|--------|
| Confidence < 60% | Medium | Offer Quick Review |
| Authentication concerns | Critical | Recommend Full Authentication |
| High-risk category + low confidence | High | Recommend Full Authentication |

### Category-Based Triggers
High-risk categories that always show escalation option:
- Watches
- Jewelry
- Silver
- Art
- Ceramics

### Other Triggers
- AI recommended expert referral
- Wide price range (>3x spread)
- Authentication risk = high or very_high

---

## API Integration

### Evaluate Escalation
```typescript
import { evaluateEscalation, getEscalationOptions } from './services/expertEscalation';

const evaluation = evaluateEscalation(analysis);
// Returns:
// {
//   shouldOffer: true,
//   urgency: 'high',
//   reasons: ['High-value item: $5,250 estimated', 'High-risk category: silver'],
//   recommendedTier: { id: 'premium-appraisal', ... },
//   allAvailableTiers: [...],
//   estimatedValue: { min: 350000, max: 700000 }
// }

const options = getEscalationOptions(analysis);
// Returns:
// {
//   evaluation: {...},
//   message: '📋 Professional appraisal recommended for this high-value item.',
//   actionUrl: '/expert-review'
// }
```

### Create Expert Request
```typescript
import { createExpertRequest } from './services/expertEscalation';

const request = await createExpertRequest(
  analysisId,
  userId,
  'full-authentication',
  analysis,
  'Please verify the hallmarks'
);
// Returns ExpertRequest object
```

---

## Expert Request Lifecycle

```
┌────────────────────┐
│  pending_payment   │  ← User initiated request
└─────────┬──────────┘
          │ (payment confirmed)
          ▼
┌────────────────────┐
│ pending_assignment │  ← In queue for expert
└─────────┬──────────┘
          │ (expert matched)
          ▼
┌────────────────────┐
│     assigned       │  ← Expert accepted
└─────────┬──────────┘
          │ (expert begins)
          ▼
┌────────────────────┐
│    in_review       │  ← Expert analyzing
└─────────┬──────────┘
          │ (expert completes)
          ▼
┌────────────────────┐
│    completed       │  ← Report delivered
└────────────────────┘
```

---

## Expert Matching Algorithm

When assigning experts, the system considers:

1. **Specialization Match (40 points)**
   - Does expert specialize in this category?

2. **Rating Score (up to 40 points)**
   - Expert's average rating (0-5 stars × 8)

3. **Experience Score (up to 15 points)**
   - 100+ reviews: 15 points
   - 50+ reviews: 10 points

4. **Turnaround Score (up to 5 points)**
   - Average turnaround ≤ 75% of tier deadline: +5 points

```typescript
const match = findBestExpert(request, availableExperts);
// Returns:
// {
//   expert: {...},
//   matchScore: 87,
//   reasons: ['Specializes in silver', 'Highly experienced (100+ reviews)'],
//   estimatedTurnaround: 36
// }
```

---

## Expert Feedback Loop

When experts complete reviews, their corrections feed back into the AI system:

```typescript
interface ExpertCorrection {
  field: string;           // What was corrected
  originalValue: unknown;  // AI's assessment
  correctedValue: unknown; // Expert's correction
  explanation: string;     // Why it was wrong
  confidence: number;      // Expert's confidence
}

// Process feedback for learning
await processExpertFeedback({
  requestId: 'exp-123',
  expertId: 'expert-456',
  corrections: [
    {
      field: 'maker',
      originalValue: 'Unknown English',
      correctedValue: 'Paul Storr, London',
      explanation: 'Identified PS hallmark with lion passant',
      confidence: 0.98
    }
  ],
  overallAssessment: 'Confirmed Georgian silver...',
  confidenceLevel: 0.95,
  authenticityVerified: true
});
```

---

## Data Structures

### ExpertRequest
```typescript
interface ExpertRequest {
  id: string;
  analysisId: string;
  userId: string;
  tierId: string;
  tierName: string;
  price: number;
  status: ExpertRequestStatus;
  assignedExpertId?: string;
  assignedExpertName?: string;
  submittedAt: string;
  assignedAt?: string;
  completedAt?: string;
  dueAt: string;
  itemName: string;
  itemCategory: DomainExpert;
  estimatedValue: { min: number; max: number };
  userNotes?: string;
  expertNotes?: string;
  expertCorrections?: ExpertCorrection[];
  finalReport?: string;
}
```

### Expert Profile
```typescript
interface Expert {
  id: string;
  name: string;
  email: string;
  specializations: DomainExpert[];
  certifications: string[];
  rating: number;
  completedReviews: number;
  averageTurnaround: number;
  isActive: boolean;
  joinedAt: string;
}
```

---

## UI Messages by Urgency

| Urgency | Message |
|---------|---------|
| **Critical** | "⚠️ Expert review strongly recommended due to authenticity concerns." |
| **High** | "📋 Professional appraisal recommended for this high-value item." |
| **Medium** | "💡 Expert verification available to confirm this identification." |
| **Low** | "Expert review available for additional confidence." |

---

## Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/services/expertEscalation.ts` | Core escalation service |
| `backend/src/routes/analyze.ts` | API integration |
| `frontend/src/components/enhanced/ExpertEscalation.tsx` | UI component |

---

## Business Considerations

### Revenue Model
- Service fees: 100% to VintageVision initially
- Future: Expert network with revenue sharing (70/30 split)

### Quality Assurance
- Expert verification required before activation
- Minimum qualification: Certified appraiser or 10+ years experience
- Regular performance reviews

### SLA Guarantees
- Turnaround times are guaranteed
- Refund if deadline missed
- Escalation to senior expert if needed

---

## Future Enhancements

- [ ] Expert network recruitment portal
- [ ] In-app expert communication
- [ ] Video consultation option
- [ ] Rush service (4-hour turnaround)
- [ ] Subscription plans for dealers
- [ ] Expert marketplace bidding
- [ ] Blockchain-backed certificates
