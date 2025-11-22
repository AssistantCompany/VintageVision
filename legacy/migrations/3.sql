
-- User subscriptions table
CREATE TABLE user_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL, -- active, canceled, past_due, etc.
  current_period_start INTEGER,
  current_period_end INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  label TEXT,
  value INTEGER,
  user_agent TEXT,
  url TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API usage tracking
CREATE TABLE api_usage (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search history for better recommendations
CREATE TABLE search_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  search_query TEXT NOT NULL,
  search_type TEXT, -- 'text', 'image', 'style'
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
