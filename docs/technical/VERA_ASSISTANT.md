# Vera - VintageVision Interactive Assistant

**Last Updated:** January 2026
**Version:** 1.0
**Status:** Production

---

## Overview

**Vera** is VintageVision's interactive AI assistant, named from the Latin word for "truth" - perfect for an authentication assistant. Vera guides users through providing additional information to achieve higher confidence scores in their antique and vintage item analyses.

---

## Philosophy

Traditional AI analysis is a one-shot process: upload image, get result. But antique authentication often requires multiple pieces of evidence. Vera transforms this into a collaborative conversation:

1. **Initial Analysis** - AI provides preliminary identification with honest confidence
2. **Gap Detection** - System identifies what additional information would help
3. **Guided Collection** - Vera asks targeted questions and requests specific photos
4. **Reanalysis** - With new information, confidence improves
5. **Expert Escalation** - If needed, seamlessly transition to human experts

---

## Key Features

### 1. Domain-Specific Photo Requests

Vera knows what photos matter for each category:

| Domain | Priority Photos |
|--------|----------------|
| **Furniture** | Underside, back, joinery details, hardware |
| **Ceramics** | Base/bottom, maker marks, glaze detail |
| **Glass** | Pontil mark, signature, color detail |
| **Silver** | Hallmarks (critical), construction details |
| **Jewelry** | Hallmarks inside band, clasp, stone settings |
| **Watches** | Case back serial, dial detail, movement |
| **Art** | Back/reverse, signature, frame labels |
| **Textiles** | Reverse side, weave detail, selvedge marks |

### 2. Intelligent Question Prioritization

Questions are ranked by:
- **Critical** - Essential for authentication (e.g., hallmarks for silver)
- **High** - Significantly impacts confidence
- **Medium** - Helpful for complete analysis
- **Low** - Nice to have, requested only if few questions

### 3. Confidence Progress Tracking

Vera tracks confidence across multiple dimensions:
- **Identification** - What is this item?
- **Dating** - When was it made?
- **Authentication** - Is it genuine?
- **Valuation** - What is it worth?

### 4. Photo Taking Guidance

Each photo request includes practical tips:
```
"Please photograph the base/foot rim showing any marks.

**Photo tip:** Use good lighting, avoid shadows, and ensure the marks
are in sharp focus. Multiple angles help."
```

---

## API Endpoints

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
    "greeting": "Hello! I'm Vera, your VintageVision authentication assistant...",
    "style": "professional, knowledgeable, encouraging, detail-oriented",
    "expertise": "antiques, vintage items, authentication, valuation, provenance research"
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
      "id": "vera-1705592400000-abc123",
      "analysisId": "uuid",
      "informationNeeds": [
        {
          "id": "marks-photo",
          "type": "photo_marks",
          "priority": "critical",
          "question": "Can you provide a clear photo of any maker marks?",
          "explanation": "Maker marks are often the key to definitive identification.",
          "expectedConfidenceGain": 0.15,
          "photoGuidance": "Use good lighting, avoid shadows..."
        }
      ],
      "conversationHistory": [...],
      "confidenceProgress": [...],
      "status": "gathering_info"
    },
    "escalation": {...},
    "assistantName": "Vera"
  }
}
```

### Add User Response
```http
POST /api/analyze/interactive/:sessionId/respond
Content-Type: application/json

{
  "needId": "marks-photo",
  "type": "photo",
  "content": "data:image/jpeg;base64,..."
}
```

### Trigger Reanalysis
```http
POST /api/analyze/interactive/:sessionId/reanalyze
```

---

## Information Need Types

| Type | Description |
|------|-------------|
| `photo_detail` | Close-up of specific area |
| `photo_marks` | Photos of marks/signatures |
| `photo_underside` | Bottom/underside view |
| `photo_back` | Back/reverse view |
| `photo_damage` | Photos of any damage |
| `photo_scale` | Photo with scale reference |
| `photo_context` | Full context photo |
| `question_provenance` | Item history questions |
| `question_purchase` | Acquisition details |
| `question_condition` | Condition information |
| `question_comparison` | Comparison to known examples |
| `question_marks` | Questions about visible marks |
| `measurement` | Request dimensions |
| `material_test` | Simple material test suggestion |
| `documentation` | Request documentation |

---

## Session States

```
┌─────────────────┐
│ gathering_info  │  ← Collecting responses from user
└────────┬────────┘
         │
         ▼ (sufficient info collected)
┌─────────────────┐
│   processing    │  ← Ready for reanalysis
└────────┬────────┘
         │
         ▼ (reanalysis complete)
┌─────────────────┐
│    complete     │  ← Final result with improved confidence
└─────────────────┘
         │
         ▼ (user abandons)
┌─────────────────┐
│   abandoned     │  ← Session ended without completion
└─────────────────┘
```

---

## Conversation Flow Example

**Initial Analysis:**
- Item: Victorian Silver Teapot
- Confidence: 72%

**Vera's Opening:**
> Hello! I'm Vera, your VintageVision authentication assistant.
>
> I've completed a preliminary analysis with good confidence (72%). I believe I've identified your item correctly, but some additional information could help us be more certain.
>
> **Can you provide a clear photo of any maker marks, signatures, or labels?**
>
> _Maker marks are often the key to definitive identification and can significantly increase our confidence._
>
> **Photo tip:** Hallmarks are essential - please photograph all visible marks clearly.

**User Provides Photo**

**Vera's Response:**
> Great photo - this is very helpful.
>
> I have another question that would help:
>
> **Please provide a photo of the base or underside of the item.**
>
> _The underside often contains crucial construction details and hidden marks._

**After Reanalysis:**
> Excellent news! With the additional information you provided, our confidence has improved significantly from 72% to 91%.
>
> **Updated Assessment:**
> - **Item:** Georgian Sterling Silver Chocolate Pot
> - **Confidence:** 91%
> - **Maker:** William Cripps, London
> - **Era:** 1765-1770
> - **Value:** $3,500 - $5,500

---

## Frontend Component

The `VeraAssistant` React component provides:
- Chat-style conversation interface
- Confidence progress bar
- Priority badges for questions
- Photo upload integration
- Text input for answers
- Reanalysis trigger button

```tsx
import { VeraAssistant } from '@/components/enhanced/VeraAssistant';

<VeraAssistant
  session={interactiveSession}
  onSendMessage={handleMessage}
  onRequestReanalysis={handleReanalyze}
  isLoading={isAnalyzing}
/>
```

---

## Implementation Files

| File | Purpose |
|------|---------|
| `backend/src/services/interactiveAnalysis.ts` | Core Vera service logic |
| `backend/src/routes/analyze.ts` | API endpoints |
| `frontend/src/components/enhanced/VeraAssistant.tsx` | React component |

---

## Best Practices

### For Users
1. Take photos in good lighting
2. Include scale reference when possible
3. Photograph all sides, not just the front
4. Look for hidden marks (bottom, inside, back)
5. Share any documentation you have

### For Developers
1. Always check `informationNeeds` for what to ask next
2. Handle all response types (photo, text, measurement, document)
3. Track `confidenceProgress` for UI feedback
4. Respect `priority` ordering of questions
5. Offer `escalation` options when appropriate

---

## Future Enhancements

- [ ] Voice-guided photo capture
- [ ] AR overlay showing where to photograph
- [ ] Real-time photo quality feedback
- [ ] Video analysis for complex items
- [ ] Multi-language support
