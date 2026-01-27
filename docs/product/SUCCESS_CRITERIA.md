# VintageVision Success Criteria & Test Cases

**Last Updated:** January 2026
**Version:** 1.0

---

## Overview

This document defines measurable success criteria for all VintageVision features and provides corresponding test cases for validation.

---

## Core Feature: Image Analysis

### SC-1: Text/OCR Recognition

**Description:** The system must accurately read and identify text, logos, and brand names visible in images.

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Clear text accuracy | 98% | 95% | Characters correctly identified |
| Brand name recognition | 95% | 90% | Known brands identified |
| Partial text handling | Report exactly what's visible | No guessing | Manual review |
| University/Institution logos | 98% for common (MIT, Harvard, etc.) | 95% | Test dataset |

**Test Cases:**

```yaml
TC-OCR-001:
  name: "Clear 3-letter brand recognition"
  given: "Photo of item with clearly visible 'MIT' text"
  when: "Analysis completes"
  then:
    - "Text 'MIT' is reported exactly as shown"
    - "Identified as Massachusetts Institute of Technology"
    - "NOT confused with PITT, AIT, or other similar text"
  priority: CRITICAL

TC-OCR-002:
  name: "4-letter vs 3-letter distinction"
  given: "Photos of MIT mug and PITT mug"
  when: "Each is analyzed separately"
  then:
    - "MIT correctly identified as MIT (3 letters)"
    - "PITT correctly identified as PITT (4 letters)"
    - "No cross-confusion between similar-looking text"
  priority: CRITICAL

TC-OCR-003:
  name: "Partial text handling"
  given: "Photo where only 'ARBUCKS' is visible (Starbucks logo partially obscured)"
  when: "Analysis completes"
  then:
    - "Reports visible text as 'ARBUCKS' or similar"
    - "May suggest 'Starbucks' as possibility"
    - "Confidence reflects uncertainty"
  priority: HIGH

TC-OCR-004:
  name: "Maker mark recognition"
  given: "Photo of pottery with Roseville mark"
  when: "Analysis completes"
  then:
    - "Roseville brand identified"
    - "Pattern/line identified if visible"
    - "Evidence includes mark description"
  priority: HIGH

TC-OCR-005:
  name: "Serial number capture"
  given: "Photo showing serial number '12345-ABC'"
  when: "Analysis completes"
  then:
    - "Serial number captured in evidence"
    - "Used for identification if database match"
  priority: MEDIUM
```

---

### SC-2: Item Identification Accuracy

**Description:** The system must correctly identify items across all domain categories.

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Primary identification | 85% correct | 70% correct | Expert review |
| Maker attribution | 80% when marks visible | 65% | Expert review |
| Period dating | Within 20 years | Within 50 years | Expert review |
| Style classification | 90% correct | 80% correct | Expert review |

**Test Cases:**

```yaml
TC-ID-001:
  name: "Furniture style identification"
  given: "Photo of Arts & Crafts Mission oak chair"
  when: "Analysis completes"
  then:
    - "Style identified as Arts & Crafts / Mission"
    - "Period approximately 1900-1920"
    - "Material identified as oak"
  priority: HIGH

TC-ID-002:
  name: "Modern electronics identification"
  given: "Photo of MacBook Pro laptop"
  when: "Analysis completes"
  then:
    - "Brand: Apple"
    - "Product: MacBook Pro"
    - "Model details if visible (size, year)"
    - "Confidence > 90%"
  priority: HIGH

TC-ID-003:
  name: "Jewelry period identification"
  given: "Photo of Art Deco platinum diamond ring"
  when: "Analysis completes"
  then:
    - "Period: Art Deco (1920-1935)"
    - "Material: Platinum"
    - "Style: Geometric/Art Deco"
  priority: HIGH

TC-ID-004:
  name: "Domain expert routing"
  given: "Photo of vintage Rolex watch"
  when: "Analysis completes"
  then:
    - "domainExpert is 'watches'"
    - "Watch-specific details provided"
    - "Authentication risk is 'very_high'"
  priority: HIGH

TC-ID-005:
  name: "Low confidence handling"
  given: "Blurry photo of unknown object"
  when: "Analysis completes"
  then:
    - "Confidence < 50%"
    - "Multiple alternative candidates provided"
    - "Request for better photo suggested"
  priority: MEDIUM
```

---

### SC-3: Value Estimation

**Description:** Value estimates must be within acceptable range of actual market values.

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Estimate accuracy | Within 25% of actual | Within 50% | Auction result comparison |
| Range width | Reasonable spread | Not too wide | Manual review |
| Comparable sales | Relevant examples | At least 1 relevant | Manual review |
| Currency handling | Correct USD format | Correct | Automated |

**Test Cases:**

```yaml
TC-VAL-001:
  name: "Common item valuation"
  given: "Photo of Fiesta dinnerware piece"
  actual_value: "$50-$80"
  when: "Analysis completes"
  then:
    - "Estimate range includes actual value"
    - "Range not wider than 3x (e.g., $30-$100)"
  priority: HIGH

TC-VAL-002:
  name: "High-value item valuation"
  given: "Photo of Tiffany lamp"
  actual_value: "$5,000-$15,000"
  when: "Analysis completes"
  then:
    - "Estimate in same order of magnitude"
    - "Not confused with reproduction value"
  priority: HIGH

TC-VAL-003:
  name: "Modern item valuation"
  given: "Photo of iPhone 15 Pro"
  actual_value: "$800-$1,100"
  when: "Analysis completes"
  then:
    - "Estimate reflects used market value"
    - "Condition factors mentioned"
  priority: MEDIUM
```

---

### SC-4: Deal Analysis

**Description:** Deal ratings must accurately reflect value vs asking price.

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Deal direction | 95% correct (over/under) | 85% | Manual review |
| Rating accuracy | 80% exact rating | 70% | Manual review |
| Profit calculation | Mathematically correct | 100% | Automated |

**Test Cases:**

```yaml
TC-DEAL-001:
  name: "Exceptional deal detection"
  given: "Item worth $500-$800, asking price $50"
  when: "Analysis with price completes"
  then:
    - "dealRating is 'exceptional'"
    - "profitPotential shows $450-$750"
    - "Clear recommendation to buy"
  priority: HIGH

TC-DEAL-002:
  name: "Overpriced detection"
  given: "Item worth $50-$80, asking price $200"
  when: "Analysis with price completes"
  then:
    - "dealRating is 'overpriced'"
    - "Explanation mentions fair value"
    - "Clear recommendation to pass or negotiate"
  priority: HIGH

TC-DEAL-003:
  name: "Fair price detection"
  given: "Item worth $100, asking price $95"
  when: "Analysis with price completes"
  then:
    - "dealRating is 'fair'"
    - "Explanation balanced"
  priority: MEDIUM
```

---

### SC-5: Authentication Assessment

**Description:** Authentication checks must be appropriate and accurate.

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Known fake detection | 90% detected | 75% | Expert review |
| Authentic verification | 95% confirmed | 85% | Expert review |
| Checklist relevance | 100% domain-appropriate | 90% | Manual review |
| Risk level accuracy | 90% correct | 80% | Manual review |

**Test Cases:**

```yaml
TC-AUTH-001:
  name: "High-risk category handling"
  given: "Photo of Rolex Submariner watch"
  when: "Analysis completes"
  then:
    - "authenticityRisk is 'very_high'"
    - "Checklist includes serial verification"
    - "Expert referral recommended"
  priority: HIGH

TC-AUTH-002:
  name: "Low-risk category handling"
  given: "Photo of vintage board game"
  when: "Analysis completes"
  then:
    - "authenticityRisk is 'low'"
    - "Simpler checklist"
    - "No expert referral needed"
  priority: MEDIUM

TC-AUTH-003:
  name: "Fake indicator detection"
  given: "Photo of obvious reproduction furniture"
  when: "Analysis completes"
  then:
    - "Red flags identified"
    - "Evidence against authenticity listed"
    - "Lower confidence score"
  priority: HIGH
```

---

## Performance Requirements

### SC-6: Response Time

| Criterion | Target | Maximum | Measurement |
|-----------|--------|---------|-------------|
| Analysis completion | < 30 seconds | < 60 seconds | Automated timing |
| App launch to camera | < 2 seconds | < 5 seconds | Automated |
| Collection page load | < 2 seconds | < 5 seconds | Automated |
| Image upload | < 5 seconds (5MB) | < 15 seconds | Automated |

**Test Cases:**

```yaml
TC-PERF-001:
  name: "Analysis speed"
  given: "5MB JPEG image"
  when: "Analysis initiated"
  then:
    - "Results returned in < 30 seconds (target)"
    - "Results returned in < 60 seconds (max)"
    - "Progress updates shown during wait"
  priority: CRITICAL

TC-PERF-002:
  name: "Slow network handling"
  given: "3G network speed (1 Mbps)"
  when: "Analysis initiated"
  then:
    - "Image uploads within 30 seconds"
    - "Analysis completes within 120 seconds"
    - "User informed of slow connection"
  priority: HIGH
```

---

### SC-7: Reliability

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Uptime | 99.9% | 99% | Monitoring |
| Error rate | < 1% | < 5% | Logs |
| Data preservation | 100% | 100% | Automated |
| Session persistence | 60 days | 30 days | Automated |

**Test Cases:**

```yaml
TC-REL-001:
  name: "Analysis retry on failure"
  given: "Transient API error occurs"
  when: "Initial analysis fails"
  then:
    - "Automatic retry attempted (up to 3 times)"
    - "User notified only if all retries fail"
    - "Image not lost"
  priority: HIGH

TC-REL-002:
  name: "Session persistence"
  given: "User logged in 30 days ago"
  when: "User returns to app"
  then:
    - "Still authenticated"
    - "Collection accessible"
  priority: MEDIUM
```

---

## Mobile Experience

### SC-8: Mobile Usability

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Touch target size | 44x44px | 36x36px | Automated |
| Bottom nav visibility | Always visible | Always | Manual |
| Content above fold | Key info visible | Scrollable | Manual |
| Safe area compliance | Full | iOS notch handled | Manual |

**Test Cases:**

```yaml
TC-MOB-001:
  name: "Bottom navigation visibility"
  given: "User on any page"
  when: "Viewing on mobile (< 768px)"
  then:
    - "Bottom nav visible"
    - "Content not hidden behind nav"
    - "FAB camera button accessible on home"
  priority: HIGH

TC-MOB-002:
  name: "Camera capture workflow"
  given: "User taps camera button"
  when: "On mobile device"
  then:
    - "Native camera opens"
    - "Photo captured and returned"
    - "Analysis starts automatically"
  priority: CRITICAL

TC-MOB-003:
  name: "Results readability"
  given: "Analysis complete on mobile"
  when: "Viewing results"
  then:
    - "All text readable (min 14px)"
    - "Buttons tappable (44px+)"
    - "Images load quickly"
  priority: HIGH
```

---

## Data Quality

### SC-9: Data Integrity

| Criterion | Target | Minimum | Measurement |
|-----------|--------|---------|-------------|
| Image storage | No corruption | 100% | Automated |
| Analysis data | Complete records | 100% | Automated |
| Collection sync | Real-time | < 5 seconds | Automated |
| Backup recovery | Full restore | All critical data | Manual |

**Test Cases:**

```yaml
TC-DATA-001:
  name: "Analysis persistence"
  given: "Analysis completed and saved"
  when: "User retrieves later"
  then:
    - "All fields present"
    - "Image accessible"
    - "No data loss"
  priority: CRITICAL

TC-DATA-002:
  name: "Collection data integrity"
  given: "Item saved to collection"
  when: "App closed and reopened"
  then:
    - "Item still in collection"
    - "Notes preserved"
    - "Analysis linked"
  priority: HIGH
```

---

## Test Execution Plan

### Phase 1: Core Functionality (Weekly)
- TC-OCR-001 through TC-OCR-005
- TC-ID-001 through TC-ID-005
- TC-VAL-001 through TC-VAL-003

### Phase 2: Features (Bi-weekly)
- TC-DEAL-001 through TC-DEAL-003
- TC-AUTH-001 through TC-AUTH-003

### Phase 3: Performance (Monthly)
- TC-PERF-001, TC-PERF-002
- TC-REL-001, TC-REL-002

### Phase 4: Mobile (After releases)
- TC-MOB-001 through TC-MOB-003

---

## Automated Testing Coverage

| Area | Current Coverage | Target Coverage |
|------|-----------------|-----------------|
| Unit Tests (Backend) | 10% | 70% |
| Unit Tests (Frontend) | 0% | 50% |
| Integration Tests | 5% | 40% |
| E2E Tests | 0% | 30% |
| Visual Regression | 0% | 20% |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial success criteria |
