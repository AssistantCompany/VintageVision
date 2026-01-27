# VintageVision User Journeys

**Last Updated:** January 2026
**Version:** 1.0

---

## Overview

This document defines the core user journeys for VintageVision, including step-by-step flows, success criteria, and test scenarios.

---

## Journey 1: Quick Item Identification

**Persona:** Hunter Hannah, Flipper Frank
**Frequency:** Multiple times per shopping session
**Priority:** CRITICAL

### Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. USER AT ESTATE SALE/FLEA MARKET                                     │
│     Has physical access to item                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. OPEN APP & CAPTURE IMAGE                                             │
│     • App opens to camera view (< 2 seconds)                            │
│     • User takes photo of item                                           │
│     • Optional: Enter asking price                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. ANALYSIS IN PROGRESS                                                 │
│     • Real-time progress indicator                                       │
│     • Stage updates (Triage → Evidence → ID → Synthesis)                │
│     • Total time: < 30 seconds target                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. VIEW RESULTS                                                         │
│     • Item identification with confidence                                │
│     • Value estimate (range)                                             │
│     • Deal rating (if price entered)                                     │
│     • Verification tips                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  5. MAKE DECISION                                                        │
│     • Buy (save to collection)                                           │
│     • Pass (new analysis)                                                │
│     • Save for later (wishlist)                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Success Criteria

| Metric | Target | Critical |
|--------|--------|----------|
| Time from photo to results | < 30 seconds | < 60 seconds |
| Identification accuracy | > 85% | > 70% |
| Text/brand recognition | > 95% for clear text | > 80% |
| Value estimate accuracy | Within 30% of actual | Within 50% |
| Deal rating accuracy | Correct direction 90% | Correct 75% |

### Test Scenarios

#### TC-1.1: Clear Brand Identification
```
Given: User photographs item with clearly visible brand name "MIT"
When: Analysis completes
Then: Brand is correctly identified as "MIT" (Massachusetts Institute of Technology)
And: Not confused with similar text (PITT, AIT, etc.)
```

#### TC-1.2: Maker Mark Recognition
```
Given: User photographs Stickley furniture with visible red decal
When: Analysis completes
Then: Maker identified as "Gustav Stickley"
And: Confidence > 85%
And: Evidence includes "red decal visible"
```

#### TC-1.3: Deal Analysis
```
Given: User enters asking price of $50
And: Item actual value is $500-$800
When: Analysis completes
Then: Deal rating is "exceptional"
And: Profit potential shown as $450-$750
And: Recommendation is clear "BUY"
```

#### TC-1.4: Low Confidence Handling
```
Given: User photographs item with poor lighting or partial view
When: Analysis completes
Then: Confidence is appropriately low (< 60%)
And: User is prompted to add more photos
And: Alternative candidates are shown
```

#### TC-1.5: Slow Network Handling
```
Given: User is on slow 3G network
When: Analysis starts
Then: Progress indicator shows stages
And: User can cancel if needed
And: Analysis completes (< 120 seconds max)
```

---

## Journey 2: Authentication Verification

**Persona:** Collector Claire, Hunter Hannah
**Frequency:** When considering significant purchase
**Priority:** HIGH

### Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. INITIAL ANALYSIS COMPLETE                                            │
│     Item identified, but user wants verification                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. START AUTHENTICATION WIZARD                                          │
│     • Risk level displayed (low/medium/high/very_high)                  │
│     • Authentication confidence shown                                    │
│     • Checklist of verification steps                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. COMPLETE CHECKLIST                                                   │
│     • Check each verification point                                      │
│     • Mark as pass/fail/uncertain                                        │
│     • Add notes for each check                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. UPLOAD ADDITIONAL PHOTOS (Optional)                                  │
│     • Requested areas (underside, marks, details)                       │
│     • Each photo analyzed for authenticity evidence                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  5. FINAL AUTHENTICATION REPORT                                          │
│     • Updated confidence score                                           │
│     • Summary of findings                                                │
│     • Recommendation (authentic/suspicious/needs expert)                │
└─────────────────────────────────────────────────────────────────────────┘
```

### Success Criteria

| Metric | Target | Critical |
|--------|--------|----------|
| Known fake detection rate | > 90% | > 75% |
| Authentic item verification | > 95% | > 85% |
| Checklist relevance | Domain-appropriate 100% | 90% |
| Photo request relevance | Useful 95% | 80% |
| Expert referral accuracy | Appropriate 90% | 75% |

### Test Scenarios

#### TC-2.1: High-Risk Category
```
Given: User analyzes Rolex watch
When: Authentication section displays
Then: Risk level is "very_high"
And: Checklist includes serial number verification
And: Expert referral is recommended
```

#### TC-2.2: Low-Risk Category
```
Given: User analyzes common vintage toy
When: Authentication section displays
Then: Risk level is "low"
And: Checklist is simpler
And: Expert referral not recommended
```

#### TC-2.3: Additional Photo Analysis
```
Given: User uploads photo of maker's mark
When: Photo is analyzed
Then: Findings added to authentication report
And: Confidence is updated
And: Evidence for/against is clear
```

---

## Journey 3: Collection Management

**Persona:** Collector Claire, Hunter Hannah
**Frequency:** After purchase, periodically for review
**Priority:** MEDIUM

### Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. SAVE ITEM TO COLLECTION                                              │
│     After analysis, user clicks "Save to Collection"                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. ADD DETAILS                                                          │
│     • Personal notes                                                     │
│     • Location/storage                                                   │
│     • Purchase price                                                     │
│     • Date acquired                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. VIEW COLLECTION                                                      │
│     • Grid or list view                                                  │
│     • Filter by style, era, value                                        │
│     • Sort by date, value, name                                          │
│     • Total collection value                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. MANAGE ITEMS                                                         │
│     • Edit notes                                                         │
│     • Remove from collection                                             │
│     • View original analysis                                             │
│     • Share item                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Success Criteria

| Metric | Target | Critical |
|--------|--------|----------|
| Save success rate | 100% | 99% |
| Collection load time | < 2 seconds | < 5 seconds |
| Search/filter accuracy | 100% | 95% |
| Data persistence | 100% | 100% |
| Image loading | < 1 second | < 3 seconds |

### Test Scenarios

#### TC-3.1: Save to Collection
```
Given: User completes analysis
When: User clicks "Save to Collection"
Then: Item is saved immediately
And: Confirmation shown
And: Item appears in collection
```

#### TC-3.2: Collection Stats
```
Given: User has 10 items in collection
When: User views collection
Then: Total count shows 10
And: Total estimated value calculated
And: Unique styles count shown
```

#### TC-3.3: Offline Collection Access
```
Given: User has items in collection
When: Device goes offline
Then: Collection still viewable
And: Images load from cache
And: New saves queued for sync
```

---

## Journey 4: Resale/Flip Workflow

**Persona:** Flipper Frank
**Frequency:** For every item purchased for resale
**Priority:** HIGH

### Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. ANALYZE POTENTIAL FLIP                                               │
│     Enter asking price when analyzing                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. REVIEW FLIP ASSESSMENT                                               │
│     • Profit potential (min/max)                                        │
│     • Flip difficulty (easy/moderate/hard/very_hard)                    │
│     • Time to sell estimate                                              │
│     • Recommended channels                                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. DECIDE TO PURCHASE                                                   │
│     If margins look good, buy the item                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. GENERATE LISTING (Future Feature)                                    │
│     • Professional title                                                 │
│     • Detailed description                                               │
│     • Suggested pricing                                                  │
│     • Platform-specific format                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Success Criteria

| Metric | Target | Critical |
|--------|--------|----------|
| Profit estimate accuracy | Within 25% | Within 50% |
| Flip difficulty accuracy | Correct 80% | Correct 60% |
| Time-to-sell accuracy | Correct range 75% | Correct 50% |
| Channel recommendations | Optimal 90% | Appropriate 75% |

### Test Scenarios

#### TC-4.1: Easy Flip
```
Given: User analyzes common collectible with large market
When: Flip assessment displays
Then: Difficulty is "easy"
And: Time estimate is "1-2 weeks"
And: eBay is primary channel
```

#### TC-4.2: Hard Flip
```
Given: User analyzes niche/specialized item
When: Flip assessment displays
Then: Difficulty is "hard" or "very_hard"
And: Time estimate is "3-6 months"
And: Specialty dealers recommended
```

---

## Journey 5: First-Time User Onboarding

**Persona:** All new users
**Frequency:** Once per user
**Priority:** HIGH

### Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. APP LAUNCH (First Time)                                              │
│     Brief intro screen explaining value proposition                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. QUICK TUTORIAL (Optional)                                            │
│     • How to take good photos                                            │
│     • Key features overview                                              │
│     • Skip option available                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. FIRST ANALYSIS                                                       │
│     • Guide user through first photo                                     │
│     • Explain results sections                                           │
│     • Celebrate successful first scan                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. ACCOUNT CREATION (Optional)                                          │
│     • Explain benefits of account                                        │
│     • Google OAuth sign-in                                               │
│     • Continue as guest option                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Success Criteria

| Metric | Target | Critical |
|--------|--------|----------|
| Onboarding completion | > 80% | > 60% |
| First analysis success | > 95% | > 85% |
| Time to first result | < 60 seconds | < 120 seconds |
| Account creation rate | > 40% | > 20% |
| 7-day retention | > 30% | > 15% |

### Test Scenarios

#### TC-5.1: Skip Onboarding
```
Given: New user opens app
When: User skips onboarding
Then: User goes directly to camera
And: First analysis still works
And: Contextual tips available
```

#### TC-5.2: Complete Onboarding
```
Given: New user opens app
When: User completes all onboarding steps
Then: User understands core features
And: First analysis is guided
And: Results are explained
```

---

## Journey 6: Error Recovery

**Persona:** All users
**Frequency:** When errors occur
**Priority:** CRITICAL

### Common Error Scenarios

#### E-1: Image Upload Failure
```
Trigger: Network error during upload
Response:
  - Clear error message
  - Retry button
  - Option to save locally and retry later
  - Image preserved (not lost)
```

#### E-2: Analysis Failure
```
Trigger: OpenAI API error or timeout
Response:
  - Friendly error message (not technical)
  - Automatic retry (up to 3 times)
  - Manual retry option
  - Suggest better photo if quality issue
```

#### E-3: Authentication Error
```
Trigger: Session expired or OAuth failure
Response:
  - Re-authentication prompt
  - Preserve in-progress work
  - Quick re-login flow
  - Clear explanation of what happened
```

#### E-4: Offline Mode
```
Trigger: No network connection
Response:
  - Offline indicator
  - Access to cached collection
  - Queue new analyses for later
  - Sync when connection restored
```

### Success Criteria

| Metric | Target | Critical |
|--------|--------|----------|
| Error recovery rate | > 90% | > 75% |
| User frustration (drop-off) | < 10% | < 25% |
| Data preservation | 100% | 100% |
| Clear error messaging | 100% | 90% |

---

## Journey Map Summary

| Journey | Primary Persona | Frequency | Priority | Status |
|---------|-----------------|-----------|----------|--------|
| Quick Identification | Hannah/Frank | Very High | CRITICAL | Implemented |
| Authentication | Claire/Hannah | Medium | HIGH | Implemented |
| Collection Management | Claire/Hannah | Medium | MEDIUM | Implemented |
| Resale/Flip | Frank | High | HIGH | Implemented |
| Onboarding | All new users | Once | HIGH | PARTIAL |
| Error Recovery | All users | When needed | CRITICAL | PARTIAL |

---

## Future Journeys (Planned)

### J-7: Multi-Photo Analysis
Allow users to submit multiple photos of same item for improved accuracy.

### J-8: Listing Generation
Generate ready-to-post marketplace listings from analysis.

### J-9: Price Alerts
Notify users when similar items appear at target prices.

### J-10: Community Features
Share finds, get community validation, follow experts.

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial journey definitions |
