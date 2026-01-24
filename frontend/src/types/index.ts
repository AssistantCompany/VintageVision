// TypeScript Types for VintageVision
// World-Class Treasure Hunting System v2.0
// January 2026 - Multi-Image, Visual Evidence, Real Market Data

// Subscription tiers
export type SubscriptionTier = 'free' | 'collector' | 'professional';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  subscriptionTier?: SubscriptionTier;
}

// ============================================================================
// CORE ENUMS & TYPES
// ============================================================================

export type ProductCategory = 'antique' | 'vintage' | 'modern_branded' | 'modern_generic';

export type DomainExpert =
  | 'furniture'
  | 'ceramics'
  | 'glass'
  | 'silver'
  | 'jewelry'
  | 'watches'
  | 'art'
  | 'textiles'
  | 'toys'
  | 'books'
  | 'tools'
  | 'lighting'
  | 'electronics'
  | 'vehicles'
  | 'general';

export type DealRating = 'exceptional' | 'good' | 'fair' | 'overpriced';
export type FlipDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';
export type AuthenticityRisk = 'low' | 'medium' | 'high' | 'very_high';
export type AuthCheckCategory = 'visual' | 'physical' | 'documentation' | 'provenance';
export type AuthCheckPriority = 'critical' | 'important' | 'helpful';
export type PhotoRequestPriority = 'required' | 'recommended' | 'optional';

// ============================================================================
// MULTI-IMAGE CAPTURE SYSTEM (NEW)
// ============================================================================

// Image role in multi-image capture flow
export type ImageRole =
  | 'overview'      // Main shot showing full item
  | 'detail'        // Close-up of specific feature
  | 'marks'         // Maker's marks, signatures, labels
  | 'underside'     // Bottom, back, hidden areas
  | 'damage'        // Wear, damage, repairs
  | 'context'       // Size reference, environment
  | 'additional';   // User-added supplementary

// Single captured image with metadata
export interface CapturedImage {
  id: string;
  dataUrl: string;
  role: ImageRole;
  label: string;           // "Overview", "Maker's Mark", etc.
  instruction?: string;    // "Show the bottom of the item"
  capturedAt: string;
  thumbnailUrl?: string;   // Smaller version for preview
}

// Guided capture request (what photos we need)
export interface CaptureRequest {
  role: ImageRole;
  priority: 'required' | 'recommended' | 'optional';
  label: string;
  instruction: string;
  example?: string;        // URL to example image
  targetArea?: string;     // "bottom left corner", "inside lid"
}

// Multi-image analysis request
export interface MultiImageAnalysisRequest {
  images: CapturedImage[];
  askingPrice?: number;
  context?: string;        // User notes about the item
}

// ============================================================================
// VISUAL EVIDENCE SYSTEM (NEW)
// ============================================================================

// Bounding box for visual marker on image
export interface BoundingBox {
  x: number;       // % from left (0-100)
  y: number;       // % from top (0-100)
  width: number;   // % of image width
  height: number;  // % of image height
}

// Visual evidence marker overlaid on image
export interface VisualMarker {
  id: string;
  imageId: string;         // Which image this marker is on
  type: 'maker_mark' | 'text' | 'construction' | 'damage' | 'feature' | 'red_flag' | 'authentication';
  bbox: BoundingBox;
  label: string;           // Short label for display
  finding: string;         // What this evidence tells us
  confidence: number;      // How confident in this finding
  isPositive: boolean;     // Green (supports) vs Red (contradicts)
}

// ============================================================================
// HONEST CONFIDENCE SYSTEM (NEW)
// ============================================================================

// Knowledge state - what we know vs what we need
export interface KnowledgeState {
  // What we can confirm with high confidence
  confirmed: ConfirmedFact[];

  // What we believe but can't fully verify
  probable: ProbableFact[];

  // What we need more info to determine
  needsVerification: VerificationNeed[];

  // Overall knowledge completeness (0-1)
  completeness: number;
}

export interface ConfirmedFact {
  statement: string;       // "Arts & Crafts style construction"
  evidence: string;        // "Visible mortise-and-tenon joinery with pegged construction"
  confidence: number;      // 0.9+
}

export interface ProbableFact {
  statement: string;       // "Likely Stickley Brothers, Grand Rapids"
  evidence: string;        // "Style matches, but no visible maker's mark"
  confidence: number;      // 0.6-0.89
  howToConfirm: string;    // "Look for paper label inside drawer"
}

export interface VerificationNeed {
  question: string;        // "Who made this piece?"
  photoNeeded: string;     // "Photo of bottom/back for maker's mark"
  importance: 'critical' | 'important' | 'helpful';
  impactOnValue: string;   // "Confirmed Stickley could 3x the value"
}

// ============================================================================
// REAL MARKET DATA SYSTEM (NEW)
// ============================================================================

// Real sold listing from marketplace
export interface SoldListing {
  id: string;
  title: string;
  soldPrice: number;
  soldDate: string;
  marketplace: 'ebay' | 'liveauctioneers' | 'christies' | 'sothebys' | 'chairish' | 'firstdibs' | 'other';
  condition: string;
  imageUrl?: string;
  listingUrl: string;
  similarity: number;      // How similar to user's item (0-1)
  notes?: string;          // Why this comp is relevant
}

// Current active listing
export interface ActiveListing {
  id: string;
  title: string;
  askingPrice: number;
  marketplace: string;
  condition: string;
  imageUrl?: string;
  listingUrl: string;
  daysListed: number;
  similarity: number;
}

// Complete market intelligence
export interface MarketIntelligence {
  // Real sold data
  recentSales: SoldListing[];
  averageSoldPrice: number;
  priceRange: { low: number; high: number };
  salesVelocity: string;   // "3-5 similar items sell per month"

  // Current market
  activeListings: ActiveListing[];
  averageAskingPrice: number;

  // Market analysis
  demandLevel: 'hot' | 'steady' | 'slow' | 'cold';
  pricetrend: 'rising' | 'stable' | 'declining';
  bestVenues: string[];    // Where to sell
  seasonality?: string;    // "Prices peak in December"

  // Data quality
  dataConfidence: number;  // How good is our market data (0-1)
  lastUpdated: string;
}

// ============================================================================
// ITEM-SPECIFIC AUTHENTICATION (NEW)
// ============================================================================

// Authentication finding specific to THIS item (not generic checklist)
export interface AuthenticationFinding {
  id: string;
  area: string;            // "Cyclops lens", "Caseback engraving"
  observation: string;     // "2.5x magnification observed"
  expectedFor: string;     // "Authentic Rolex Submariner 16610"
  status: 'pass' | 'fail' | 'inconclusive' | 'needs_verification';
  confidence: number;
  explanation: string;     // "Magnification appears correct for this reference"
  imageId?: string;        // Which image shows this
  marker?: VisualMarker;   // Bounding box on image
}

// Overall authentication assessment for THIS item
export interface ItemAuthentication {
  overallVerdict: 'likely_authentic' | 'likely_fake' | 'inconclusive' | 'needs_expert';
  confidenceScore: number;

  // Specific findings from the images
  findings: AuthenticationFinding[];

  // Summary counts
  passedChecks: number;
  failedChecks: number;
  inconclusiveChecks: number;

  // Critical issues (instant red flags)
  criticalIssues: string[];

  // Recommendation
  recommendation: string;
  expertNeeded: boolean;
  expertType?: string;     // "Certified Rolex watchmaker"
}

// ============================================================================
// REFERENCE COMPARISON (NEW)
// ============================================================================

// Reference image for comparison
export interface ReferenceImage {
  id: string;
  imageUrl: string;
  source: string;          // "Christie's auction lot 234"
  description: string;     // "Authenticated example"
  relevance: string;       // "Same maker and period"
}

// Comparison between user's item and reference
export interface ReferenceComparison {
  reference: ReferenceImage;
  similarityScore: number;
  matchingFeatures: string[];
  differingFeatures: string[];
  interpretation: string;
}

// ============================================================================
// LEGACY TYPES (maintained for compatibility)
// ============================================================================

export interface AuthenticationCheck {
  id: string;
  category: AuthCheckCategory;
  priority: AuthCheckPriority;
  check: string;
  howTo: string;
  whatToLookFor: string;
  redFlagSigns: string[];
  requiresExpert: boolean;
  photoHelpful: boolean;
  completed?: boolean;
  userNotes?: string;
  userResult?: 'pass' | 'fail' | 'uncertain';
}

export interface PhotoRequest {
  id: string;
  area: string;
  reason: string;
  whatToCapture: string;
  priority: PhotoRequestPriority;
  submitted?: boolean;
  imageUrl?: string;
  analysisResult?: PhotoAnalysisResult;
}

export interface PhotoAnalysisResult {
  findingsFor: string[];
  findingsAgainst: string[];
  assessment: string;
  confidence: number;
}

export interface AuthenticationResult {
  authenticationConfidence: number;
  authenticityRisk: AuthenticityRisk;
  checklist: AuthenticationCheck[];
  knownFakeIndicators: string[];
  photosRequested: PhotoRequest[];
  expertReferralRecommended: boolean;
  expertReferralReason: string | null;
  overallAssessment: string;
}

export interface AuthenticationSession {
  analysisId: string;
  step: 'overview' | 'checklist' | 'photos' | 'report';
  checklistProgress: number;
  photosSubmitted: number;
  photosRequired: number;
  updatedConfidence: number | null;
  startedAt: string;
  completedAt: string | null;
}

export interface ComparableSale {
  description: string;
  venue: string;
  price: number;
  date: string;
  relevance: string;
}

export interface AlternativeCandidate {
  name: string;
  confidence: number;
  reason: string;
}

export interface StylingSuggestion {
  roomType: string;
  title: string;
  description: string;
  placement?: string | null;
  complementaryItems: string[];
  colorPalette: string[];
  designTips?: string | null;
}

export interface MarketplaceLinkSimple {
  marketplaceName: string;
  linkUrl: string;
}

// ============================================================================
// WORLD-CLASS ITEM ANALYSIS (ENHANCED)
// ============================================================================

export interface ItemAnalysis {
  id: string;

  // Core identification
  name: string;
  maker: string | null;
  modelNumber: string | null;
  brand: string | null;

  // Categorization
  productCategory: ProductCategory | null;
  domainExpert: DomainExpert | null;
  itemSubcategory: string | null;

  // Period and origin
  era: string | null;
  style: string | null;
  periodStart: number | null;
  periodEnd: number | null;
  originRegion: string | null;

  // Description
  description: string;
  historicalContext: string;
  attributionNotes: string | null;

  // === ENHANCED VALUATION (with real market data) ===
  estimatedValueMin: number | null;
  estimatedValueMax: number | null;
  currentRetailPrice: number | null;

  // Real market data (NEW)
  marketIntelligence: MarketIntelligence | null;

  // Legacy comparable sales (AI-generated, kept for compatibility)
  comparableSales: ComparableSale[] | null;

  // === HONEST CONFIDENCE SYSTEM (NEW) ===
  confidence: number;
  identificationConfidence: number | null;
  makerConfidence: number | null;

  // Knowledge state - what we know vs don't know
  knowledgeState: KnowledgeState | null;

  // Legacy evidence arrays
  evidenceFor: string[] | null;
  evidenceAgainst: string[] | null;

  // === VISUAL EVIDENCE (NEW) ===
  visualMarkers: VisualMarker[] | null;

  // Alternative candidates
  alternativeCandidates: AlternativeCandidate[] | null;

  // Verification guidance
  verificationTips: string[] | null;
  redFlags: string[] | null;

  // Deal analysis
  askingPrice: number | null;
  dealRating: DealRating | null;
  dealExplanation: string | null;
  profitPotentialMin: number | null;
  profitPotentialMax: number | null;

  // Flip assessment
  flipDifficulty: FlipDifficulty | null;
  flipTimeEstimate: string | null;
  resaleChannels: string[] | null;

  // === ITEM-SPECIFIC AUTHENTICATION (NEW) ===
  itemAuthentication: ItemAuthentication | null;

  // Legacy authentication fields (kept for compatibility)
  authenticationConfidence: number | null;
  authenticityRisk: AuthenticityRisk | null;
  authenticationChecklist: AuthenticationCheck[] | null;
  knownFakeIndicators: string[] | null;
  additionalPhotosRequested: PhotoRequest[] | null;
  expertReferralRecommended: boolean | null;
  expertReferralReason: string | null;
  authenticationAssessment: string | null;

  // === REFERENCE COMPARISONS (NEW) ===
  referenceComparisons: ReferenceComparison[] | null;

  // === MULTI-IMAGE SUPPORT ===
  imageUrl: string;               // Primary image
  additionalImages: CapturedImage[] | null;  // All images used

  // === CAPTURE GUIDANCE (NEW) ===
  // What additional photos would help improve analysis
  suggestedCaptures: CaptureRequest[] | null;

  // Legacy/Additional fields
  stylingSuggestions: StylingSuggestion[] | null;
  productUrl: string | null;
  marketplaceLinks: (MarketplaceLinkSimple | MarketplaceLink)[] | null;

  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  userId: string;
  itemAnalysisId: string;
  notes: string | null;
  location: string | null;
  savedAt: string;
  updatedAt: string;
  analysis?: ItemAnalysis;
}

export interface UserPreference {
  id: string;
  userId: string;
  preferredStyles: string[] | null;
  roomTypes: string[] | null;
  budgetRangeMin: number | null;
  budgetRangeMax: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisFeedback {
  id: string;
  userId: string;
  itemAnalysisId: string;
  isCorrect: boolean;
  correctionText: string | null;
  feedbackType: 'accuracy' | 'styling' | 'value';
  createdAt: string;
}

export interface UserWishlist {
  id: string;
  userId: string;
  itemAnalysisId: string | null;
  searchCriteria: Record<string, unknown> | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceLink {
  id: string;
  itemAnalysisId: string;
  marketplaceName: string;
  linkUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  confidenceScore: number | null;
  createdAt: string;
}

// AnalysisResult is an alias for ItemAnalysis
export type AnalysisResult = ItemAnalysis;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDealRatingColor(rating: DealRating | null): string {
  switch (rating) {
    case 'exceptional':
      return 'text-green-600 bg-green-100';
    case 'good':
      return 'text-blue-600 bg-blue-100';
    case 'fair':
      return 'text-yellow-600 bg-yellow-100';
    case 'overpriced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getFlipDifficultyColor(difficulty: FlipDifficulty | null): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600';
    case 'moderate':
      return 'text-yellow-600';
    case 'hard':
      return 'text-orange-600';
    case 'very_hard':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getDomainExpertName(expert: DomainExpert | null): string {
  const names: Record<DomainExpert, string> = {
    furniture: 'Furniture Expert',
    ceramics: 'Ceramics & Pottery Expert',
    glass: 'Glass Expert',
    silver: 'Silver & Metalware Expert',
    jewelry: 'Jewelry Expert',
    watches: 'Horology Expert',
    art: 'Art & Prints Expert',
    textiles: 'Textiles & Rugs Expert',
    toys: 'Toys & Dolls Expert',
    books: 'Books & Ephemera Expert',
    tools: 'Tools & Instruments Expert',
    lighting: 'Lighting Expert',
    electronics: 'Electronics Expert',
    vehicles: 'Vehicles Expert',
    general: 'General Expert',
  };
  return expert ? names[expert] : 'Expert';
}

export function formatPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents);
}

export function formatPriceRange(min: number | null | undefined, max: number | null | undefined): string {
  if ((min === null || min === undefined) && (max === null || max === undefined)) return 'Value not estimated';
  if (min === null || min === undefined) return `Up to ${formatPrice(max)}`;
  if (max === null || max === undefined) return `From ${formatPrice(min)}`;
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

// Round to human-friendly values (avoid fake precision)
export function humanizePrice(price: number): number {
  if (price < 100) return Math.round(price / 10) * 10;         // Round to $10
  if (price < 1000) return Math.round(price / 50) * 50;        // Round to $50
  if (price < 10000) return Math.round(price / 100) * 100;     // Round to $100
  if (price < 100000) return Math.round(price / 500) * 500;    // Round to $500
  return Math.round(price / 1000) * 1000;                      // Round to $1000
}

export function getAuthenticityRiskColor(risk: AuthenticityRisk | null): string {
  switch (risk) {
    case 'low':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'high':
      return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'very_high':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

export function getAuthenticityRiskLabel(risk: AuthenticityRisk | null): string {
  switch (risk) {
    case 'low':
      return 'Low Risk';
    case 'medium':
      return 'Medium Risk';
    case 'high':
      return 'High Risk';
    case 'very_high':
      return 'Very High Risk';
    default:
      return 'Unknown Risk';
  }
}

export function getCheckPriorityColor(priority: AuthCheckPriority): string {
  switch (priority) {
    case 'critical':
      return 'text-red-600 bg-red-50';
    case 'important':
      return 'text-orange-600 bg-orange-50';
    case 'helpful':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getPhotoPriorityColor(priority: PhotoRequestPriority): string {
  switch (priority) {
    case 'required':
      return 'text-red-600 border-red-300 bg-red-50';
    case 'recommended':
      return 'text-amber-600 border-amber-300 bg-amber-50';
    case 'optional':
      return 'text-blue-600 border-blue-300 bg-blue-50';
    default:
      return 'text-gray-600 border-gray-300 bg-gray-50';
  }
}

export function calculateChecklistProgress(checklist: AuthenticationCheck[] | null): number {
  if (!checklist || checklist.length === 0) return 0;
  const completed = checklist.filter(c => c.completed).length;
  return Math.round((completed / checklist.length) * 100);
}

export function formatConfidence(confidence: number | null): string {
  if (confidence === null) return 'N/A';
  return `${Math.round(confidence * 100)}%`;
}

// NEW: Get knowledge completeness label
export function getKnowledgeLabel(completeness: number): { label: string; color: string } {
  if (completeness >= 0.9) return { label: 'High Certainty', color: 'text-green-600 bg-green-100' };
  if (completeness >= 0.7) return { label: 'Good Understanding', color: 'text-blue-600 bg-blue-100' };
  if (completeness >= 0.5) return { label: 'Partial Information', color: 'text-yellow-600 bg-yellow-100' };
  return { label: 'Limited Data', color: 'text-orange-600 bg-orange-100' };
}

// NEW: Get authentication verdict styling
export function getAuthVerdictStyle(verdict: ItemAuthentication['overallVerdict']): { label: string; color: string; icon: string } {
  switch (verdict) {
    case 'likely_authentic':
      return { label: 'Likely Authentic', color: 'text-green-700 bg-green-100 border-green-300', icon: '✓' };
    case 'likely_fake':
      return { label: 'Likely Not Authentic', color: 'text-red-700 bg-red-100 border-red-300', icon: '✗' };
    case 'inconclusive':
      return { label: 'Inconclusive', color: 'text-yellow-700 bg-yellow-100 border-yellow-300', icon: '?' };
    case 'needs_expert':
      return { label: 'Expert Review Needed', color: 'text-purple-700 bg-purple-100 border-purple-300', icon: '!' };
    default:
      return { label: 'Unknown', color: 'text-gray-700 bg-gray-100 border-gray-300', icon: '-' };
  }
}

// NEW: Get finding status color
export function getFindingStatusColor(status: AuthenticationFinding['status']): string {
  switch (status) {
    case 'pass':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'fail':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'inconclusive':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'needs_verification':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

// NEW: Get demand level styling
export function getDemandLevelStyle(level: MarketIntelligence['demandLevel']): { label: string; color: string } {
  switch (level) {
    case 'hot':
      return { label: '🔥 High Demand', color: 'text-red-600 bg-red-100' };
    case 'steady':
      return { label: '📈 Steady Market', color: 'text-green-600 bg-green-100' };
    case 'slow':
      return { label: '📉 Slow Market', color: 'text-yellow-600 bg-yellow-100' };
    case 'cold':
      return { label: '❄️ Low Demand', color: 'text-blue-600 bg-blue-100' };
    default:
      return { label: 'Unknown', color: 'text-gray-600 bg-gray-100' };
  }
}

// NEW: Get image role label
export function getImageRoleLabel(role: ImageRole): string {
  const labels: Record<ImageRole, string> = {
    overview: 'Overview',
    detail: 'Detail',
    marks: "Maker's Marks",
    underside: 'Underside/Back',
    damage: 'Condition/Damage',
    context: 'Size Reference',
    additional: 'Additional',
  };
  return labels[role] || role;
}

// NEW: Get capture priority color
export function getCapturePriorityColor(priority: CaptureRequest['priority']): string {
  switch (priority) {
    case 'required':
      return 'border-red-400 bg-red-50';
    case 'recommended':
      return 'border-amber-400 bg-amber-50';
    case 'optional':
      return 'border-blue-400 bg-blue-50';
    default:
      return 'border-gray-400 bg-gray-50';
  }
}

// ============================================================================
// SUBSCRIPTION TIER LIMITS & HELPERS
// ============================================================================

export const TIER_LIMITS = {
  free: {
    analysesPerMonth: 3,
    collectionItems: 3,
    expertReviews: 0,
    batchAnalysis: false,
    pdfExport: false,
    priceAlerts: false,
    apiAccess: false,
  },
  collector: {
    analysesPerMonth: Infinity,
    collectionItems: Infinity,
    expertReviews: 2,
    batchAnalysis: true,
    pdfExport: true,
    priceAlerts: true,
    apiAccess: false,
  },
  professional: {
    analysesPerMonth: Infinity,
    collectionItems: Infinity,
    expertReviews: 10,
    batchAnalysis: true,
    pdfExport: true,
    priceAlerts: true,
    apiAccess: true,
  },
} as const;

export const TIER_PRICING = {
  free: { monthly: 0, annual: 0 },
  collector: { monthly: 9.99, annual: 99.99 },
  professional: { monthly: 29.99, annual: 299.99 },
} as const;

export const TIER_NAMES: Record<SubscriptionTier, string> = {
  free: 'Free',
  collector: 'Collector',
  professional: 'Professional',
};

export function getTierLimit(tier: SubscriptionTier | undefined, feature: keyof typeof TIER_LIMITS['free']): number | boolean {
  const actualTier = tier || 'free';
  return TIER_LIMITS[actualTier][feature];
}

export function canAccessFeature(tier: SubscriptionTier | undefined, feature: keyof typeof TIER_LIMITS['free']): boolean {
  const limit = getTierLimit(tier, feature);
  if (typeof limit === 'boolean') return limit;
  return limit > 0;
}

export function getRemainingCollectionSlots(tier: SubscriptionTier | undefined, currentCount: number): number {
  const limit = TIER_LIMITS[tier || 'free'].collectionItems;
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentCount);
}

export function isCollectionFull(tier: SubscriptionTier | undefined, currentCount: number): boolean {
  const limit = TIER_LIMITS[tier || 'free'].collectionItems;
  return limit !== Infinity && currentCount >= limit;
}
