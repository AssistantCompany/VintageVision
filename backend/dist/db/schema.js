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
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    confidenceCheck: check('confidence_check', sql `${table.confidence} >= 0 AND ${table.confidence} <= 1`),
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
    feedbackTypeCheck: check('feedback_type_check', sql `${table.feedbackType} IN ('accuracy', 'styling', 'value')`),
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
    confidenceScoreCheck: check('confidence_score_check', sql `${table.confidenceScore} >= 0 AND ${table.confidenceScore} <= 1`),
}));
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
//# sourceMappingURL=schema.js.map