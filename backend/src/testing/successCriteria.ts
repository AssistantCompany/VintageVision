/**
 * VintageVision Success Criteria
 * ================================
 * Defines measurable success criteria for all app capabilities.
 * These criteria form the basis for E2E testing and quality assurance.
 */

// ============================================================================
// CORE ANALYSIS SUCCESS CRITERIA
// ============================================================================

export interface AnalysisCriteria {
  id: string
  name: string
  description: string
  category: 'identification' | 'valuation' | 'authentication' | 'ux' | 'performance'
  priority: 'critical' | 'high' | 'medium' | 'low'
  metric: string
  threshold: number
  unit: string
  testable: boolean
}

export const ANALYSIS_SUCCESS_CRITERIA: AnalysisCriteria[] = [
  // IDENTIFICATION CRITERIA
  {
    id: 'ID-001',
    name: 'Item Name Accuracy',
    description: 'System correctly identifies the item name/type',
    category: 'identification',
    priority: 'critical',
    metric: 'Percentage of items correctly named',
    threshold: 95,
    unit: '%',
    testable: true
  },
  {
    id: 'ID-002',
    name: 'Maker/Brand Attribution',
    description: 'System correctly identifies maker, brand, or manufacturer',
    category: 'identification',
    priority: 'critical',
    metric: 'Percentage of items with correct maker attribution',
    threshold: 90,
    unit: '%',
    testable: true
  },
  {
    id: 'ID-003',
    name: 'Era/Period Dating',
    description: 'System dates item within acceptable range',
    category: 'identification',
    priority: 'high',
    metric: 'Percentage within ±10 years of actual date',
    threshold: 85,
    unit: '%',
    testable: true
  },
  {
    id: 'ID-004',
    name: 'Style Classification',
    description: 'System correctly identifies style/movement',
    category: 'identification',
    priority: 'high',
    metric: 'Percentage correctly classified',
    threshold: 90,
    unit: '%',
    testable: true
  },
  {
    id: 'ID-005',
    name: 'Domain Expert Assignment',
    description: 'System assigns correct domain expert category',
    category: 'identification',
    priority: 'medium',
    metric: 'Percentage correct domain assignment',
    threshold: 95,
    unit: '%',
    testable: true
  },
  {
    id: 'ID-006',
    name: 'Key Feature Detection',
    description: 'System identifies defining characteristics',
    category: 'identification',
    priority: 'high',
    metric: 'Average % of key features identified per item',
    threshold: 80,
    unit: '%',
    testable: true
  },

  // VALUATION CRITERIA
  {
    id: 'VAL-001',
    name: 'Value Range Accuracy',
    description: 'Estimated value range contains actual market value',
    category: 'valuation',
    priority: 'critical',
    metric: 'Percentage where actual falls in estimated range',
    threshold: 85,
    unit: '%',
    testable: true
  },
  {
    id: 'VAL-002',
    name: 'Value Precision',
    description: 'Value range not too wide (useful to user)',
    category: 'valuation',
    priority: 'high',
    metric: 'Average range width as % of midpoint',
    threshold: 50,
    unit: '% max',
    testable: true
  },
  {
    id: 'VAL-003',
    name: 'Condition Impact',
    description: 'Valuation appropriately adjusts for condition',
    category: 'valuation',
    priority: 'high',
    metric: 'Condition factors correctly applied',
    threshold: 90,
    unit: '%',
    testable: true
  },
  {
    id: 'VAL-004',
    name: 'Market Context',
    description: 'Valuation reflects current market trends',
    category: 'valuation',
    priority: 'medium',
    metric: 'Alignment with recent auction results',
    threshold: 80,
    unit: '%',
    testable: true
  },

  // AUTHENTICATION CRITERIA
  {
    id: 'AUTH-001',
    name: 'Authenticity Confidence',
    description: 'Appropriate confidence in authenticity assessment',
    category: 'authentication',
    priority: 'critical',
    metric: 'Calibration: high confidence = correct',
    threshold: 90,
    unit: '%',
    testable: true
  },
  {
    id: 'AUTH-002',
    name: 'Red Flag Detection',
    description: 'System identifies potential forgery indicators',
    category: 'authentication',
    priority: 'critical',
    metric: 'Known red flags correctly identified',
    threshold: 95,
    unit: '%',
    testable: true
  },
  {
    id: 'AUTH-003',
    name: 'Provenance Recognition',
    description: 'System identifies provenance markers when present',
    category: 'authentication',
    priority: 'high',
    metric: 'Provenance indicators detected',
    threshold: 85,
    unit: '%',
    testable: true
  },
  {
    id: 'AUTH-004',
    name: 'Authentication Evidence',
    description: 'Provides specific evidence for/against authenticity',
    category: 'authentication',
    priority: 'high',
    metric: 'Analyses with substantiated evidence',
    threshold: 90,
    unit: '%',
    testable: true
  },

  // UX CRITERIA
  {
    id: 'UX-001',
    name: 'Analysis Clarity',
    description: 'Results understandable to non-experts',
    category: 'ux',
    priority: 'high',
    metric: 'User comprehension score (survey)',
    threshold: 85,
    unit: '%',
    testable: false
  },
  {
    id: 'UX-002',
    name: 'Actionable Recommendations',
    description: 'Clear next steps provided to user',
    category: 'ux',
    priority: 'high',
    metric: 'Analyses with clear recommendations',
    threshold: 95,
    unit: '%',
    testable: true
  },
  {
    id: 'UX-003',
    name: 'Honest Uncertainty',
    description: 'Confidence levels accurately reflect certainty',
    category: 'ux',
    priority: 'critical',
    metric: 'Confidence calibration accuracy',
    threshold: 90,
    unit: '%',
    testable: true
  },

  // PERFORMANCE CRITERIA
  {
    id: 'PERF-001',
    name: 'Analysis Speed',
    description: 'Time from image upload to results',
    category: 'performance',
    priority: 'high',
    metric: 'Average analysis time',
    threshold: 15,
    unit: 'seconds max',
    testable: true
  },
  {
    id: 'PERF-002',
    name: 'Analysis Reliability',
    description: 'Successful analysis completion rate',
    category: 'performance',
    priority: 'critical',
    metric: 'Percentage completing without error',
    threshold: 99,
    unit: '%',
    testable: true
  },
  {
    id: 'PERF-003',
    name: 'Image Processing',
    description: 'Handles various image qualities/sizes',
    category: 'performance',
    priority: 'medium',
    metric: 'Success rate across image types',
    threshold: 95,
    unit: '%',
    testable: true
  }
]

// ============================================================================
// USER JOURNEYS
// ============================================================================

export interface UserJourneyStep {
  order: number
  action: string
  expectedOutcome: string
  successMetric: string
  criteriaIds: string[]  // Links to success criteria
}

export interface UserJourney {
  id: string
  name: string
  persona: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  steps: UserJourneyStep[]
  successConditions: string[]
}

export const USER_JOURNEYS: UserJourney[] = [
  // JOURNEY 1: First-time Casual Identifier
  {
    id: 'UJ-001',
    name: 'First-time Item Discovery',
    persona: 'Casual User - found item at estate sale',
    description: 'User finds an interesting item and wants to know what it is and if it\'s valuable',
    priority: 'critical',
    steps: [
      {
        order: 1,
        action: 'User lands on homepage',
        expectedOutcome: 'Clear value proposition and obvious CTA to analyze',
        successMetric: 'CTA visible above fold, <3s load time',
        criteriaIds: ['PERF-001']
      },
      {
        order: 2,
        action: 'User uploads photo from phone',
        expectedOutcome: 'Smooth upload, image preview shown',
        successMetric: 'Upload completes in <5s, preview accurate',
        criteriaIds: ['PERF-003']
      },
      {
        order: 3,
        action: 'Analysis runs',
        expectedOutcome: 'Progress indicators show work happening',
        successMetric: 'Analysis completes in <15s with progress feedback',
        criteriaIds: ['PERF-001', 'PERF-002']
      },
      {
        order: 4,
        action: 'User views results',
        expectedOutcome: 'Clear identification with value estimate',
        successMetric: 'Item correctly identified, value range provided',
        criteriaIds: ['ID-001', 'ID-002', 'VAL-001', 'UX-001']
      },
      {
        order: 5,
        action: 'User understands next steps',
        expectedOutcome: 'Clear recommendations (sell, keep, authenticate)',
        successMetric: 'Actionable recommendations displayed',
        criteriaIds: ['UX-002']
      }
    ],
    successConditions: [
      'Complete flow in under 60 seconds',
      'Item correctly identified',
      'Value estimate reasonable',
      'Clear next steps provided'
    ]
  },

  // JOURNEY 2: Serious Collector Authentication
  {
    id: 'UJ-002',
    name: 'Collector Authentication Check',
    persona: 'Serious Collector - evaluating purchase',
    description: 'Collector considering expensive purchase wants authenticity verification',
    priority: 'critical',
    steps: [
      {
        order: 1,
        action: 'User uploads high-quality photos (multiple angles)',
        expectedOutcome: 'System accepts multiple images, suggests additional angles if needed',
        successMetric: 'Multi-image support, guidance for needed shots',
        criteriaIds: ['PERF-003']
      },
      {
        order: 2,
        action: 'Analysis completes',
        expectedOutcome: 'Detailed analysis with authentication assessment',
        successMetric: 'Authentication section present with evidence',
        criteriaIds: ['AUTH-001', 'AUTH-004']
      },
      {
        order: 3,
        action: 'User reviews authentication evidence',
        expectedOutcome: 'Specific markers identified (signatures, patina, construction)',
        successMetric: 'Evidence for/against clearly listed',
        criteriaIds: ['AUTH-002', 'AUTH-003', 'AUTH-004']
      },
      {
        order: 4,
        action: 'User assesses confidence level',
        expectedOutcome: 'Honest confidence with appropriate caveats',
        successMetric: 'Confidence calibrated, uncertainty acknowledged',
        criteriaIds: ['UX-003', 'AUTH-001']
      },
      {
        order: 5,
        action: 'User decides on purchase',
        expectedOutcome: 'Sufficient info to make informed decision',
        successMetric: 'User feels confident in decision',
        criteriaIds: ['UX-001', 'UX-002']
      }
    ],
    successConditions: [
      'Authentication assessment provided',
      'Specific evidence listed',
      'Red flags identified if present',
      'Confidence appropriately calibrated'
    ]
  },

  // JOURNEY 3: Dealer Batch Evaluation
  {
    id: 'UJ-003',
    name: 'Dealer Estate Lot Evaluation',
    persona: 'Antique Dealer - evaluating estate lot',
    description: 'Dealer needs to quickly evaluate 20+ items from an estate',
    priority: 'high',
    steps: [
      {
        order: 1,
        action: 'User accesses batch analysis (Premium)',
        expectedOutcome: 'Batch upload interface loads',
        successMetric: 'Batch feature accessible, clear instructions',
        criteriaIds: ['PERF-001']
      },
      {
        order: 2,
        action: 'User uploads 20 images',
        expectedOutcome: 'Bulk upload succeeds, queue visible',
        successMetric: 'All images accepted, progress tracked',
        criteriaIds: ['PERF-002', 'PERF-003']
      },
      {
        order: 3,
        action: 'Batch analysis runs',
        expectedOutcome: 'Parallel processing with status updates',
        successMetric: 'Complete in <5 min for 20 items',
        criteriaIds: ['PERF-001', 'PERF-002']
      },
      {
        order: 4,
        action: 'User reviews aggregate results',
        expectedOutcome: 'Summary with total value estimate, highlights',
        successMetric: 'Clear summary, sortable by value',
        criteriaIds: ['VAL-001', 'VAL-002']
      },
      {
        order: 5,
        action: 'User exports report',
        expectedOutcome: 'PDF report with all items generated',
        successMetric: 'Professional PDF ready for client',
        criteriaIds: ['UX-002']
      }
    ],
    successConditions: [
      'All items processed successfully',
      'Total lot value estimate provided',
      'High-value items flagged',
      'PDF export working'
    ]
  },

  // JOURNEY 4: Insurance Documentation
  {
    id: 'UJ-004',
    name: 'Insurance Documentation',
    persona: 'Homeowner - documenting collection for insurance',
    description: 'User needs to document collection value for insurance purposes',
    priority: 'high',
    steps: [
      {
        order: 1,
        action: 'User analyzes collection item',
        expectedOutcome: 'Analysis with replacement value estimate',
        successMetric: 'Insurance-appropriate valuation provided',
        criteriaIds: ['VAL-001', 'VAL-003']
      },
      {
        order: 2,
        action: 'User adds to collection',
        expectedOutcome: 'Item saved to personal collection',
        successMetric: 'Collection storage working',
        criteriaIds: ['PERF-002']
      },
      {
        order: 3,
        action: 'User generates PDF report',
        expectedOutcome: 'Professional appraisal-style document',
        successMetric: 'PDF includes photos, description, values',
        criteriaIds: ['UX-002']
      },
      {
        order: 4,
        action: 'User views collection analytics',
        expectedOutcome: 'Total collection value, breakdown by category',
        successMetric: 'Analytics dashboard accurate',
        criteriaIds: ['VAL-001']
      }
    ],
    successConditions: [
      'Professional PDF suitable for insurer',
      'Replacement values documented',
      'Photos included in documentation',
      'Collection total calculated'
    ]
  },

  // JOURNEY 5: Value Tracking Over Time
  {
    id: 'UJ-005',
    name: 'Investment Tracking',
    persona: 'Collector-Investor - tracking portfolio value',
    description: 'User wants to track value changes of their collection over time',
    priority: 'medium',
    steps: [
      {
        order: 1,
        action: 'User views collection dashboard',
        expectedOutcome: 'Collection overview with current values',
        successMetric: 'Dashboard loads with value summaries',
        criteriaIds: ['VAL-001', 'PERF-001']
      },
      {
        order: 2,
        action: 'User checks value trends',
        expectedOutcome: 'Historical value data shown',
        successMetric: 'Trend data available and accurate',
        criteriaIds: ['VAL-004']
      },
      {
        order: 3,
        action: 'User sets price alerts',
        expectedOutcome: 'Alert configuration saved',
        successMetric: 'Alert system functional',
        criteriaIds: ['PERF-002']
      },
      {
        order: 4,
        action: 'User compares items',
        expectedOutcome: 'Side-by-side comparison view',
        successMetric: 'Comparison tool functional',
        criteriaIds: ['ID-001', 'VAL-001']
      }
    ],
    successConditions: [
      'Portfolio value visible',
      'Value changes tracked',
      'Comparison tools functional',
      'Alerts configurable'
    ]
  },

  // JOURNEY 6: Expert Escalation for High-Value Items
  {
    id: 'UJ-006',
    name: 'Expert Verification Request',
    persona: 'Seller - preparing for auction',
    description: 'User has valuable item and wants expert human verification',
    priority: 'high',
    steps: [
      {
        order: 1,
        action: 'User receives high-value AI analysis',
        expectedOutcome: 'AI identifies potentially valuable item',
        successMetric: 'Valuable items flagged appropriately',
        criteriaIds: ['ID-001', 'VAL-001']
      },
      {
        order: 2,
        action: 'User sees expert escalation option',
        expectedOutcome: 'Clear offer for human expert review',
        successMetric: 'Escalation CTA visible for high-value items',
        criteriaIds: ['UX-002']
      },
      {
        order: 3,
        action: 'User requests expert review',
        expectedOutcome: 'Request submitted, timeline provided',
        successMetric: 'Request flow completes, confirmation shown',
        criteriaIds: ['PERF-002']
      },
      {
        order: 4,
        action: 'User receives expert opinion',
        expectedOutcome: 'Detailed expert analysis with credentials',
        successMetric: 'Expert response received',
        criteriaIds: ['AUTH-001', 'AUTH-004']
      }
    ],
    successConditions: [
      'Expert escalation option available',
      'Request successfully submitted',
      'Timeline communicated',
      'Expert credentials visible'
    ]
  }
]

// ============================================================================
// E2E TEST DEFINITIONS
// ============================================================================

export interface E2ETestCase {
  id: string
  name: string
  journeyId: string
  type: 'functional' | 'accuracy' | 'performance' | 'integration'
  description: string
  preconditions: string[]
  steps: {
    action: string
    assertion: string
  }[]
  expectedResult: string
  criteriaIds: string[]
  automated: boolean
}

export const E2E_TEST_CASES: E2ETestCase[] = [
  // FUNCTIONAL TESTS
  {
    id: 'E2E-001',
    name: 'Basic Analysis Flow',
    journeyId: 'UJ-001',
    type: 'functional',
    description: 'Complete analysis from image upload to results',
    preconditions: ['Application running', 'API available'],
    steps: [
      { action: 'Navigate to homepage', assertion: 'Upload button visible' },
      { action: 'Upload test image', assertion: 'Image preview displayed' },
      { action: 'Submit for analysis', assertion: 'Progress indicator shown' },
      { action: 'Wait for completion', assertion: 'Results displayed' },
      { action: 'Check result structure', assertion: 'Name, era, value, confidence present' }
    ],
    expectedResult: 'Analysis completes with valid structured result',
    criteriaIds: ['ID-001', 'VAL-001', 'PERF-001', 'PERF-002'],
    automated: true
  },
  {
    id: 'E2E-002',
    name: 'Collection Management',
    journeyId: 'UJ-004',
    type: 'functional',
    description: 'Save and manage items in collection',
    preconditions: ['User authenticated', 'Analysis completed'],
    steps: [
      { action: 'Complete analysis', assertion: 'Save button available' },
      { action: 'Save to collection', assertion: 'Success confirmation' },
      { action: 'Navigate to collection', assertion: 'Item appears in list' },
      { action: 'View item details', assertion: 'Full analysis visible' }
    ],
    expectedResult: 'Item saved and retrievable from collection',
    criteriaIds: ['PERF-002'],
    automated: true
  },
  {
    id: 'E2E-003',
    name: 'PDF Export Generation',
    journeyId: 'UJ-004',
    type: 'functional',
    description: 'Generate PDF report for insurance',
    preconditions: ['Premium user', 'Analysis completed'],
    steps: [
      { action: 'Complete analysis', assertion: 'Export button visible' },
      { action: 'Click export PDF', assertion: 'PDF generation starts' },
      { action: 'Wait for generation', assertion: 'Download triggered' },
      { action: 'Open PDF', assertion: 'Contains item details, images, values' }
    ],
    expectedResult: 'Valid PDF with all analysis details',
    criteriaIds: ['UX-002'],
    automated: true
  },
  {
    id: 'E2E-004',
    name: 'Batch Analysis',
    journeyId: 'UJ-003',
    type: 'functional',
    description: 'Process multiple items in batch',
    preconditions: ['Premium user', 'Multiple test images'],
    steps: [
      { action: 'Navigate to batch analysis', assertion: 'Batch upload available' },
      { action: 'Upload 5 test images', assertion: 'All images queued' },
      { action: 'Start batch processing', assertion: 'Progress shown for each' },
      { action: 'Wait for completion', assertion: 'All items analyzed' },
      { action: 'View summary', assertion: 'Aggregate value shown' }
    ],
    expectedResult: 'All items processed with summary report',
    criteriaIds: ['PERF-001', 'PERF-002', 'VAL-001'],
    automated: true
  },

  // ACCURACY TESTS
  {
    id: 'E2E-010',
    name: 'Ground Truth - Furniture Identification',
    journeyId: 'UJ-001',
    type: 'accuracy',
    description: 'Test furniture identification accuracy against ground truth',
    preconditions: ['Ground truth dataset loaded', 'Furniture images ready'],
    steps: [
      { action: 'Load furniture test items', assertion: 'Items loaded' },
      { action: 'Run analysis on each', assertion: 'Results returned' },
      { action: 'Compare to ground truth', assertion: 'Score calculated' },
      { action: 'Calculate accuracy', assertion: '>= 95% threshold' }
    ],
    expectedResult: 'Furniture identification meets 95% accuracy threshold',
    criteriaIds: ['ID-001', 'ID-002', 'ID-003'],
    automated: true
  },
  {
    id: 'E2E-011',
    name: 'Ground Truth - Valuation Accuracy',
    journeyId: 'UJ-001',
    type: 'accuracy',
    description: 'Test value estimation accuracy against known values',
    preconditions: ['Ground truth dataset loaded'],
    steps: [
      { action: 'Run analysis on all test items', assertion: 'Results returned' },
      { action: 'Compare values to ground truth', assertion: 'Deviations calculated' },
      { action: 'Check range coverage', assertion: '>= 85% within range' }
    ],
    expectedResult: 'Value estimates accurate to within ground truth ranges',
    criteriaIds: ['VAL-001', 'VAL-002'],
    automated: true
  },
  {
    id: 'E2E-012',
    name: 'Ground Truth - Authentication',
    journeyId: 'UJ-002',
    type: 'accuracy',
    description: 'Test authentication assessment accuracy',
    preconditions: ['Ground truth with auth markers', 'Known fakes included'],
    steps: [
      { action: 'Analyze items with known auth status', assertion: 'Results returned' },
      { action: 'Check auth markers detected', assertion: 'Markers identified' },
      { action: 'Check red flags for fakes', assertion: 'Fakes flagged' },
      { action: 'Calculate detection rate', assertion: '>= 95% red flag detection' }
    ],
    expectedResult: 'Authentication markers and red flags correctly identified',
    criteriaIds: ['AUTH-001', 'AUTH-002', 'AUTH-003'],
    automated: true
  },

  // PERFORMANCE TESTS
  {
    id: 'E2E-020',
    name: 'Analysis Response Time',
    journeyId: 'UJ-001',
    type: 'performance',
    description: 'Measure analysis completion time',
    preconditions: ['Normal system load'],
    steps: [
      { action: 'Submit standard test image', assertion: 'Request accepted' },
      { action: 'Measure time to completion', assertion: '< 15 seconds' }
    ],
    expectedResult: 'Analysis completes in under 15 seconds',
    criteriaIds: ['PERF-001'],
    automated: true
  },
  {
    id: 'E2E-021',
    name: 'Reliability Under Load',
    journeyId: 'UJ-003',
    type: 'performance',
    description: 'Test system reliability with concurrent requests',
    preconditions: ['System idle'],
    steps: [
      { action: 'Submit 10 concurrent requests', assertion: 'All accepted' },
      { action: 'Wait for all completions', assertion: 'All complete' },
      { action: 'Check error rate', assertion: '< 1% errors' }
    ],
    expectedResult: '99%+ success rate under concurrent load',
    criteriaIds: ['PERF-002'],
    automated: true
  },

  // INTEGRATION TESTS
  {
    id: 'E2E-030',
    name: 'End-to-End Collector Journey',
    journeyId: 'UJ-002',
    type: 'integration',
    description: 'Complete collector authentication workflow',
    preconditions: ['User authenticated', 'Premium access'],
    steps: [
      { action: 'Upload item image', assertion: 'Analysis starts' },
      { action: 'View authentication results', assertion: 'Auth section present' },
      { action: 'Review evidence', assertion: 'Evidence for/against shown' },
      { action: 'Save to collection', assertion: 'Item saved' },
      { action: 'Generate PDF', assertion: 'PDF includes auth info' }
    ],
    expectedResult: 'Complete workflow succeeds with authentication data',
    criteriaIds: ['AUTH-001', 'AUTH-004', 'UX-002'],
    automated: true
  }
]

// ============================================================================
// SELF-LEARNING SYSTEM SPECIFICATION
// ============================================================================

export interface LearningDataPoint {
  id: string
  timestamp: Date
  analysisId: string
  imageHash: string
  originalPrediction: {
    name: string
    maker: string | null
    era: string
    style: string
    valueMin: number
    valueMax: number
    confidence: number
    authenticationConfidence?: number
  }
  correction?: {
    source: 'expert' | 'user' | 'auction_result' | 'ground_truth'
    correctedFields: string[]
    correctedValues: Record<string, unknown>
    timestamp: Date
    verifiedBy?: string
  }
  outcome?: {
    actualSalePrice?: number
    actualAuthenticity?: boolean
    saleVenue?: string
    outcomeDate?: Date
  }
  metadata: {
    imageQuality: 'low' | 'medium' | 'high'
    difficulty: 'easy' | 'medium' | 'hard' | 'expert'
    category: string
  }
}

export interface SelfLearningConfig {
  // Minimum confidence to accept correction
  correctionConfidenceThreshold: number

  // Number of confirmations needed to update model knowledge
  confirmationsRequired: number

  // Time window to aggregate similar corrections
  aggregationWindowHours: number

  // Categories that require expert verification
  expertOnlyCategories: string[]

  // Automatic feedback collection from auction results
  auctionFeedbackEnabled: boolean

  // Pattern detection for common mistakes
  patternDetectionEnabled: boolean

  // Minimum dataset size before learning triggers
  minimumDataPoints: number
}

export const DEFAULT_LEARNING_CONFIG: SelfLearningConfig = {
  correctionConfidenceThreshold: 0.7,
  confirmationsRequired: 3,
  aggregationWindowHours: 168, // 1 week
  expertOnlyCategories: ['fine_art', 'jewelry', 'rare_books'],
  auctionFeedbackEnabled: true,
  patternDetectionEnabled: true,
  minimumDataPoints: 100
}

// Learning signals to track
export interface LearningSummary {
  totalAnalyses: number
  totalCorrections: number
  correctionRate: number

  // Most common corrections by field
  topCorrectedFields: {
    field: string
    count: number
    avgConfidenceBeforeCorrection: number
  }[]

  // Categories with highest error rates
  problematicCategories: {
    category: string
    errorRate: number
    sampleSize: number
  }[]

  // Patterns in failures
  identifiedPatterns: {
    pattern: string
    occurrences: number
    suggestedFix: string
  }[]

  // Improvement over time
  accuracyTrend: {
    period: string
    accuracy: number
  }[]
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getCriteriaBySeverity(priority: AnalysisCriteria['priority']): AnalysisCriteria[] {
  return ANALYSIS_SUCCESS_CRITERIA.filter(c => c.priority === priority)
}

export function getTestablesCriteria(): AnalysisCriteria[] {
  return ANALYSIS_SUCCESS_CRITERIA.filter(c => c.testable)
}

export function getJourneyById(id: string): UserJourney | undefined {
  return USER_JOURNEYS.find(j => j.id === id)
}

export function getE2ETestsForJourney(journeyId: string): E2ETestCase[] {
  return E2E_TEST_CASES.filter(t => t.journeyId === journeyId)
}

export function getE2ETestsForCriteria(criteriaId: string): E2ETestCase[] {
  return E2E_TEST_CASES.filter(t => t.criteriaIds.includes(criteriaId))
}

export function getCriticalCriteria(): AnalysisCriteria[] {
  return getCriteriaBySeverity('critical')
}

export function getAutomatedTests(): E2ETestCase[] {
  return E2E_TEST_CASES.filter(t => t.automated)
}

export function calculateCriteriaThresholdMet(
  criteriaId: string,
  actualValue: number
): boolean {
  const criteria = ANALYSIS_SUCCESS_CRITERIA.find(c => c.id === criteriaId)
  if (!criteria) return false

  // Handle 'max' thresholds differently
  if (criteria.unit.includes('max')) {
    return actualValue <= criteria.threshold
  }
  return actualValue >= criteria.threshold
}

// Summary report generator
export function generateCriteriaReport(results: { criteriaId: string; actual: number; passed: boolean }[]): string {
  const lines: string[] = [
    '╔══════════════════════════════════════════════════════════════════════════╗',
    '║                    VINTAGEVISION SUCCESS CRITERIA REPORT                   ║',
    '╠══════════════════════════════════════════════════════════════════════════╣'
  ]

  const categories = ['identification', 'valuation', 'authentication', 'ux', 'performance']

  for (const category of categories) {
    lines.push(`║ ${category.toUpperCase().padEnd(74)}║`)
    lines.push('║' + '─'.repeat(76) + '║')

    const categoryCriteria = ANALYSIS_SUCCESS_CRITERIA.filter(c => c.category === category)

    for (const criteria of categoryCriteria) {
      const result = results.find(r => r.criteriaId === criteria.id)
      const status = result ? (result.passed ? '✓' : '✗') : '○'
      const actual = result ? result.actual.toFixed(1) : '—'
      const threshold = `${criteria.threshold}${criteria.unit}`

      lines.push(
        `║ ${status} ${criteria.id.padEnd(10)} ${criteria.name.padEnd(30)} ${actual.padStart(10)} / ${threshold.padEnd(15)}║`
      )
    }
    lines.push('║' + ' '.repeat(76) + '║')
  }

  const passed = results.filter(r => r.passed).length
  const total = results.length
  const passRate = ((passed / total) * 100).toFixed(1)

  lines.push('╠══════════════════════════════════════════════════════════════════════════╣')
  lines.push(`║  OVERALL: ${passed}/${total} criteria met (${passRate}%)`.padEnd(77) + '║')
  lines.push('╚══════════════════════════════════════════════════════════════════════════╝')

  return lines.join('\n')
}
