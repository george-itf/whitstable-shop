-- =====================================================
-- TRENDING SYSTEM SCHEMA
-- Tracks engagement across all content types to surface
-- what's hot in the Whitstable community
-- =====================================================

-- Entity types that can trend
-- shop, charity, question, info_page, photo, event

-- =====================================================
-- ENGAGEMENT EVENTS TABLE
-- Stores all engagement actions for trend calculation
-- =====================================================
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- What type of content (shop, charity, question, info_page, photo, event)
  entity_type TEXT NOT NULL CHECK (entity_type IN ('shop', 'charity', 'question', 'info_page', 'photo', 'event')),

  -- The ID of the entity (UUID for most, slug for info_page)
  entity_id TEXT NOT NULL,

  -- What action was taken
  action TEXT NOT NULL CHECK (action IN ('view', 'like', 'save', 'share', 'comment', 'answer', 'review', 'vote', 'rsvp')),

  -- Points for this action (configured per action type)
  points INTEGER NOT NULL DEFAULT 1,

  -- Who did it (nullable for anonymous views)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Session ID for anonymous tracking
  session_id TEXT,

  -- Additional metadata (e.g., referrer, device)
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_engagement_entity ON engagement_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_engagement_created ON engagement_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_action ON engagement_events(action);
CREATE INDEX IF NOT EXISTS idx_engagement_user ON engagement_events(user_id) WHERE user_id IS NOT NULL;

-- =====================================================
-- TRENDING SCORES TABLE
-- Pre-calculated trending scores updated periodically
-- =====================================================
CREATE TABLE IF NOT EXISTS trending_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,

  -- Scores over different time windows
  score_1h DECIMAL(10, 2) DEFAULT 0,      -- Last hour (for "just now" trending)
  score_24h DECIMAL(10, 2) DEFAULT 0,     -- Last 24 hours
  score_7d DECIMAL(10, 2) DEFAULT 0,      -- Last 7 days (main trending score)
  score_30d DECIMAL(10, 2) DEFAULT 0,     -- Last 30 days (for "rising" detection)

  -- Event counts for display
  view_count_7d INTEGER DEFAULT 0,
  engagement_count_7d INTEGER DEFAULT 0,   -- Non-view actions

  -- Trend direction (calculated from score changes)
  trend_direction TEXT DEFAULT 'steady' CHECK (trend_direction IN ('up', 'down', 'steady', 'new')),
  trend_change_pct DECIMAL(5, 2) DEFAULT 0,

  -- Ranking within entity type
  rank_in_type INTEGER,

  -- When was this last calculated
  last_calculated TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint
  UNIQUE(entity_type, entity_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trending_score ON trending_scores(score_7d DESC);
CREATE INDEX IF NOT EXISTS idx_trending_type_rank ON trending_scores(entity_type, rank_in_type);

-- =====================================================
-- ENGAGEMENT WEIGHTS CONFIGURATION
-- Configurable point values for each action
-- =====================================================
CREATE TABLE IF NOT EXISTS engagement_weights (
  action TEXT PRIMARY KEY,
  points INTEGER NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default weights
INSERT INTO engagement_weights (action, points, description) VALUES
  ('view', 1, 'Page view'),
  ('like', 2, 'Like/heart action'),
  ('save', 2, 'Save/bookmark action'),
  ('share', 3, 'Share to social or copy link'),
  ('comment', 4, 'Comment on content'),
  ('answer', 4, 'Answer a question'),
  ('review', 5, 'Write a review'),
  ('vote', 2, 'Vote on photo competition'),
  ('rsvp', 3, 'RSVP to event or activity')
ON CONFLICT (action) DO NOTHING;

-- =====================================================
-- FUNCTION: Record engagement event
-- =====================================================
CREATE OR REPLACE FUNCTION record_engagement(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_action TEXT,
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_points INTEGER;
  v_event_id UUID;
BEGIN
  -- Get points for this action
  SELECT points INTO v_points FROM engagement_weights WHERE action = p_action;
  IF v_points IS NULL THEN
    v_points := 1; -- Default fallback
  END IF;

  -- Insert the event
  INSERT INTO engagement_events (entity_type, entity_id, action, points, user_id, session_id, metadata)
  VALUES (p_entity_type, p_entity_id, p_action, v_points, p_user_id, p_session_id, p_metadata)
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Calculate trending scores
-- Should be run periodically (e.g., every 15 minutes)
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_trending_scores() RETURNS void AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- Upsert trending scores for all entities with recent activity
  INSERT INTO trending_scores (entity_type, entity_id, score_1h, score_24h, score_7d, score_30d, view_count_7d, engagement_count_7d, last_calculated)
  SELECT
    entity_type,
    entity_id,
    -- 1 hour score with recency decay
    COALESCE(SUM(CASE
      WHEN created_at > v_now - INTERVAL '1 hour'
      THEN points * (1 - EXTRACT(EPOCH FROM (v_now - created_at)) / 3600)
      ELSE 0
    END), 0) as score_1h,
    -- 24 hour score with recency decay
    COALESCE(SUM(CASE
      WHEN created_at > v_now - INTERVAL '24 hours'
      THEN points * (1 - EXTRACT(EPOCH FROM (v_now - created_at)) / 86400)
      ELSE 0
    END), 0) as score_24h,
    -- 7 day score with recency decay
    COALESCE(SUM(CASE
      WHEN created_at > v_now - INTERVAL '7 days'
      THEN points * (1 - EXTRACT(EPOCH FROM (v_now - created_at)) / 604800)
      ELSE 0
    END), 0) as score_7d,
    -- 30 day score
    COALESCE(SUM(CASE
      WHEN created_at > v_now - INTERVAL '30 days'
      THEN points
      ELSE 0
    END), 0) as score_30d,
    -- View count last 7 days
    COALESCE(SUM(CASE
      WHEN created_at > v_now - INTERVAL '7 days' AND action = 'view'
      THEN 1 ELSE 0
    END), 0) as view_count_7d,
    -- Engagement count (non-views) last 7 days
    COALESCE(SUM(CASE
      WHEN created_at > v_now - INTERVAL '7 days' AND action != 'view'
      THEN 1 ELSE 0
    END), 0) as engagement_count_7d,
    v_now as last_calculated
  FROM engagement_events
  WHERE created_at > v_now - INTERVAL '30 days'
  GROUP BY entity_type, entity_id
  ON CONFLICT (entity_type, entity_id)
  DO UPDATE SET
    score_1h = EXCLUDED.score_1h,
    score_24h = EXCLUDED.score_24h,
    score_7d = EXCLUDED.score_7d,
    score_30d = EXCLUDED.score_30d,
    view_count_7d = EXCLUDED.view_count_7d,
    engagement_count_7d = EXCLUDED.engagement_count_7d,
    -- Calculate trend direction
    trend_direction = CASE
      WHEN trending_scores.score_7d = 0 THEN 'new'
      WHEN EXCLUDED.score_24h > trending_scores.score_24h * 1.2 THEN 'up'
      WHEN EXCLUDED.score_24h < trending_scores.score_24h * 0.8 THEN 'down'
      ELSE 'steady'
    END,
    trend_change_pct = CASE
      WHEN trending_scores.score_24h = 0 THEN 100
      ELSE ROUND(((EXCLUDED.score_24h - trending_scores.score_24h) / trending_scores.score_24h * 100)::numeric, 2)
    END,
    last_calculated = v_now;

  -- Update rankings within each entity type
  WITH ranked AS (
    SELECT
      id,
      ROW_NUMBER() OVER (PARTITION BY entity_type ORDER BY score_7d DESC) as new_rank
    FROM trending_scores
    WHERE score_7d > 0
  )
  UPDATE trending_scores
  SET rank_in_type = ranked.new_rank
  FROM ranked
  WHERE trending_scores.id = ranked.id;

END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEW: Get trending items with entity details
-- =====================================================
CREATE OR REPLACE VIEW trending_feed AS
SELECT
  ts.entity_type,
  ts.entity_id,
  ts.score_7d,
  ts.score_24h,
  ts.trend_direction,
  ts.trend_change_pct,
  ts.view_count_7d,
  ts.engagement_count_7d,
  ts.rank_in_type,
  ts.last_calculated,
  -- Shop details (when entity_type = 'shop')
  s.name as shop_name,
  s.slug as shop_slug,
  s.tagline as shop_tagline,
  -- Charity details (when entity_type = 'charity')
  c.name as charity_name,
  c.slug as charity_slug,
  -- Question details (when entity_type = 'question')
  q.question as question_text,
  -- Photo details (when entity_type = 'photo')
  p.caption as photo_caption,
  p.image_url as photo_url
FROM trending_scores ts
LEFT JOIN shops s ON ts.entity_type = 'shop' AND ts.entity_id = s.id::text
LEFT JOIN charities c ON ts.entity_type = 'charity' AND ts.entity_id = c.id::text
LEFT JOIN questions q ON ts.entity_type = 'question' AND ts.entity_id = q.id::text
LEFT JOIN photos p ON ts.entity_type = 'photo' AND ts.entity_id = p.id::text
WHERE ts.score_7d > 0
ORDER BY ts.score_7d DESC;

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_scores ENABLE ROW LEVEL SECURITY;

-- Anyone can view trending scores
CREATE POLICY "Anyone can view trending scores"
  ON trending_scores FOR SELECT
  USING (true);

-- Anyone can record engagement (views are anonymous)
CREATE POLICY "Anyone can record engagement"
  ON engagement_events FOR INSERT
  WITH CHECK (true);

-- Users can see their own engagement history
CREATE POLICY "Users can see own engagement"
  ON engagement_events FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================================================
-- SCHEDULED JOB SETUP (for Supabase)
-- Run calculate_trending_scores() every 15 minutes
-- This needs to be set up in Supabase dashboard under
-- Database > Extensions > pg_cron
-- =====================================================
-- SELECT cron.schedule(
--   'calculate-trending',
--   '*/15 * * * *',
--   'SELECT calculate_trending_scores()'
-- );
