
-- Add user preferences and styling data
CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  preferred_styles TEXT, -- JSON array of style preferences
  room_types TEXT, -- JSON array of room types user is interested in
  budget_range_min INTEGER,
  budget_range_max INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add styling suggestions to analyses
ALTER TABLE item_analyses ADD COLUMN styling_suggestions TEXT; -- JSON with styling tips and room placement ideas

-- Add feedback tracking
CREATE TABLE analysis_feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_analysis_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  correction_text TEXT,
  feedback_type TEXT, -- 'accuracy', 'styling', 'value'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add wishlist functionality
CREATE TABLE user_wishlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_analysis_id TEXT,
  search_criteria TEXT, -- JSON with style, era, price range for searches
  notes TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add marketplace links tracking
CREATE TABLE marketplace_links (
  id TEXT PRIMARY KEY,
  item_analysis_id TEXT NOT NULL,
  marketplace_name TEXT NOT NULL, -- 'ebay', 'etsy', 'chairish', etc.
  link_url TEXT NOT NULL,
  price_min INTEGER,
  price_max INTEGER,
  confidence_score REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
