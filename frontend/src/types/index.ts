// TypeScript Types for VintageVision
// Matches backend schema
// October 2025

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface ItemAnalysis {
  id: string;
  name: string;
  era: string | null;
  style: string | null;
  description: string;
  historicalContext: string;
  estimatedValueMin: number | null;
  estimatedValueMax: number | null;
  confidence: number;
  imageUrl: string;
  stylingSuggestions: StylingSuggestion[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface StylingSuggestion {
  roomType: string;
  title?: string; // Legacy compatibility
  placement: string;
  description?: string; // Legacy compatibility
  complementaryItems: string[];
  colorPalette: string[];
  designTips: string;
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
  marketplaceLinks?: MarketplaceLink[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
