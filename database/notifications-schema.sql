-- Notifications System Schema
-- Run this in Supabase SQL editor to set up notification preferences and logging

-- ============================================
-- 1. NOTIFICATION PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Email notification settings
  weekly_digest BOOLEAN DEFAULT true,
  new_review_alert BOOLEAN DEFAULT true,         -- For shop owners
  event_reminders BOOLEAN DEFAULT true,
  answer_notifications BOOLEAN DEFAULT true,     -- When someone answers your question
  save_notifications BOOLEAN DEFAULT false,      -- When someone saves your shop

  -- Push notification settings (for future use)
  push_enabled BOOLEAN DEFAULT false,
  push_new_events BOOLEAN DEFAULT true,
  push_trending BOOLEAN DEFAULT false,
  push_deals BOOLEAN DEFAULT true,

  -- Frequency settings
  digest_frequency TEXT DEFAULT 'weekly' CHECK (digest_frequency IN ('daily', 'weekly', 'monthly', 'never')),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_prefs_digest ON notification_preferences(weekly_digest) WHERE weekly_digest = true;

-- RLS Policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can read all for batch operations (digest sending)
CREATE POLICY "Service role can read all preferences"
  ON notification_preferences
  FOR SELECT
  TO service_role
  USING (true);

-- ============================================
-- 2. DIGEST LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS digest_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sent_at TIMESTAMPTZ DEFAULT now(),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  digest_type TEXT DEFAULT 'weekly',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for querying recent digests
CREATE INDEX IF NOT EXISTS idx_digest_logs_sent_at ON digest_logs(sent_at DESC);

-- ============================================
-- 3. PUSH SUBSCRIPTIONS TABLE (future use)
-- ============================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,        -- Public key
  auth_key TEXT NOT NULL,      -- Auth secret
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);

-- RLS for push subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subscriptions"
  ON push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. NOTIFICATION QUEUE TABLE
-- ============================================
-- For deferred/scheduled notifications

CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,  -- 'email', 'push', 'in_app'
  channel TEXT NOT NULL,            -- 'review', 'event', 'answer', 'digest'
  subject TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_queue_status ON notification_queue(status, scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notif_queue_user ON notification_queue(user_id, created_at DESC);

-- RLS
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notification_queue
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to get users who should receive a specific notification type
CREATE OR REPLACE FUNCTION get_notification_recipients(
  p_notification_type TEXT
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    np.user_id,
    p.email,
    p.display_name
  FROM notification_preferences np
  JOIN profiles p ON p.id = np.user_id
  WHERE
    CASE p_notification_type
      WHEN 'weekly_digest' THEN np.weekly_digest = true
      WHEN 'new_review' THEN np.new_review_alert = true
      WHEN 'event_reminder' THEN np.event_reminders = true
      WHEN 'answer' THEN np.answer_notifications = true
      ELSE false
    END
    AND p.email IS NOT NULL;
END;
$$;

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_prefs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to auto-create preferences on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_notification_prefs ON auth.users;
CREATE TRIGGER on_auth_user_created_notification_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_prefs();

-- ============================================
-- 6. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_notification_prefs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_prefs_updated_at();

-- ============================================
-- 7. SAMPLE DATA (for testing)
-- ============================================
-- Uncomment to insert test data

-- INSERT INTO notification_preferences (user_id, weekly_digest, new_review_alert)
-- SELECT id, true, true
-- FROM auth.users
-- WHERE email LIKE '%@test.com'
-- ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE notification_preferences IS 'User notification preferences for email and push notifications';
COMMENT ON TABLE digest_logs IS 'Log of sent digest emails for analytics and debugging';
COMMENT ON TABLE push_subscriptions IS 'Web push notification subscriptions';
COMMENT ON TABLE notification_queue IS 'Queue for scheduled and pending notifications';
