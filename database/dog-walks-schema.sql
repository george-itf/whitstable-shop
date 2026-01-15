-- =====================================================
-- DOG WALKING GROUPS SCHEMA
-- Community dog walking coordination for Whitstable
-- =====================================================

-- =====================================================
-- DOG WALK ROUTES TABLE
-- Pre-defined walking routes around Whitstable
-- =====================================================
CREATE TABLE IF NOT EXISTS dog_walk_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Route details
  start_point TEXT NOT NULL,           -- e.g., "Tankerton Slopes car park"
  end_point TEXT,                       -- NULL if circular route
  distance_km DECIMAL(4, 2),           -- Distance in kilometers
  estimated_duration_mins INTEGER,      -- Typical walk time
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'moderate', 'challenging')),

  -- Terrain and features
  terrain TEXT[],                       -- e.g., ['beach', 'grass', 'paved']
  features TEXT[],                      -- e.g., ['dog_friendly_cafe', 'water_access', 'off_lead_area']

  -- Map data
  start_latitude DECIMAL(10, 8),
  start_longitude DECIMAL(11, 8),
  route_geojson JSONB,                  -- Full route for map display

  -- Images
  image_url TEXT,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOG WALK SCHEDULE TABLE
-- Recurring time slots for each route
-- =====================================================
CREATE TABLE IF NOT EXISTS dog_walk_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  route_id UUID NOT NULL REFERENCES dog_walk_routes(id) ON DELETE CASCADE,

  -- Time configuration
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0 = Sunday
  time_slot TIME NOT NULL,             -- e.g., '07:00', '10:00', '16:00'

  -- Slot details
  max_participants INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true,

  -- Unique constraint per route/day/time
  UNIQUE(route_id, day_of_week, time_slot)
);

-- =====================================================
-- DOG WALK ATTENDEES TABLE
-- Users joining specific walk instances
-- =====================================================
CREATE TABLE IF NOT EXISTS dog_walk_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Which walk instance (schedule + specific date)
  schedule_id UUID NOT NULL REFERENCES dog_walk_schedule(id) ON DELETE CASCADE,
  walk_date DATE NOT NULL,              -- The specific date of this walk

  -- Who's attending
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dog info (optional)
  dog_name TEXT,
  dog_breed TEXT,
  notes TEXT,                           -- e.g., "Reactive to other dogs"

  -- Status
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'cancelled')),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One attendance per user per walk instance
  UNIQUE(schedule_id, walk_date, user_id)
);

-- =====================================================
-- DOG PROFILES TABLE (optional - for regular users)
-- Store dog info for easy reuse
-- =====================================================
CREATE TABLE IF NOT EXISTS dog_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  breed TEXT,
  age_years INTEGER,
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'giant')),

  -- Behavior notes
  is_friendly BOOLEAN DEFAULT true,
  is_reactive BOOLEAN DEFAULT false,
  notes TEXT,

  -- Profile image
  image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_dog_walk_schedule_route ON dog_walk_schedule(route_id);
CREATE INDEX IF NOT EXISTS idx_dog_walk_schedule_day ON dog_walk_schedule(day_of_week);
CREATE INDEX IF NOT EXISTS idx_dog_walk_attendees_schedule ON dog_walk_attendees(schedule_id, walk_date);
CREATE INDEX IF NOT EXISTS idx_dog_walk_attendees_user ON dog_walk_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_dog_walk_attendees_date ON dog_walk_attendees(walk_date);
CREATE INDEX IF NOT EXISTS idx_dog_profiles_user ON dog_profiles(user_id);

-- =====================================================
-- SEED DATA: Initial Routes
-- =====================================================
INSERT INTO dog_walk_routes (name, slug, description, start_point, end_point, distance_km, estimated_duration_mins, difficulty, terrain, features, start_latitude, start_longitude) VALUES
  (
    'Tankerton Slopes',
    'tankerton-slopes',
    'Beautiful clifftop walk with stunning sea views. Popular with dog walkers year-round. Grassy slopes perfect for off-lead play.',
    'Tankerton Slopes car park',
    'Marine Crescent',
    2.5,
    45,
    'easy',
    ARRAY['grass', 'paved'],
    ARRAY['off_lead_area', 'sea_views', 'parking'],
    51.3650,
    1.0180
  ),
  (
    'West Beach to Castle',
    'west-beach',
    'Sandy beach walk from West Beach to Whitstable Castle. Dogs can paddle in the sea. Ends at the castle gardens.',
    'West Beach',
    'Whitstable Castle',
    3.0,
    50,
    'easy',
    ARRAY['beach', 'sand', 'grass'],
    ARRAY['water_access', 'dog_friendly_cafe', 'castle_grounds'],
    51.3580,
    1.0120
  ),
  (
    'Long Rock & The Street',
    'long-rock',
    'Walk out to the famous Street - a natural shingle causeway. Best at low tide! Check tide times before setting off.',
    'Long Rock car park',
    NULL,
    4.0,
    75,
    'moderate',
    ARRAY['shingle', 'beach', 'rocky'],
    ARRAY['water_access', 'wildlife', 'unique_terrain'],
    51.3620,
    1.0350
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA: Default Schedule
-- Create morning, midday, and evening slots for each route
-- =====================================================
INSERT INTO dog_walk_schedule (route_id, day_of_week, time_slot)
SELECT
  r.id,
  d.day,
  t.time_slot::TIME
FROM dog_walk_routes r
CROSS JOIN (
  SELECT generate_series(0, 6) as day  -- All days of week
) d
CROSS JOIN (
  VALUES ('07:00'), ('10:00'), ('16:00'), ('18:00')  -- Morning, mid-morning, afternoon, evening
) t(time_slot)
WHERE r.is_active = true
ON CONFLICT (route_id, day_of_week, time_slot) DO NOTHING;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get attendee count for a walk instance
CREATE OR REPLACE FUNCTION get_walk_attendee_count(
  p_schedule_id UUID,
  p_walk_date DATE
) RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM dog_walk_attendees
    WHERE schedule_id = p_schedule_id
      AND walk_date = p_walk_date
      AND status = 'attending'
  );
END;
$$ LANGUAGE plpgsql;

-- Get upcoming walks for a user
CREATE OR REPLACE FUNCTION get_user_upcoming_walks(p_user_id UUID)
RETURNS TABLE (
  walk_date DATE,
  time_slot TIME,
  route_name TEXT,
  route_slug TEXT,
  attendee_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.walk_date,
    s.time_slot,
    r.name,
    r.slug,
    get_walk_attendee_count(s.id, a.walk_date)
  FROM dog_walk_attendees a
  JOIN dog_walk_schedule s ON a.schedule_id = s.id
  JOIN dog_walk_routes r ON s.route_id = r.id
  WHERE a.user_id = p_user_id
    AND a.status = 'attending'
    AND a.walk_date >= CURRENT_DATE
  ORDER BY a.walk_date, s.time_slot;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE dog_walk_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_walk_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_walk_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_profiles ENABLE ROW LEVEL SECURITY;

-- Routes and schedules are public read
CREATE POLICY "Anyone can view routes"
  ON dog_walk_routes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view schedules"
  ON dog_walk_schedule FOR SELECT
  USING (true);

-- Attendees visible to all (for showing who's going)
CREATE POLICY "Anyone can view attendees"
  ON dog_walk_attendees FOR SELECT
  USING (true);

-- Only authenticated users can join walks
CREATE POLICY "Authenticated users can join walks"
  ON dog_walk_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update/cancel their own attendance
CREATE POLICY "Users can update own attendance"
  ON dog_walk_attendees FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own attendance"
  ON dog_walk_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- Dog profiles are private to owners
CREATE POLICY "Users can view own dog profiles"
  ON dog_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dog profiles"
  ON dog_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dog profiles"
  ON dog_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dog profiles"
  ON dog_profiles FOR DELETE
  USING (auth.uid() = user_id);
