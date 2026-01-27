# What Improves Analysis Quality?

**Last Updated:** January 2026

---

## Overview

This document explains which features directly improve the AI's ability to analyze vintage items vs. supporting infrastructure that helps users or maintains quality.

---

## Directly Improves Analysis Quality

| Feature | Impact |
|---------|--------|
| **GPT-5.2 Pro** | Highest capability vision model - better OCR, detail recognition |
| **Multi-Stage Pipeline** | Structured triage → evidence → identification → synthesis prevents rushing to conclusions |
| **15 Domain Expert Prompts** | Specialized knowledge for furniture, ceramics, silver, etc. - not generic prompts |
| **Multi-Image Support** | More angles = more evidence (marks, underside, damage) |
| **Auction Database Integration** | Real market data validates/corrects AI valuations |
| **Consensus Analysis** | Multiple runs catch errors on uncertain items |

### How Each Works

#### GPT-5.2 Pro
The latest OpenAI vision model with improved:
- Text/OCR recognition (critical for maker marks, labels, signatures)
- Fine detail analysis (construction techniques, materials)
- Historical knowledge (periods, styles, makers)

#### Multi-Stage Pipeline
Instead of one prompt asking "what is this?", we use 4 stages:
1. **Triage** - Categorize and route to specialist
2. **Evidence** - Extract all visual evidence with confidence scores
3. **Identification** - Make identification based on evidence
4. **Synthesis** - Combine into final response with valuations

#### Domain Expert Prompts
15 specialized prompt templates:
- `furniture` - Joinery, wood types, period construction
- `ceramics` - Marks, glazes, forms, kilns
- `silver` - Hallmarks, sterling vs. plate, makers
- `jewelry` - Period settings, stones, hallmarks
- `art` - Signatures, techniques, periods
- And 10 more...

#### Multi-Image Support
Users can submit 2-5 images with specific roles:
- `overview` - Main item view
- `detail` - Close-up details
- `marks` - Maker marks, signatures, labels
- `underside` - Bottom/base construction
- `damage` - Condition documentation

#### Auction Database Integration
Real-time data from:
- LiveAuctioneers (5,000+ auction houses)
- Invaluable (4,000+ auction houses)
- eBay sold listings

This validates AI estimates against actual sales.

#### Consensus Analysis
For uncertain items, automatically triggers:
- 2-3 parallel analysis runs
- Confidence-weighted result merging
- Optional o1 reasoning model synthesis

---

## Supports Quality (Indirectly)

| Feature | What It Does |
|---------|--------------|
| **Evaluation System (50 items)** | Catches regressions before deployment - doesn't improve AI, but prevents degradation |
| **Vera Assistant** | Guides users to provide better photos - garbage in = garbage out |
| **Expert Escalation** | Human fallback for high-stakes items - acknowledges AI limits |

### How Each Works

#### Evaluation System
- 50 curated ground truth items across 11 categories
- Automated scoring with weighted components
- CI/CD integration to catch regressions
- **Purpose**: Measure quality, not improve it directly

#### Vera Interactive Assistant
- Asks domain-specific follow-up questions
- Guides photo capture for better evidence
- **Purpose**: Better user input leads to better analysis

#### Expert Escalation
- 3-tier human expert service ($25/$150/$500)
- For high-value or authentication-critical items
- **Purpose**: Human fallback when AI confidence is low

---

## Current Performance Metrics

| Metric | Value |
|--------|-------|
| **Average Score** | 85.4% |
| **Median Score** | 91.0% |
| **Pass Rate** | 90.0% |
| **Excellent (90-100%)** | 29/50 items |
| **Good (75-89%)** | 9/50 items |

---

## Future Quality Improvements

Potential areas for further improvement:

1. **Expand Ground Truth** - More test items = better coverage
2. **Fine-tune Prompts** - Analyze failure patterns and adjust
3. **Category-Specific Models** - Specialized fine-tuning for weak areas
4. **User Feedback Loop** - Learn from corrections
5. **More Auction Sources** - Sotheby's, Christie's, Heritage

---

## Summary

**Yes, analysis quality should be better because:**

1. Better model (GPT-5.2 Pro)
2. Smarter prompts (domain-specific experts)
3. More data (multi-image, auction prices)
4. Quality checks (consensus for uncertain items)

The architecture is solid. Future gains will come from expanding the ground truth dataset and fine-tuning prompts based on failure patterns.

 The Flow Now Works

  1. User uploads photo → Analysis runs (e.g., 85% confidence)
  2. User sees "Improve with Vera" CTA
  3. User clicks "Start with Vera"
  4. Vera shows what photos would help (marks, underside, etc.)
  5. User uploads additional photos via Vera or AuthenticationWizard
  6. System reanalyzes with new evidence
  7. UI updates with improved confidence


  Integration Summary

  1. Auction Database Integration

  - Added calculatePriceRange() function to marketData.ts
  - Integrated into openai.ts analysis pipeline (lines 1199-1244)
  - Now automatically fetches comparable sales from eBay, LiveAuctioneers, and Invaluable after each analysis
  - Blends AI estimates with real market data (60% AI / 40% market)
  - Populates comparableSales field in analysis results

  2. Consensus Mode (High Confidence Mode)

  - Added toggle in SimpleImageUploader.tsx preview screen
  - Users can enable "High Confidence Mode" before analysis
  - Updated useVintageAnalysis.ts hook to accept consensusMode parameter
  - Updated useAnalysisStream.ts hook to accept consensusMode parameter
  - Updated PremiumHome.tsx and PremiumLandingPage.tsx to pass mode through
  - Backend supports: 'auto' (default), 'always' (high confidence), 'never'

  3. Expert Escalation - More Prominent

  - Added prominent CTA in PremiumAnalysisResult.tsx (lines 737-795)
  - Shows automatically when:
    - Expert referral is recommended
    - Item value > $5,000
    - Confidence < 70%
    - High or very high authenticity risk
  - Includes clear "Connect with Expert" button
  - Shows "Recommended" badge when backend suggests expert review
