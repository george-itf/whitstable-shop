-- Schema Reconciliation Migration
-- Aligns database schema with API route expectations
-- Run this AFTER engagement-schema.sql

-- =====================================================
-- 0. ADD ROLE TO PROFILES (for admin access control)
-- =====================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'moderator'));

-- =====================================================
-- 1. CATEGORIES TABLE (required for shop foreign key)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seed default categories
INSERT INTO public.categories (name, slug, icon, color, sort_order) VALUES
  ('Oysters & Seafood', 'oysters-seafood', '🦪', '#F97316', 1),
  ('Café & Coffee', 'cafe-coffee', '☕', '#8B5CF6', 2),
  ('Restaurant & Pub', 'restaurant-pub', '🍽️', '#EF4444', 3),
  ('Fish & Chips / Takeaway', 'fish-chips-takeaway', '🍟', '#F59E0B', 4),
  ('Bakery & Deli', 'bakery-deli', '🥐', '#EC4899', 5),
  ('Ice Cream & Sweets', 'ice-cream-sweets', '🍦', '#06B6D4', 6),
  ('Books & Records', 'books-records', '📚', '#6366F1', 7),
  ('Art & Galleries', 'art-galleries', '🎨', '#14B8A6', 8),
  ('Fashion & Vintage', 'fashion-vintage', '👗', '#D946EF', 9),
  ('Home & Gifts', 'home-gifts', '🏠', '#84CC16', 10),
  ('Health & Beauty', 'health-beauty', '💆', '#F472B6', 11),
  ('Services', 'services', '🔧', '#64748B', 12)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (is_active = true);

-- =====================================================
-- 2. SHOP_VIEWS TABLE (for view tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.shop_views (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id uuid REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  viewed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shop_views_shop ON public.shop_views(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_views_session ON public.shop_views(session_id);
CREATE INDEX IF NOT EXISTS idx_shop_views_time ON public.shop_views(viewed_at);

-- Enable RLS
ALTER TABLE public.shop_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Views can be inserted" ON public.shop_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Views can be selected" ON public.shop_views FOR SELECT USING (true);

-- =====================================================
-- 3. ADD MISSING COLUMNS TO SHOPS
-- =====================================================

-- Add status column for moderation
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add category_id foreign key (keep category text for backward compat)
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id);

-- Add owner_id for shop claiming
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);

-- Add tagline for search
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS tagline text;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_shops_status ON public.shops(status);
CREATE INDEX IF NOT EXISTS idx_shops_category_id ON public.shops(category_id);

-- =====================================================
-- 4. ADD MISSING COLUMNS TO REVIEWS
-- =====================================================

-- Add status for moderation
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add comment field (alias for content, for API compatibility)
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS comment text;

-- Add anonymous review fields
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS author_name text;

ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS author_postcode text;

-- Add spam detection fields
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS ip_hash text;

ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS flagged_reason text;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_ip ON public.reviews(ip_hash);

-- =====================================================
-- 5. INCREMENT VIEW COUNT FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION increment_view_count(p_shop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.shops
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. UPDATE EXISTING DATA
-- =====================================================

-- Set existing shops to approved if they were active
UPDATE public.shops
SET status = 'approved'
WHERE is_active = true AND status IS NULL;

-- Set existing reviews to approved
UPDATE public.reviews
SET status = 'approved'
WHERE status IS NULL;

-- Link shops to categories based on category text
UPDATE public.shops s
SET category_id = c.id
FROM public.categories c
WHERE s.category = c.slug AND s.category_id IS NULL;

-- =====================================================
-- 7. HELPFUL COMMENT
-- =====================================================
-- After running this migration:
-- - API routes will work correctly
-- - Existing data is preserved and migrated
-- - Both old (category text) and new (category_id) patterns work
