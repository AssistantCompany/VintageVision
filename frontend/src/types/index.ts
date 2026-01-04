// TypeScript Types for VintageVision
// World-Class Treasure Hunting System
// January 2026

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

// Product category types
export type ProductCategory = 'antique' | 'vintage' | 'modern_branded' | 'modern_generic';

// Domain expert types
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

// Deal rating types
export type DealRating = 'exceptional' | 'good' | 'fair' | 'overpriced';

// Flip difficulty types
export type FlipDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';

// === AUTHENTICATION SYSTEM TYPES (Jan 2026) ===

// Authenticity risk level
export type AuthenticityRisk = 'low' | 'medium' | 'high' | 'very_high';

// Authentication check category
export type AuthCheckCategory = 'visual' | 'physical' | 'documentation' | 'provenance';

// Authentication check priority
export type AuthCheckPriority = 'critical' | 'important' | 'helpful';

// Photo request priority
export type PhotoRequestPriority = 'required' | 'recommended' | 'optional';

// Single authentication check item
export interface AuthenticationCheck {
  id: string;
  category: AuthCheckCategory;
  priority: AuthCheckPriority;
  check: string;                    // What to verify
  howTo: string;                    // How to perform the check
  whatToLookFor: string;            // Signs of authenticity
  redFlagSigns: string[];           // Signs of fake
  requiresExpert: boolean;
  photoHelpful: boolean;
  completed?: boolean;              // User has completed this check
  userNotes?: string;               // User's notes on this check
  userResult?: 'pass' | 'fail' | 'uncertain';
}

// Request for additional photo
export interface PhotoRequest {
  id: string;
  area: string;                     // "caseback", "movement", "signature", etc.
  reason: string;                   // Why this photo helps
  whatToCapture: string;            // Specific instructions
  priority: PhotoRequestPriority;
  submitted?: boolean;              // User has submitted this photo
  imageUrl?: string;                // URL of submitted photo
  analysisResult?: PhotoAnalysisResult;
}

// Result of analyzing an additional photo
export interface PhotoAnalysisResult {
  findingsFor: string[];            // Evidence supporting authenticity
  findingsAgainst: string[];        // Evidence against authenticity
  assessment: string;               // Summary assessment
  confidence: number;               // Confidence in this photo's analysis
}

// Complete authentication result
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

// Authentication session state (for wizard)
export interface AuthenticationSession {
  analysisId: string;
  step: 'overview' | 'checklist' | 'photos' | 'report';
  checklistProgress: number;        // 0-100
  photosSubmitted: number;
  photosRequired: number;
  updatedConfidence: number | null;
  startedAt: string;
  completedAt: string | null;
}

// Comparable sale
export interface ComparableSale {
  description: string;
  venue: string;
  price: number;
  date: string;
  relevance: string;
}

// Alternative candidate
export interface AlternativeCandidate {
  name: string;
  confidence: number;
  reason: string;
}

export interface StylingSuggestion {
  roomType: string;
  title: string;                    // Required from OpenAI schema
  description: string;              // Required from OpenAI schema
  placement?: string | null;        // Optional from OpenAI schema
  complementaryItems: string[];
  colorPalette: string[];
  designTips?: string | null;       // Optional from OpenAI schema
}

// Simple marketplace link (returned from API generateMarketplaceLinks)
export interface MarketplaceLinkSimple {
  marketplaceName: string;
  linkUrl: string;
}

// World-Class Item Analysis
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

  // Valuation
  estimatedValueMin: number | null;
  estimatedValueMax: number | null;
  currentRetailPrice: number | null;

  // Comparable sales
  comparableSales: ComparableSale[] | null;

  // Confidence and evidence
  confidence: number;
  identificationConfidence: number | null;
  makerConfidence: number | null;
  evidenceFor: string[] | null;
  evidenceAgainst: string[] | null;

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

  // Legacy/Additional fields
  imageUrl: string;
  stylingSuggestions: StylingSuggestion[] | null;
  productUrl: string | null;
  // Can be either simple links (from POST /analyze) or full links (from GET /analyze/:id)
  marketplaceLinks: (MarketplaceLinkSimple | MarketplaceLink)[] | null;

  // === AUTHENTICATION FIELDS ===
  authenticationConfidence: number | null;
  authenticityRisk: AuthenticityRisk | null;
  authenticationChecklist: AuthenticationCheck[] | null;
  knownFakeIndicators: string[] | null;
  additionalPhotosRequested: PhotoRequest[] | null;
  expertReferralRecommended: boolean | null;
  expertReferralReason: string | null;
  authenticationAssessment: string | null;

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

export interface AnalysisResult extends ItemAnalysis {
  // marketplaceLinks is inherited from ItemAnalysis
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper function to get deal rating color
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

// Helper function to get flip difficulty color
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

// Helper function to get domain expert display name
export function getDomainExpertName(expert: DomainExpert | null): string {
  const names: Record<DomainExpert, string> = {
    furniture: 'Furniture Expert',
    ceramics: 'Ceramics & Pottery Expert',
    glass: 'Glass Expert',
    silver: 'Silver & Metalware Expert',
    jewelry: 'Jewelry Expert',
    watches: 'Watches & Clocks Expert',
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

// Format price for display
export function formatPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents);
}

// Format price range for display
export function formatPriceRange(min: number | null | undefined, max: number | null | undefined): string {
  if ((min === null || min === undefined) && (max === null || max === undefined)) return 'Value not estimated';
  if (min === null || min === undefined) return `Up to ${formatPrice(max)}`;
  if (max === null || max === undefined) return `From ${formatPrice(min)}`;
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

// === AUTHENTICATION HELPER FUNCTIONS ===

// Get authenticity risk color
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

// Get authenticity risk label
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

// Get check priority color
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

// Get photo priority color
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

// Calculate checklist progress
export function calculateChecklistProgress(checklist: AuthenticationCheck[] | null): number {
  if (!checklist || checklist.length === 0) return 0;
  const completed = checklist.filter(c => c.completed).length;
  return Math.round((completed / checklist.length) * 100);
}

// Format confidence as percentage
export function formatConfidence(confidence: number | null): string {
  if (confidence === null) return 'N/A';
  return `${Math.round(confidence * 100)}%`;
}
