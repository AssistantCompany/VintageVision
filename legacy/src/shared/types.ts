export interface StyleSuggestion {
  title: string
  description: string
  roomType: string
  complementaryItems?: string[]
  colorPalette?: string[]
}

export interface ItemAnalysis {
  id: string
  name: string
  era?: string
  style?: string
  description: string
  historical_context: string
  estimated_value_min?: number
  estimated_value_max?: number
  confidence: number
  image_url: string
  styling_suggestions?: string
  created_at: string
  updated_at: string
  
  // Computed properties for compatibility
  historicalContext: string
  estimatedValueMin?: number
  estimatedValueMax?: number
  imageUrl: string
  stylingSuggestions?: StyleSuggestion[]
  marketplaceLinks?: MarketplaceLink[]
}

export interface CollectionItem {
  id: string
  user_id: string
  item_analysis_id: string
  notes?: string
  location?: string
  saved_at: string
  updated_at: string
  analysis?: ItemAnalysis
}

export interface UserPreferences {
  id: string
  user_id: string
  preferred_styles?: string[]
  room_types?: string[]
  budget_range_min?: number
  budget_range_max?: number
  created_at: string
  updated_at: string
}

export interface AnalysisFeedback {
  id: string
  user_id: string
  item_analysis_id: string
  is_correct: boolean
  correction_text?: string
  feedback_type?: 'accuracy' | 'styling' | 'value'
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  item_analysis_id?: string
  search_criteria: {
    style?: string
    era?: string
    price_range?: { min: number; max: number }
    keywords?: string[]
  }
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  analysis?: ItemAnalysis
}

export interface MarketplaceLink {
  id: string
  item_analysis_id: string
  marketplace_name: string
  link_url: string
  price_min?: number
  price_max?: number
  confidence_score?: number
  created_at: string
  marketplace: string
  url: string
  priceMin?: number
  priceMax?: number
}

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan_name: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing'
  current_period_start?: number
  current_period_end?: number
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  action: string
  category: string
  label?: string
  value?: number
  user_agent?: string
  url?: string
  timestamp: string
}

export interface APIUsage {
  id: string
  user_id?: string
  endpoint: string
  method: string
  status_code: number
  response_time_ms?: number
  created_at: string
}

export interface SearchHistoryEntry {
  id: string
  user_id: string
  search_query: string
  search_type?: 'text' | 'image' | 'style'
  results_count?: number
  created_at: string
}

export interface ErrorLog {
  id: string
  error_message: string
  stack_trace?: string
  component_stack?: string
  context?: string
  user_agent?: string
  url?: string
  timestamp: string
}

export interface PerformanceMetric {
  id: string
  metric_name: string
  metric_value: number
  user_id?: string
  session_id?: string
  timestamp: string
}
