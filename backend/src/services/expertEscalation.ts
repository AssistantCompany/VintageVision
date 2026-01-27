// Expert Escalation Service - Human-in-the-Loop for High-Stakes Items
// VintageVision - World-Leading Antique AI as of January 2026
// Implements escalation to human experts when AI confidence is insufficient

import { ItemAnalysis, DomainExpert } from './openai.js';

// Domain experts list for type checking
const DOMAIN_EXPERTS: DomainExpert[] = [
  'furniture', 'ceramics', 'glass', 'silver', 'jewelry', 'watches',
  'art', 'textiles', 'toys', 'books', 'tools', 'lighting',
  'electronics', 'vehicles', 'general'
];

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface EscalationConfig {
  // Value thresholds (in cents) - escalate if above
  autoEscalateValueThreshold: number; // Default: 10000 ($100)
  premiumEscalateValueThreshold: number; // Default: 500000 ($5,000)

  // Confidence thresholds - escalate if below
  lowConfidenceThreshold: number; // Default: 0.6
  authenticationConcernThreshold: number; // Default: 0.7

  // High-risk categories that always get expert review option
  highRiskCategories: DomainExpert[];

  // Service tiers
  tiers: ExpertServiceTier[];
}

export interface ExpertServiceTier {
  id: string;
  name: string;
  description: string;
  price: number; // In cents
  turnaroundHours: number;
  includes: string[];
  recommendedFor: string[];
}

const DEFAULT_CONFIG: EscalationConfig = {
  autoEscalateValueThreshold: 10000, // $100 - show escalation option
  premiumEscalateValueThreshold: 500000, // $5,000 - strongly recommend expert
  lowConfidenceThreshold: 0.6,
  authenticationConcernThreshold: 0.7,
  highRiskCategories: ['watches', 'jewelry', 'silver', 'art', 'ceramics'],
  tiers: [
    {
      id: 'quick-review',
      name: 'Quick Expert Review',
      description: 'Rapid verification by a certified appraiser',
      price: 2500, // $25
      turnaroundHours: 24,
      includes: [
        'Expert verification of AI identification',
        'Confidence validation',
        'Brief authentication notes',
      ],
      recommendedFor: [
        'Items valued $100-$500',
        'Common antique categories',
        'Quick buy/sell decisions',
      ],
    },
    {
      id: 'full-authentication',
      name: 'Full Authentication',
      description: 'Comprehensive expert authentication with documentation',
      price: 15000, // $150
      turnaroundHours: 48,
      includes: [
        'Detailed authentication report',
        'Maker/period verification',
        'Condition assessment',
        'Market value validation',
        'Written certificate of authenticity',
      ],
      recommendedFor: [
        'Items valued $500-$5,000',
        'Pieces requiring authentication',
        'Insurance documentation',
      ],
    },
    {
      id: 'premium-appraisal',
      name: 'Premium Written Appraisal',
      description: 'Full USPAP-compliant appraisal by certified appraiser',
      price: 50000, // $500
      turnaroundHours: 168, // 7 days
      includes: [
        'USPAP-compliant written appraisal',
        'Detailed provenance research',
        'Comparable sales analysis',
        'Insurance/estate documentation',
        'Legal-grade authentication',
        'Follow-up consultation',
      ],
      recommendedFor: [
        'Items valued $5,000+',
        'Estate planning',
        'Insurance claims',
        'Major auction consignment',
      ],
    },
  ],
};

// ============================================================================
// ESCALATION TRIGGERS
// ============================================================================

export interface EscalationEvaluation {
  shouldOffer: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  recommendedTier: ExpertServiceTier | null;
  allAvailableTiers: ExpertServiceTier[];
  estimatedValue: { min: number; max: number };
}

/**
 * Evaluate whether an analysis should be escalated to human experts
 */
export function evaluateEscalation(
  analysis: ItemAnalysis,
  config: EscalationConfig = DEFAULT_CONFIG
): EscalationEvaluation {
  const reasons: string[] = [];
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let recommendedTier: ExpertServiceTier | null = null;

  // Safely get values with defaults
  const valueMin = analysis.estimatedValueMin ?? 0;
  const valueMax = analysis.estimatedValueMax ?? 0;
  const midValue = (valueMin + valueMax) / 2;
  const estimatedValue = {
    min: valueMin,
    max: valueMax,
  };
  const domainExpert = (analysis.domainExpert || 'general') as DomainExpert;

  // 1. Value-based triggers
  if (midValue >= config.premiumEscalateValueThreshold) {
    reasons.push(`High-value item: $${(midValue / 100).toLocaleString()} estimated`);
    urgency = 'high';
    recommendedTier = config.tiers.find(t => t.id === 'premium-appraisal') || null;
  } else if (midValue >= config.autoEscalateValueThreshold) {
    reasons.push(`Notable value: $${(midValue / 100).toLocaleString()} estimated`);
    urgency = 'medium';
    recommendedTier = config.tiers.find(t => t.id === 'full-authentication') || null;
  }

  // 2. Low confidence trigger
  if (analysis.confidence < config.lowConfidenceThreshold) {
    reasons.push(`Low AI confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
    urgency = urgency === 'low' ? 'medium' : urgency;
    if (!recommendedTier) {
      recommendedTier = config.tiers.find(t => t.id === 'quick-review') || null;
    }
  }

  // 3. Authentication concerns
  if (analysis.authenticityRisk === 'high' || analysis.authenticityRisk === 'very_high') {
    reasons.push(`High authenticity risk: ${analysis.authenticityRisk}`);
    urgency = 'critical';
    recommendedTier = config.tiers.find(t => t.id === 'full-authentication') || null;
  }

  // 4. Expert referral already recommended by AI
  if (analysis.expertReferralRecommended) {
    reasons.push(`AI recommended expert review: ${analysis.expertReferralReason || 'Verification advised'}`);
    urgency = urgency === 'low' ? 'medium' : urgency;
    if (!recommendedTier) {
      recommendedTier = config.tiers.find(t => t.id === 'quick-review') || null;
    }
  }

  // 5. High-risk category
  if (DOMAIN_EXPERTS.includes(domainExpert) && config.highRiskCategories.includes(domainExpert)) {
    reasons.push(`High-risk category: ${domainExpert}`);
    if (urgency === 'low') urgency = 'medium';
  }

  // 6. Wide price range indicates uncertainty
  const priceRatio = valueMax / Math.max(valueMin, 1);
  if (priceRatio > 3) {
    reasons.push(`Wide value range: ${priceRatio.toFixed(1)}x spread indicates uncertainty`);
    if (!recommendedTier) {
      recommendedTier = config.tiers.find(t => t.id === 'quick-review') || null;
    }
  }

  const shouldOffer = reasons.length > 0 || midValue >= config.autoEscalateValueThreshold;

  return {
    shouldOffer,
    urgency,
    reasons,
    recommendedTier,
    allAvailableTiers: config.tiers,
    estimatedValue,
  };
}

// ============================================================================
// EXPERT REQUEST MANAGEMENT
// ============================================================================

export type ExpertRequestStatus =
  | 'pending_payment'
  | 'pending_assignment'
  | 'assigned'
  | 'in_review'
  | 'completed'
  | 'cancelled';

export interface ExpertRequest {
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

export interface ExpertCorrection {
  field: string;
  originalValue: unknown;
  correctedValue: unknown;
  explanation: string;
  confidence: number;
}

export interface ExpertFeedback {
  requestId: string;
  expertId: string;
  corrections: ExpertCorrection[];
  overallAssessment: string;
  confidenceLevel: number;
  authenticityVerified: boolean;
  additionalNotes?: string;
  marketInsights?: string;
  timestamp: string;
}

/**
 * Create an expert review request
 */
export async function createExpertRequest(
  analysisId: string,
  userId: string,
  tierId: string,
  analysis: ItemAnalysis,
  userNotes?: string,
  config: EscalationConfig = DEFAULT_CONFIG
): Promise<ExpertRequest> {
  const tier = config.tiers.find(t => t.id === tierId);
  if (!tier) {
    throw new Error(`Invalid tier ID: ${tierId}`);
  }

  const now = new Date();
  const dueAt = new Date(now.getTime() + tier.turnaroundHours * 60 * 60 * 1000);

  const domainExpert = (analysis.domainExpert || 'general') as DomainExpert;

  const request: ExpertRequest = {
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    analysisId,
    userId,
    tierId: tier.id,
    tierName: tier.name,
    price: tier.price,
    status: 'pending_payment',
    submittedAt: now.toISOString(),
    dueAt: dueAt.toISOString(),
    itemName: analysis.name,
    itemCategory: domainExpert,
    estimatedValue: {
      min: analysis.estimatedValueMin ?? 0,
      max: analysis.estimatedValueMax ?? 0,
    },
    userNotes,
  };

  // In production, save to database
  console.log('📋 Expert request created:', request.id);
  console.log(`   Item: ${request.itemName}`);
  console.log(`   Tier: ${request.tierName} ($${(request.price / 100).toFixed(2)})`);
  console.log(`   Due: ${request.dueAt}`);

  return request;
}

/**
 * Process expert feedback and update AI learning
 */
export async function processExpertFeedback(
  feedback: ExpertFeedback
): Promise<{
  success: boolean;
  learningUpdated: boolean;
  corrections: number;
}> {
  console.log('🎓 Processing expert feedback:', feedback.requestId);

  // Record corrections for self-learning system
  const corrections = feedback.corrections.length;

  if (corrections > 0) {
    console.log(`   📝 ${corrections} corrections to process`);

    // In production, these would be stored and used to improve the AI
    for (const correction of feedback.corrections) {
      console.log(`   → ${correction.field}: "${correction.originalValue}" → "${correction.correctedValue}"`);
      console.log(`     Reason: ${correction.explanation}`);
    }

    // Update self-learning system
    // This would integrate with selfLearning.ts to improve future predictions
  }

  return {
    success: true,
    learningUpdated: corrections > 0,
    corrections,
  };
}

// ============================================================================
// EXPERT NETWORK MANAGEMENT
// ============================================================================

export interface Expert {
  id: string;
  name: string;
  email: string;
  specializations: DomainExpert[];
  certifications: string[];
  rating: number; // 0-5
  completedReviews: number;
  averageTurnaround: number; // hours
  isActive: boolean;
  joinedAt: string;
}

export interface ExpertMatch {
  expert: Expert;
  matchScore: number;
  reasons: string[];
  estimatedTurnaround: number;
}

/**
 * Find the best expert match for a request
 */
export function findBestExpert(
  request: ExpertRequest,
  availableExperts: Expert[]
): ExpertMatch | null {
  const matches: ExpertMatch[] = [];

  for (const expert of availableExperts) {
    if (!expert.isActive) continue;

    let matchScore = 0;
    const reasons: string[] = [];

    // Specialization match
    if (expert.specializations.includes(request.itemCategory)) {
      matchScore += 40;
      reasons.push(`Specializes in ${request.itemCategory}`);
    }

    // Rating score
    matchScore += expert.rating * 8; // Max 40 points

    // Experience score
    if (expert.completedReviews >= 100) {
      matchScore += 15;
      reasons.push('Highly experienced (100+ reviews)');
    } else if (expert.completedReviews >= 50) {
      matchScore += 10;
      reasons.push('Experienced (50+ reviews)');
    }

    // Turnaround score
    const tierTurnaround = DEFAULT_CONFIG.tiers.find(t => t.id === request.tierId)?.turnaroundHours || 48;
    if (expert.averageTurnaround <= tierTurnaround * 0.75) {
      matchScore += 5;
      reasons.push('Fast turnaround');
    }

    matches.push({
      expert,
      matchScore,
      reasons,
      estimatedTurnaround: expert.averageTurnaround,
    });
  }

  // Sort by match score and return best
  matches.sort((a, b) => b.matchScore - a.matchScore);
  return matches[0] || null;
}

// ============================================================================
// ESCALATION ROUTES (for integration with API)
// ============================================================================

export interface EscalationResponse {
  evaluation: EscalationEvaluation;
  message: string;
  actionUrl?: string;
}

/**
 * Get escalation options for a completed analysis
 */
export function getEscalationOptions(analysis: ItemAnalysis): EscalationResponse {
  const evaluation = evaluateEscalation(analysis);

  if (!evaluation.shouldOffer) {
    return {
      evaluation,
      message: 'AI analysis is confident. Expert review optional but available.',
    };
  }

  let message: string;
  switch (evaluation.urgency) {
    case 'critical':
      message = '⚠️ Expert review strongly recommended due to authenticity concerns.';
      break;
    case 'high':
      message = '📋 Professional appraisal recommended for this high-value item.';
      break;
    case 'medium':
      message = '💡 Expert verification available to confirm this identification.';
      break;
    default:
      message = 'Expert review available for additional confidence.';
  }

  return {
    evaluation,
    message,
    actionUrl: '/expert-review',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { DEFAULT_CONFIG as ESCALATION_DEFAULT_CONFIG };
