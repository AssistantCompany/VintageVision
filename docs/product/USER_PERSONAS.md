# VintageVision User Personas

**Last Updated:** January 2026
**Version:** 1.0

---

## Overview

VintageVision serves diverse users united by interest in vintage, antique, and collectible items. This document defines our primary user personas to guide feature development, UX decisions, and success criteria.

---

## Primary Personas

### 1. The Weekend Treasure Hunter ("Hunter Hannah")

**Demographics:**
- Age: 35-55
- Income: Middle to upper-middle class
- Location: Suburban/urban areas
- Tech comfort: Moderate (uses smartphone apps daily)

**Motivations:**
- Enjoys browsing estate sales, flea markets, thrift stores
- Wants to find hidden gems and "scores"
- Gets satisfaction from finding undervalued items
- Likes the thrill of the hunt

**Goals:**
- Quickly identify items while shopping
- Know if something is worth buying before committing
- Avoid overpaying or buying fakes
- Build a personal collection over time

**Pain Points:**
- Limited time at sales (competitive environment)
- Unsure if price is fair
- Can't identify maker marks
- Worried about authenticity
- Poor cell service at some venues

**Key Scenarios:**
1. At estate sale, spots interesting chair, needs quick identification
2. Found item at $50, wants to know if worth $500
3. Sees "Stickley" label but unsure if authentic
4. Browsing and wants to save interesting finds for later

**Success Metrics:**
- Identification in < 30 seconds
- Accurate value range (within 20% of actual)
- Clear buy/don't buy recommendation
- Works offline (or with slow connection)

---

### 2. The Reseller/Flipper ("Flipper Frank")

**Demographics:**
- Age: 25-45
- Income: Variable (reselling is primary or side income)
- Location: Any
- Tech comfort: High (uses multiple selling platforms)

**Motivations:**
- Maximize profit per flip
- Reduce risk of bad purchases
- Efficient sourcing
- Build expertise over time

**Goals:**
- Identify profit opportunities instantly
- Know exact resale value and best channel
- Understand item condition impact on value
- Track inventory and past purchases

**Pain Points:**
- Competition from other resellers
- Need to make quick decisions
- Shipping/handling considerations
- Platform fees eat into margins
- Occasional losses on bad buys

**Key Scenarios:**
1. At auction, items moving fast, need quick flip assessment
2. Found item at $20, needs to know profit potential
3. Have item in inventory, need optimal listing strategy
4. Comparing two similar items, which is better flip?

**Success Metrics:**
- Flip difficulty rating accurate
- Profit estimate within 25%
- Resale channel recommendations correct
- Time-to-sell estimate accurate

---

### 3. The Collector ("Collector Claire")

**Demographics:**
- Age: 45-70
- Income: Upper-middle to affluent
- Location: Urban/suburban
- Tech comfort: Low to moderate

**Motivations:**
- Building comprehensive collection
- Learning and expertise
- Investment value
- Legacy/inheritance planning

**Goals:**
- Identify pieces that fit collection
- Authenticate potential purchases
- Track collection value over time
- Document provenance

**Pain Points:**
- Fakes and reproductions
- Condition issues not visible
- Dealer markups
- Storage and insurance
- Keeping records

**Key Scenarios:**
1. Dealer offers "authentic" piece, needs verification
2. Inherited items, need identification and valuation
3. Want to know if collection has appreciated
4. Considering insurance, need accurate values

**Success Metrics:**
- Authentication accuracy > 95%
- Detailed provenance information
- Collection tracking works reliably
- Value estimates match auction results

---

### 4. The Interior Designer ("Designer Dana")

**Demographics:**
- Age: 30-50
- Income: Professional income
- Location: Urban
- Tech comfort: High

**Motivations:**
- Finding unique pieces for clients
- Matching styles and periods
- Sourcing at good prices
- Building vendor relationships

**Goals:**
- Identify period and style quickly
- Get styling suggestions
- Find similar items at various price points
- Share finds with clients

**Pain Points:**
- Clients have specific needs
- Budget constraints
- Time pressure on projects
- Quality verification

**Key Scenarios:**
1. Client wants "Art Deco" pieces, need to verify style
2. Found perfect piece, need to convince client of value
3. Need alternatives at different price points
4. Documenting finds for client presentation

**Success Metrics:**
- Style/period identification accurate
- Styling suggestions relevant
- Professional-quality sharing
- Alternative recommendations helpful

---

### 5. The Casual Browser ("Browser Ben")

**Demographics:**
- Age: 25-40
- Income: Variable
- Location: Any
- Tech comfort: High

**Motivations:**
- Curiosity about interesting objects
- Social sharing of finds
- Occasional purchases
- Entertainment/hobby

**Goals:**
- Learn about interesting items
- Share cool finds with friends
- Occasional purchases when compelling
- No commitment, just exploring

**Pain Points:**
- Not enough knowledge
- Fear of being ripped off
- Decision paralysis
- Limited budget for purchases

**Key Scenarios:**
1. At antique mall, curious about unusual item
2. Grandma's attic, what is this thing?
3. Saw something on social media, want to know more
4. Shopping for unique gift

**Success Metrics:**
- Engaging historical context
- Easy social sharing
- Low barrier to entry
- Educational value clear

---

## Secondary Personas

### 6. The Dealer/Professional ("Dealer Dave")
- Runs antique shop or booth
- Uses app for quick second opinions
- Needs professional-level accuracy
- May use for customer education

### 7. The Inheritor ("Inheritor Irene")
- Recently received estate items
- No antique knowledge
- Needs complete guidance
- May want to sell or keep

### 8. The Newbie ("Newbie Nick")
- Just getting started with antiques
- Needs education and guidance
- Making first purchases
- Building confidence

---

## Persona Priority Matrix

| Persona | Revenue Potential | Volume | Feature Priority |
|---------|------------------|--------|------------------|
| Hunter Hannah | Medium | High | PRIMARY |
| Flipper Frank | High | Medium | PRIMARY |
| Collector Claire | High | Low | SECONDARY |
| Designer Dana | High | Low | SECONDARY |
| Browser Ben | Low | High | TERTIARY |

---

## Design Implications

### For Hunter Hannah (Primary):
- **Speed is critical** - Analysis must complete in < 30 seconds
- **Offline capability** - Core features work without connection
- **Clear deal rating** - Instant buy/pass recommendation
- **Mobile-first** - One-hand operation while holding items

### For Flipper Frank (Primary):
- **Profit focus** - Flip difficulty and profit prominently displayed
- **Channel recommendations** - Where to sell for best results
- **Batch capability** - Analyze multiple items efficiently
- **Export listings** - Generate ready-to-post descriptions

### For Collector Claire (Secondary):
- **Authentication depth** - Detailed verification checklists
- **Collection tracking** - Portfolio with value tracking
- **Documentation** - Save detailed records
- **Professional output** - Insurance-grade valuations

### For Designer Dana (Secondary):
- **Style accuracy** - Period and style identification critical
- **Visual search** - Find similar items
- **Client sharing** - Professional presentation mode
- **Alternatives** - Multiple price point options

### For Browser Ben (Tertiary):
- **Education** - Rich historical context
- **Engagement** - Fun, interesting facts
- **Sharing** - Social media integration
- **Free tier** - No barrier to exploration

---

## Validation Plan

### User Research Methods:
1. **Surveys** - Quantitative validation of persona assumptions
2. **Interviews** - Deep-dive with 5+ users per persona
3. **Usage analytics** - Validate behavior patterns
4. **Support tickets** - Identify pain points

### Metrics to Track:
- Session duration by user type
- Feature usage patterns
- Conversion rates
- Retention by persona
- NPS by persona

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial persona definitions |
