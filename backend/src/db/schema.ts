// Drizzle ORM Schema for VintageVision
// PostgreSQL Database Schema (migrated from Cloudflare D1)
// October 2025 - TypeScript-first approach

import { pgTable, uuid, text, integer, real, boolean, timestamp, jsonb, varchar, json, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users Table (Self-Hosted Auth)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  googleId: text('google_id').unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false),

  // Subscription fields (Stripe integration)
  subscriptionTier: text('subscription_tier').default('free').notNull(), // 'free' | 'collector' | 'professional'
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionEndsAt: timestamp('subscription_ends_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

// Sessions Table (Passport.js)
export const sessions = pgTable('sessions', {
  sid: varchar('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire', { withTimezone: true }).notNull(),
});

// Item Analyses (AI Analysis Results)
// World-Class Implementation - January 2026
export const itemAnalyses = pgTable('item_analyses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  era: text('era'),
  style: text('style'),
  description: text('description').notNull(),
  historicalContext: text('historical_context').notNull(),
  estimatedValueMin: integer('estimated_value_min'),
  estimatedValueMax: integer('estimated_value_max'),
  confidence: real('confidence').notNull(),
  imageUrl: text('image_url').notNull(),
  stylingSuggestions: jsonb('styling_suggestions'),

  // Product identification (Jan 2026)
  brand: text('brand'),
  modelNumber: text('model_number'),
  productCategory: text('product_category'), // 'antique' | 'vintage' | 'modern_branded' | 'modern_generic'
  productUrl: text('product_url'),
  currentRetailPrice: integer('current_retail_price'), // in cents

  // === WORLD-CLASS ENHANCEMENT (Jan 2026) ===

  // Asking price & deal analysis
  askingPrice: integer('asking_price'), // User-provided asking price (cents)
  dealRating: text('deal_rating'), // 'exceptional' | 'good' | 'fair' | 'overpriced'
  dealExplanation: text('deal_explanation'),
  profitPotentialMin: integer('profit_potential_min'), // cents
  profitPotentialMax: integer('profit_potential_max'), // cents

  // Flip/Resale assessment
  flipDifficulty: text('flip_difficulty'), // 'easy' | 'moderate' | 'hard' | 'very_hard'
  flipTimeEstimate: text('flip_time_estimate'), // "2-4 weeks", etc.
  resaleChannels: jsonb('resale_channels'), // ["eBay", "1stDibs", ...]

  // Evidence-based identification
  identificationConfidence: real('identification_confidence'), // 0.0 to 1.0
  evidenceFor: jsonb('evidence_for'), // Array of supporting evidence
  evidenceAgainst: jsonb('evidence_against'), // Array of contradicting evidence
  alternativeCandidates: jsonb('alternative_candidates'), // Other possibilities

  // Verification guidance
  verificationTips: jsonb('verification_tips'), // What to check before buying
  redFlags: jsonb('red_flags'), // Warning signs detected

  // Enhanced categorization
  domainExpert: text('domain_expert'), // 'furniture' | 'ceramics' | 'jewelry' | etc.
  itemSubcategory: text('item_subcategory'), // More specific category

  // Comparable sales
  comparableSales: jsonb('comparable_sales'), // Reference sales data

  // Maker/Attribution details
  maker: text('maker'), // Identified maker/craftsman
  makerConfidence: real('maker_confidence'),
  attributionNotes: text('attribution_notes'),
  periodStart: integer('period_start'), // Earliest likely year
  periodEnd: integer('period_end'), // Latest likely year
  originRegion: text('origin_region'), // Geographic origin

  // === AUTHENTICATION SYSTEM (Jan 2026) ===
  // Separate authentication assessment from identification
  authenticationConfidence: real('authentication_confidence'), // 0.0 to 1.0
  authenticityRisk: text('authenticity_risk'), // 'low' | 'medium' | 'high' | 'very_high'
  authenticationChecklist: jsonb('authentication_checklist'), // Domain-specific verification checks
  knownFakeIndicators: jsonb('known_fake_indicators'), // What fakes typically show
  additionalPhotosRequested: jsonb('additional_photos_requested'), // Photos needed for deeper auth
  expertReferralRecommended: boolean('expert_referral_recommended'),
  expertReferralReason: text('expert_referral_reason'),
  authenticationAssessment: text('authentication_assessment'), // Overall auth assessment text

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  confidenceCheck: check('confidence_check', sql`${table.confidence} >= 0 AND ${table.confidence} <= 1`),
  authConfidenceCheck: check('auth_confidence_check', sql`${table.authenticationConfidence} IS NULL OR (${table.authenticationConfidence} >= 0 AND ${table.authenticationConfidence} <= 1)`),
}));

// Collection Items (User Saved Items)
export const collectionItems = pgTable('collection_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  itemAnalysisId: uuid('item_analysis_id').notNull().references(() => itemAnalyses.id, { onDelete: 'cascade' }),
  notes: text('notes'),
  location: text('location'),
  savedAt: timestamp('saved_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// User Preferences
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  preferredStyles: jsonb('preferred_styles'),
  roomTypes: jsonb('room_types'),
  budgetRangeMin: integer('budget_range_min'),
  budgetRangeMax: integer('budget_range_max'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Analysis Feedback
export const analysisFeedback = pgTable('analysis_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  itemAnalysisId: uuid('item_analysis_id').notNull().references(() => itemAnalyses.id, { onDelete: 'cascade' }),
  isCorrect: boolean('is_correct').notNull(),
  correctionText: text('correction_text'),
  feedbackType: text('feedback_type'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  feedbackTypeCheck: check('feedback_type_check', sql`${table.feedbackType} IN ('accuracy', 'styling', 'value')`),
}));

// User Wishlists
export const userWishlists = pgTable('user_wishlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  itemAnalysisId: uuid('item_analysis_id').references(() => itemAnalyses.id, { onDelete: 'set null' }),
  searchCriteria: jsonb('search_criteria'),
  notes: text('notes'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Marketplace Links
export const marketplaceLinks = pgTable('marketplace_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemAnalysisId: uuid('item_analysis_id').notNull().references(() => itemAnalyses.id, { onDelete: 'cascade' }),
  marketplaceName: text('marketplace_name').notNull(),
  linkUrl: text('link_url').notNull(),
  priceMin: integer('price_min'),
  priceMax: integer('price_max'),
  confidenceScore: real('confidence_score'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  confidenceScoreCheck: check('confidence_score_check', sql`${table.confidenceScore} >= 0 AND ${table.confidenceScore} <= 1`),
}));

// Additional Photos for Authentication
// Stores follow-up photos submitted during authentication flow
export const additionalPhotos = pgTable('additional_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemAnalysisId: uuid('item_analysis_id').notNull().references(() => itemAnalyses.id, { onDelete: 'cascade' }),
  photoType: text('photo_type').notNull(), // 'caseback', 'movement', 'signature', 'detail', etc.
  imageUrl: text('image_url').notNull(),
  analysisResult: jsonb('analysis_result'), // AI analysis of this specific photo
  findingsFor: jsonb('findings_for'), // Evidence supporting authenticity
  findingsAgainst: jsonb('findings_against'), // Evidence against authenticity
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Analytics Events
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  eventType: text('event_type').notNull(),
  eventData: jsonb('event_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Error Logs
export const errorLogs = pgTable('error_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  errorType: text('error_type').notNull(),
  errorMessage: text('error_message').notNull(),
  errorStack: text('error_stack'),
  requestData: jsonb('request_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type ItemAnalysis = typeof itemAnalyses.$inferSelect;
export type NewItemAnalysis = typeof itemAnalyses.$inferInsert;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type NewCollectionItem = typeof collectionItems.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
export type AnalysisFeedback = typeof analysisFeedback.$inferSelect;
export type NewAnalysisFeedback = typeof analysisFeedback.$inferInsert;
export type UserWishlist = typeof userWishlists.$inferSelect;
export type NewUserWishlist = typeof userWishlists.$inferInsert;
export type MarketplaceLink = typeof marketplaceLinks.$inferSelect;
export type NewMarketplaceLink = typeof marketplaceLinks.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type ErrorLog = typeof errorLogs.$inferSelect;
export type NewErrorLog = typeof errorLogs.$inferInsert;
export type AdditionalPhoto = typeof additionalPhotos.$inferSelect;
export type NewAdditionalPhoto = typeof additionalPhotos.$inferInsert;
