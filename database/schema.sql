-- VintageVision PostgreSQL Schema
-- Migrated from Cloudflare D1 (SQLite)
-- Self-hosted on ScaledMinds_07

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Item Analyses (AI analysis results)
CREATE TABLE item_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  era TEXT,
  style TEXT,
  description TEXT NOT NULL,
  historical_context TEXT NOT NULL,
  estimated_value_min INTEGER,
  estimated_value_max INTEGER,
  confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  image_url TEXT NOT NULL,
  styling_suggestions JSONB, -- JSON with styling tips and room placement ideas
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Collection Items
CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  item_analysis_id UUID NOT NULL REFERENCES item_analyses(id) ON DELETE CASCADE,
  notes TEXT,
  location TEXT,
  saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  preferred_styles JSONB, -- JSON array of style preferences
  room_types JSONB, -- JSON array of room types user is interested in
  budget_range_min INTEGER,
  budget_range_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Analysis Feedback
CREATE TABLE analysis_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  item_analysis_id UUID NOT NULL REFERENCES item_analyses(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  correction_text TEXT,
  feedback_type TEXT CHECK (feedback_type IN ('accuracy', 'styling', 'value')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Wishlists
CREATE TABLE user_wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  item_analysis_id UUID REFERENCES item_analyses(id) ON DELETE SET NULL,
  search_criteria JSONB, -- JSON with style, era, price range for searches
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace Links
CREATE TABLE marketplace_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_analysis_id UUID NOT NULL REFERENCES item_analyses(id) ON DELETE CASCADE,
  marketplace_name TEXT NOT NULL, -- 'ebay', 'etsy', 'chairish', etc.
  link_url TEXT NOT NULL,
  price_min INTEGER,
  price_max INTEGER,
  confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Error Logs
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  request_data JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for self-hosted auth, replacing Mocha)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  google_id TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMPTZ
);

-- Sessions Table (for Passport.js sessions)
CREATE TABLE sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMPTZ NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_collection_items_user_id ON collection_items(user_id);
CREATE INDEX idx_collection_items_analysis_id ON collection_items(item_analysis_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_analysis_feedback_user_id ON analysis_feedback(user_id);
CREATE INDEX idx_analysis_feedback_item_id ON analysis_feedback(item_analysis_id);
CREATE INDEX idx_wishlists_user_id ON user_wishlists(user_id);
CREATE INDEX idx_marketplace_links_analysis_id ON marketplace_links(item_analysis_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX idx_error_logs_created ON error_logs(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_sessions_expire ON sessions(expire);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_item_analyses_updated_at BEFORE UPDATE ON item_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collection_items_updated_at BEFORE UPDATE ON collection_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON user_wishlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
