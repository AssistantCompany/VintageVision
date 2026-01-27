/**
 * Interactive Analysis Service - AI-Human Collaborative Workflow
 * VintageVision - World-Leading Antique AI as of January 2026
 *
 * This service implements "Vera" - the VintageVision interactive assistant
 * that guides users through providing additional information to achieve
 * higher confidence scores.
 *
 * Named "Vera" from Latin for "truth" - perfect for authentication work.
 */

import { ItemAnalysis, DomainExpert } from './openai.js';
import OpenAI from 'openai';
import { env } from '../config/env.js';

// Initialize OpenAI client for Vera
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// ============================================================================
// VERA - THE VINTAGEVISION ASSISTANT
// ============================================================================

export const ASSISTANT_NAME = 'Vera';

export const ASSISTANT_PERSONA = {
  name: 'Vera',
  title: 'VintageVision Authentication Assistant',
  greeting: `Hello! I'm Vera, your VintageVision authentication assistant. I'm here to help you uncover the truth about your antique or vintage item. Let's work together to achieve the highest possible confidence in our analysis.`,
  style: 'professional, knowledgeable, encouraging, detail-oriented',
  expertise: 'antiques, vintage items, authentication, valuation, provenance research',
};

// ============================================================================
// CONFIDENCE IMPROVEMENT TYPES
// ============================================================================

export type InformationNeedType =
  | 'photo_detail'      // Need close-up of specific area
  | 'photo_marks'       // Need photos of marks/signatures
  | 'photo_underside'   // Need bottom/underside view
  | 'photo_back'        // Need back/reverse view
  | 'photo_damage'      // Need photos of any damage
  | 'photo_scale'       // Need photo with scale reference
  | 'photo_context'     // Need photo showing full context
  | 'question_provenance'  // Question about item history
  | 'question_purchase'    // Question about where/when acquired
  | 'question_condition'   // Question about condition issues
  | 'question_comparison'  // Question comparing to other examples
  | 'question_marks'       // Question about visible marks
  | 'measurement'          // Request specific measurements
  | 'material_test'        // Suggest simple material test
  | 'documentation'        // Request any documentation

export interface InformationNeed {
  id: string;
  type: InformationNeedType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  question: string;
  explanation: string;
  expectedConfidenceGain: number;  // 0-1, how much this could improve confidence
  photoGuidance?: string;  // Instructions for taking the photo
  examples?: string[];  // Example responses or reference images
}

export interface InteractiveSession {
  id: string;
  analysisId: string;
  currentAnalysis: ItemAnalysis;
  informationNeeds: InformationNeed[];
  collectedResponses: UserResponse[];
  conversationHistory: ConversationMessage[];
  confidenceProgress: ConfidenceProgress[];
  status: 'gathering_info' | 'processing' | 'complete' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  needId: string;
  type: 'photo' | 'text' | 'measurement' | 'document';
  content: string;  // URL for photos, text for answers, JSON for measurements
  providedAt: string;
}

export interface ConversationMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  relatedNeedId?: string;
}

export interface ConfidenceProgress {
  timestamp: string;
  overallConfidence: number;
  componentScores: {
    identification: number;
    dating: number;
    authentication: number;
    valuation: number;
  };
  reason: string;
}

// ============================================================================
// INFORMATION NEED DETECTION
// ============================================================================

/**
 * Domain-specific photo requests by expert category
 */
const DOMAIN_PHOTO_REQUESTS: Record<DomainExpert, Partial<Record<InformationNeedType, string>>> = {
  furniture: {
    photo_underside: 'Please photograph the underside, looking for labels, stamps, or construction details.',
    photo_back: 'A photo of the back showing construction joints and wood would be very helpful.',
    photo_detail: 'Close-ups of any hardware, joints, or decorative elements would help with dating.',
    photo_marks: 'Look for any maker stamps, labels, or guild marks, often hidden underneath.',
  },
  ceramics: {
    photo_underside: 'The base/foot rim is crucial - please photograph the bottom showing any marks.',
    photo_marks: 'Close-up of any pottery marks, signatures, or impressed stamps.',
    photo_detail: 'A detail shot of the glaze quality and any decoration would help.',
  },
  glass: {
    photo_underside: 'Please photograph the base showing the pontil mark or any signatures.',
    photo_detail: 'A close-up showing glass quality, bubbles, or color variations.',
    photo_marks: 'Any etched or acid-stamped signatures, often on the base.',
  },
  silver: {
    photo_marks: 'Hallmarks are essential - please photograph all visible marks clearly.',
    photo_detail: 'Close-up of construction details, especially joins and edges.',
    photo_underside: 'Base showing any additional marks or construction quality.',
  },
  jewelry: {
    photo_marks: 'Please photograph any hallmarks, maker marks, or stamps (often inside bands).',
    photo_detail: 'Close-up of gemstone settings and metalwork quality.',
    photo_back: 'The reverse/back of the piece showing construction.',
  },
  watches: {
    photo_marks: 'Serial numbers on the case back are crucial for authentication.',
    photo_detail: 'Close-up of the dial showing printing quality and lume application.',
    photo_back: 'Case back engravings and serial/model numbers.',
  },
  art: {
    photo_back: 'The reverse of the artwork showing labels, stamps, or gallery marks.',
    photo_marks: 'Any signatures, dates, or edition numbers.',
    photo_detail: 'Close-up showing brushwork, print quality, or medium characteristics.',
  },
  textiles: {
    photo_back: 'The reverse side shows weave structure and construction.',
    photo_detail: 'Close-up of weave, stitching, or fiber quality.',
    photo_marks: 'Any labels, selvedge marks, or maker identifications.',
  },
  toys: {
    photo_marks: 'Manufacturer marks, typically on the base or underside.',
    photo_detail: 'Close-up of paint, mechanism, or construction details.',
    photo_underside: 'Base showing manufacturer info and country of origin.',
  },
  books: {
    photo_marks: 'Copyright page and any bookplates or signatures.',
    photo_detail: 'Condition of binding, gilding, and pages.',
    photo_context: 'Full view showing dust jacket condition if applicable.',
  },
  tools: {
    photo_marks: 'Maker marks, patent dates, or manufacturer stamps.',
    photo_detail: 'Close-up of construction quality and materials.',
  },
  lighting: {
    photo_marks: 'Base stamps, tags, or labels identifying the maker.',
    photo_detail: 'Glass or shade quality, soldering on leaded glass.',
    photo_underside: 'Base showing maker stamps (especially important for Tiffany).',
  },
  electronics: {
    photo_marks: 'Model numbers, serial numbers, and manufacturer info.',
    photo_detail: 'Condition and originality of components.',
    photo_back: 'Internal construction if accessible.',
  },
  vehicles: {
    photo_marks: 'VIN, body tags, engine stamps.',
    photo_detail: 'Condition of key components, matching numbers.',
  },
  general: {
    photo_marks: 'Any visible marks, stamps, or labels.',
    photo_detail: 'Close-ups of construction quality and materials.',
    photo_underside: 'Bottom or base of the item.',
  },
};

/**
 * Analyze current analysis and determine what additional information would help
 */
export function detectInformationNeeds(
  analysis: ItemAnalysis,
  existingResponses: UserResponse[] = []
): InformationNeed[] {
  const needs: InformationNeed[] = [];
  const domainExpert = (analysis.domainExpert || 'general') as DomainExpert;
  const answeredNeedIds = new Set(existingResponses.map(r => r.needId));

  // 1. Always request marks/signature photos if confidence < 90%
  if (analysis.confidence < 0.9) {
    const marksNeed: InformationNeed = {
      id: 'marks-photo',
      type: 'photo_marks',
      priority: analysis.confidence < 0.7 ? 'critical' : 'high',
      question: DOMAIN_PHOTO_REQUESTS[domainExpert]?.photo_marks ||
        'Can you provide a clear photo of any maker marks, signatures, or labels?',
      explanation: 'Maker marks are often the key to definitive identification and can significantly increase our confidence.',
      expectedConfidenceGain: 0.15,
      photoGuidance: 'Use good lighting, avoid shadows, and ensure the marks are in sharp focus. Multiple angles help.',
    };
    if (!answeredNeedIds.has(marksNeed.id)) needs.push(marksNeed);
  }

  // 2. Request underside/base photos for most domains
  if (analysis.confidence < 0.85 && ['furniture', 'ceramics', 'glass', 'silver', 'toys', 'lighting'].includes(domainExpert)) {
    const undersideNeed: InformationNeed = {
      id: 'underside-photo',
      type: 'photo_underside',
      priority: 'high',
      question: DOMAIN_PHOTO_REQUESTS[domainExpert]?.photo_underside ||
        'Please provide a photo of the base or underside of the item.',
      explanation: 'The underside often contains crucial construction details and hidden marks.',
      expectedConfidenceGain: 0.12,
      photoGuidance: 'If the item is too heavy to turn over, use a mirror or phone camera underneath.',
    };
    if (!answeredNeedIds.has(undersideNeed.id)) needs.push(undersideNeed);
  }

  // 3. Request back/reverse for art, furniture, textiles
  if (analysis.confidence < 0.85 && ['art', 'furniture', 'textiles'].includes(domainExpert)) {
    const backNeed: InformationNeed = {
      id: 'back-photo',
      type: 'photo_back',
      priority: 'high',
      question: DOMAIN_PHOTO_REQUESTS[domainExpert]?.photo_back ||
        'Please provide a photo of the back or reverse side.',
      explanation: 'The back often reveals construction methods, gallery labels, or hidden information.',
      expectedConfidenceGain: 0.10,
    };
    if (!answeredNeedIds.has(backNeed.id)) needs.push(backNeed);
  }

  // 4. Provenance questions for high-value items
  const midValue = ((analysis.estimatedValueMin ?? 0) + (analysis.estimatedValueMax ?? 0)) / 2;
  if (midValue >= 50000) {  // $500+
    const provenanceNeed: InformationNeed = {
      id: 'provenance-question',
      type: 'question_provenance',
      priority: 'high',
      question: 'Can you share the history of this item? How did you acquire it, and do you know anything about its previous owners?',
      explanation: 'Provenance can significantly impact both authentication and value for high-value pieces.',
      expectedConfidenceGain: 0.08,
      examples: [
        'Inherited from grandmother who collected in the 1960s',
        'Purchased at estate sale in Connecticut, 2018',
        'Found at flea market, no history known',
      ],
    };
    if (!answeredNeedIds.has(provenanceNeed.id)) needs.push(provenanceNeed);
  }

  // 5. Measurements for size-critical items
  if (['furniture', 'textiles', 'ceramics'].includes(domainExpert) && analysis.confidence < 0.8) {
    const measureNeed: InformationNeed = {
      id: 'measurements',
      type: 'measurement',
      priority: 'medium',
      question: 'Can you provide dimensions? Height, width, and depth in inches or centimeters.',
      explanation: 'Correct proportions help distinguish originals from reproductions or different time periods.',
      expectedConfidenceGain: 0.06,
    };
    if (!answeredNeedIds.has(measureNeed.id)) needs.push(measureNeed);
  }

  // 6. Authentication concerns - request comparison info
  if (analysis.authenticityRisk === 'high' || analysis.authenticityRisk === 'very_high') {
    const authNeed: InformationNeed = {
      id: 'authentication-question',
      type: 'question_comparison',
      priority: 'critical',
      question: 'Our AI detected some authentication concerns. Have you compared this to known authentic examples? Are there any features that seem unusual to you?',
      explanation: 'Your observations combined with our analysis can help identify potential reproduction indicators.',
      expectedConfidenceGain: 0.10,
    };
    if (!answeredNeedIds.has(authNeed.id)) needs.push(authNeed);
  }

  // 7. Documentation request for valuable items
  if (midValue >= 100000 || analysis.expertReferralRecommended) {  // $1000+
    const docNeed: InformationNeed = {
      id: 'documentation',
      type: 'documentation',
      priority: 'medium',
      question: 'Do you have any documentation? Receipts, appraisals, certificates of authenticity, or auction records would be very helpful.',
      explanation: 'Documentation can provide definitive authentication and provenance support.',
      expectedConfidenceGain: 0.15,
    };
    if (!answeredNeedIds.has(docNeed.id)) needs.push(docNeed);
  }

  // 8. Condition question if damage noted (check description for condition info)
  const conditionText = (analysis as any).condition || analysis.description || '';
  if (conditionText && (conditionText.toLowerCase().includes('damage') ||
      conditionText.toLowerCase().includes('repair') ||
      conditionText.toLowerCase().includes('restoration'))) {
    const conditionNeed: InformationNeed = {
      id: 'condition-photo',
      type: 'photo_damage',
      priority: 'medium',
      question: 'Can you provide close-up photos of any damage, repairs, or restoration work?',
      explanation: 'Understanding the condition details helps with accurate valuation.',
      expectedConfidenceGain: 0.05,
      photoGuidance: 'Focus on any chips, cracks, repairs, or areas of concern.',
    };
    if (!answeredNeedIds.has(conditionNeed.id)) needs.push(conditionNeed);
  }

  // 9. Scale reference for unusual sizes
  const scaleNeed: InformationNeed = {
    id: 'scale-photo',
    type: 'photo_scale',
    priority: 'low',
    question: 'Could you include a common object (coin, ruler, hand) in a photo to show scale?',
    explanation: 'A size reference helps verify proportions and authenticity.',
    expectedConfidenceGain: 0.03,
    photoGuidance: 'Place a quarter, credit card, or ruler next to the item.',
  };
  if (!answeredNeedIds.has(scaleNeed.id) && needs.length < 3) needs.push(scaleNeed);

  // Sort by priority and expected gain
  needs.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.expectedConfidenceGain - a.expectedConfidenceGain;
  });

  return needs;
}

// ============================================================================
// CONVERSATION GENERATION
// ============================================================================

/**
 * Generate Vera's response based on current state
 */
export function generateVeraResponse(
  session: InteractiveSession,
  newResponse?: UserResponse
): ConversationMessage {
  const { currentAnalysis, informationNeeds, collectedResponses, conversationHistory } = session;
  const isFirstMessage = conversationHistory.length === 0;
  const confidence = currentAnalysis.confidence;

  // First message - introduce and ask first question
  if (isFirstMessage) {
    const firstNeed = informationNeeds[0];
    const greeting = getConfidenceBasedGreeting(confidence);

    let message = `${ASSISTANT_PERSONA.greeting}\n\n${greeting}\n\n`;

    if (firstNeed) {
      message += `To help improve our analysis, I have a question for you:\n\n`;
      message += `**${firstNeed.question}**\n\n`;
      message += `_${firstNeed.explanation}_`;
      if (firstNeed.photoGuidance) {
        message += `\n\n**Photo tip:** ${firstNeed.photoGuidance}`;
      }
    } else {
      message += `Your item has been analyzed with high confidence. Would you like any additional details or have questions about the assessment?`;
    }

    return {
      role: 'assistant',
      content: message,
      timestamp: new Date().toISOString(),
      relatedNeedId: firstNeed?.id,
    };
  }

  // Response to user providing information
  if (newResponse) {
    const answeredNeed = informationNeeds.find(n => n.id === newResponse.needId);
    const remainingNeeds = informationNeeds.filter(
      n => !collectedResponses.some(r => r.needId === n.id)
    );
    const nextNeed = remainingNeeds.find(n => n.id !== newResponse.needId);

    let message = getAcknowledgment(newResponse.type);

    if (nextNeed) {
      message += `\n\nI have another question that would help:\n\n`;
      message += `**${nextNeed.question}**\n\n`;
      message += `_${nextNeed.explanation}_`;
      if (nextNeed.photoGuidance) {
        message += `\n\n**Photo tip:** ${nextNeed.photoGuidance}`;
      }
    } else {
      message += `\n\nThank you for providing all the requested information! I'll now re-analyze your item with this additional context. This should give us a more confident and accurate assessment.`;
    }

    return {
      role: 'assistant',
      content: message,
      timestamp: new Date().toISOString(),
      relatedNeedId: nextNeed?.id,
    };
  }

  // Default follow-up
  return {
    role: 'assistant',
    content: 'Is there anything else you can share about your item? Any additional photos or information you have would help with the analysis.',
    timestamp: new Date().toISOString(),
  };
}

function getConfidenceBasedGreeting(confidence: number): string {
  if (confidence >= 0.9) {
    return `I've completed a preliminary analysis of your item with high confidence (${(confidence * 100).toFixed(0)}%). The identification appears strong, but let me see if we can confirm a few details.`;
  } else if (confidence >= 0.75) {
    return `I've completed a preliminary analysis with good confidence (${(confidence * 100).toFixed(0)}%). I believe I've identified your item correctly, but some additional information could help us be more certain.`;
  } else if (confidence >= 0.6) {
    return `I've completed a preliminary analysis, though my confidence is moderate (${(confidence * 100).toFixed(0)}%). With your help providing some additional details, we can significantly improve the accuracy of this assessment.`;
  } else {
    return `I've completed a preliminary analysis, but my confidence is lower than I'd like (${(confidence * 100).toFixed(0)}%). This item may be unusual or require additional information for proper identification. Let's work together to uncover its true nature.`;
  }
}

function getAcknowledgment(responseType: string): string {
  const acknowledgments = {
    photo: [
      'Thank you for that photo!',
      'Great photo - this is very helpful.',
      'Excellent! This gives me more to work with.',
      'Perfect, I can see more details now.',
    ],
    text: [
      'Thank you for that information.',
      'This context is very helpful.',
      'I appreciate you sharing that detail.',
      'Good to know - this helps with the analysis.',
    ],
    measurement: [
      'Thank you for the measurements.',
      'These dimensions are helpful.',
      'Perfect - the size helps confirm the identification.',
    ],
    document: [
      'Thank you for sharing that documentation.',
      'This documentation is very valuable.',
      'Excellent - documented provenance is always helpful.',
    ],
  };

  const options = acknowledgments[responseType as keyof typeof acknowledgments] || acknowledgments.text;
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================================================
// AI-POWERED VERA RESPONSES
// ============================================================================

/**
 * Generate an intelligent AI response from Vera using GPT
 * This provides real conversational AI instead of scripted responses
 */
export async function generateAIVeraResponse(
  session: InteractiveSession,
  userMessage: string,
  messageType: 'photo' | 'text'
): Promise<ConversationMessage> {
  const { currentAnalysis, informationNeeds, collectedResponses, conversationHistory } = session;

  // Build context about the analyzed item
  const itemContext = `
ITEM ANALYSIS CONTEXT:
- Identified as: ${currentAnalysis.name}
- Maker/Brand: ${currentAnalysis.maker || 'Unknown'}
- Era/Period: ${currentAnalysis.era || 'Unknown'}
- Current Confidence: ${(currentAnalysis.confidence * 100).toFixed(0)}%
- Domain: ${currentAnalysis.domainExpert || 'general'}
- Value Range: $${(currentAnalysis.estimatedValueMin || 0).toLocaleString()} - $${(currentAnalysis.estimatedValueMax || 0).toLocaleString()}
- Authenticity Risk: ${currentAnalysis.authenticityRisk || 'not assessed'}
- Description: ${currentAnalysis.description || 'No description available'}
${currentAnalysis.historicalContext ? `- Historical Context: ${currentAnalysis.historicalContext}` : ''}
${currentAnalysis.evidenceFor ? `- Evidence For (authentic): ${currentAnalysis.evidenceFor.slice(0, 3).join('; ')}` : ''}
${currentAnalysis.evidenceAgainst ? `- Evidence Against: ${currentAnalysis.evidenceAgainst.slice(0, 3).join('; ')}` : ''}
`;

  // Build conversation history for context
  const recentHistory = conversationHistory.slice(-6).map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));

  // Remaining questions we might want to ask
  const answeredNeedIds = new Set(collectedResponses.map(r => r.needId));
  const remainingNeeds = informationNeeds.filter(n => !answeredNeedIds.has(n.id));

  const systemPrompt = `You are Vera, the VintageVision AI authentication assistant. You are an expert in antiques, vintage items, and collectibles authentication.

PERSONALITY:
- Knowledgeable but approachable
- Enthusiastic about antiques and history
- Honest about uncertainties
- Helpful and conversational
- Professional but warm

${itemContext}

YOUR ROLE:
1. Answer the user's questions about their item based on the analysis
2. Explain authentication findings in plain language
3. Discuss whether the item might be authentic, a reproduction, or uncertain
4. Share relevant historical context when helpful
5. Be honest about limitations and uncertainties

${remainingNeeds.length > 0 ? `
OPTIONAL - If natural to the conversation, you may ask about:
${remainingNeeds.slice(0, 2).map(n => `- ${n.question}`).join('\n')}
But ONLY if it flows naturally. Focus on answering the user's question first.
` : ''}

IMPORTANT RULES:
- Actually answer the user's question - don't just acknowledge and move on
- If they ask about authenticity, give your honest assessment based on the evidence
- If you're uncertain, explain why and what additional info would help
- Keep responses conversational and concise (2-4 sentences typically)
- Never make up specific facts not in the analysis
- If the user provides a photo, acknowledge what you can see relevant to authentication`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, cheap, good for conversation
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentHistory,
        {
          role: 'user',
          content: messageType === 'photo'
            ? `[User provided a photo] ${userMessage || 'Here is an additional photo of the item.'}`
            : userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content ||
      "I apologize, I'm having trouble processing that. Could you rephrase your question?";

    return {
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating Vera AI response:', error);

    // Fallback to scripted response if AI fails
    return {
      role: 'assistant',
      content: messageType === 'photo'
        ? "Thank you for the photo! Let me take a look. Is there something specific about this image you'd like me to address?"
        : "I appreciate you sharing that. Could you tell me more about what you'd like to know about your item?",
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create a new interactive analysis session
 */
export function createInteractiveSession(
  analysisId: string,
  initialAnalysis: ItemAnalysis
): InteractiveSession {
  const informationNeeds = detectInformationNeeds(initialAnalysis);

  const session: InteractiveSession = {
    id: `vera-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    analysisId,
    currentAnalysis: initialAnalysis,
    informationNeeds,
    collectedResponses: [],
    conversationHistory: [],
    confidenceProgress: [
      {
        timestamp: new Date().toISOString(),
        overallConfidence: initialAnalysis.confidence,
        componentScores: {
          identification: initialAnalysis.confidence,
          dating: initialAnalysis.identificationConfidence || initialAnalysis.confidence,
          authentication: initialAnalysis.authenticityRisk === 'low' ? 0.9 :
                         initialAnalysis.authenticityRisk === 'medium' ? 0.7 : 0.5,
          valuation: initialAnalysis.makerConfidence || initialAnalysis.confidence,
        },
        reason: 'Initial AI analysis',
      },
    ],
    status: informationNeeds.length > 0 ? 'gathering_info' : 'complete',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Generate initial greeting
  const greeting = generateVeraResponse(session);
  session.conversationHistory.push(greeting);

  return session;
}

/**
 * Add user response to session
 */
export function addUserResponse(
  session: InteractiveSession,
  needId: string,
  type: 'photo' | 'text' | 'measurement' | 'document',
  content: string
): InteractiveSession {
  const response: UserResponse = {
    needId,
    type,
    content,
    providedAt: new Date().toISOString(),
  };

  session.collectedResponses.push(response);
  session.conversationHistory.push({
    role: 'user',
    content: type === 'photo' ? '[Photo provided]' : content,
    timestamp: new Date().toISOString(),
    relatedNeedId: needId,
  });

  // Generate Vera's response
  const veraResponse = generateVeraResponse(session, response);
  session.conversationHistory.push(veraResponse);

  // Check if we have all critical info
  const criticalNeeds = session.informationNeeds.filter(n => n.priority === 'critical');
  const answeredCritical = criticalNeeds.filter(
    n => session.collectedResponses.some(r => r.needId === n.id)
  );

  if (answeredCritical.length === criticalNeeds.length && session.collectedResponses.length >= 2) {
    session.status = 'processing';
  }

  session.updatedAt = new Date().toISOString();
  return session;
}

/**
 * Update session with reanalyzed results
 */
export function updateWithReanalysis(
  session: InteractiveSession,
  newAnalysis: ItemAnalysis
): InteractiveSession {
  const previousConfidence = session.currentAnalysis.confidence;
  const newConfidence = newAnalysis.confidence;
  const improvement = newConfidence - previousConfidence;

  session.currentAnalysis = newAnalysis;
  session.confidenceProgress.push({
    timestamp: new Date().toISOString(),
    overallConfidence: newConfidence,
    componentScores: {
      identification: newAnalysis.confidence,
      dating: newAnalysis.identificationConfidence || newAnalysis.confidence,
      authentication: newAnalysis.authenticityRisk === 'low' ? 0.9 :
                     newAnalysis.authenticityRisk === 'medium' ? 0.7 : 0.5,
      valuation: newAnalysis.makerConfidence || newAnalysis.confidence,
    },
    reason: `Reanalysis with ${session.collectedResponses.length} additional inputs`,
  });

  // Generate completion message
  let completionMessage = '';
  if (improvement > 0.1) {
    completionMessage = `Excellent news! With the additional information you provided, our confidence has improved significantly from ${(previousConfidence * 100).toFixed(0)}% to ${(newConfidence * 100).toFixed(0)}%.`;
  } else if (improvement > 0) {
    completionMessage = `Good news! The additional information has helped confirm our analysis, with confidence now at ${(newConfidence * 100).toFixed(0)}%.`;
  } else {
    completionMessage = `I've completed the reanalysis with the new information. The confidence remains at ${(newConfidence * 100).toFixed(0)}%.`;
  }

  completionMessage += `\n\n**Updated Assessment:**\n- **Item:** ${newAnalysis.name}\n- **Confidence:** ${(newConfidence * 100).toFixed(0)}%`;

  if (newAnalysis.maker) {
    completionMessage += `\n- **Maker:** ${newAnalysis.maker}`;
  }
  completionMessage += `\n- **Era:** ${newAnalysis.era}`;
  completionMessage += `\n- **Value:** $${((newAnalysis.estimatedValueMin ?? 0) / 100).toLocaleString()} - $${((newAnalysis.estimatedValueMax ?? 0) / 100).toLocaleString()}`;

  if (newAnalysis.expertReferralRecommended) {
    completionMessage += `\n\n**Recommendation:** For this item, I recommend consulting with a human expert for full authentication. ${newAnalysis.expertReferralReason || ''}`;
  }

  session.conversationHistory.push({
    role: 'assistant',
    content: completionMessage,
    timestamp: new Date().toISOString(),
  });

  session.status = 'complete';
  session.updatedAt = new Date().toISOString();

  return session;
}

// ============================================================================
// QUICK RESPONSES
// ============================================================================

/**
 * Generate quick follow-up questions for common scenarios
 */
export function getQuickQuestions(analysis: ItemAnalysis): string[] {
  const questions: string[] = [];
  const domainExpert = (analysis.domainExpert || 'general') as DomainExpert;

  // Domain-specific questions
  switch (domainExpert) {
    case 'furniture':
      questions.push('Do you see any labels or stamps when you look underneath?');
      questions.push('Are there any dovetail joints visible in the drawers?');
      break;
    case 'ceramics':
      questions.push('What marks do you see on the bottom?');
      questions.push('Does it feel heavy for its size?');
      break;
    case 'glass':
      questions.push('Can you see a pontil mark on the base?');
      questions.push('Does the glass have any bubbles or imperfections?');
      break;
    case 'silver':
      questions.push('What hallmarks can you identify?');
      questions.push('Is it marked "sterling" or just "silver"?');
      break;
    case 'jewelry':
      questions.push('Are there any stamps inside the band?');
      questions.push('Is the clasp original?');
      break;
    case 'watches':
      questions.push('What is the serial number on the case back?');
      questions.push('Does the movement appear original?');
      break;
    case 'art':
      questions.push('Are there any labels on the back?');
      questions.push('Is it signed? Where?');
      break;
    default:
      questions.push('Are there any marks or labels you can see?');
      questions.push('Do you know the history of this item?');
  }

  return questions;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  DOMAIN_PHOTO_REQUESTS,
};
