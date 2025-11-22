
CREATE TABLE item_analyses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  era TEXT,
  style TEXT,
  description TEXT NOT NULL,
  historical_context TEXT NOT NULL,
  estimated_value_min INTEGER,
  estimated_value_max INTEGER,
  confidence REAL NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collection_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_analysis_id TEXT NOT NULL,
  notes TEXT,
  location TEXT,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_collection_items_user_id ON collection_items(user_id);
CREATE INDEX idx_collection_items_analysis_id ON collection_items(item_analysis_id);
