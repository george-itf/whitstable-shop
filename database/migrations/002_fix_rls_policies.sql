-- Fix RLS Policies Migration
-- Addresses issues blocking site functionality

-- =====================================================
-- 1. FIX REVIEWS - Allow anonymous reviews
-- =====================================================

-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;

-- Create new policy that allows both authenticated and anonymous inserts
CREATE POLICY "Anyone can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 2. ADD MISSING POLICIES FOR CATEGORIES
-- =====================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public" ON public.categories
  FOR SELECT USING (is_active = true);

-- =====================================================
-- 3. ADD MISSING POLICIES FOR SHOP_VIEWS
-- =====================================================

ALTER TABLE public.shop_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log views" ON public.shop_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Views are readable" ON public.shop_views
  FOR SELECT USING (true);

-- =====================================================
-- 4. ADD MISSING POLICIES FOR NOMINATIONS
-- =====================================================

ALTER TABLE public.nominations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit nominations" ON public.nominations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Approved nominations are public" ON public.nominations
  FOR SELECT USING (status = 'approved' OR status = 'winner');

-- =====================================================
-- 5. ADD MISSING POLICIES FOR AWARD_WINNERS
-- =====================================================

ALTER TABLE public.award_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Award winners are public" ON public.award_winners
  FOR SELECT USING (true);

-- =====================================================
-- 6. ENSURE SHOPS ARE VISIBLE
-- =====================================================

-- Set all active shops to approved status
UPDATE public.shops
SET status = 'approved'
WHERE is_active = true AND (status IS NULL OR status = 'pending');

-- =====================================================
-- 7. FIX QUESTIONS - Allow anonymous questions
-- =====================================================

DROP POLICY IF EXISTS "Users can ask questions" ON public.questions;

CREATE POLICY "Anyone can ask questions" ON public.questions
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 8. FIX REPORTS - Allow anonymous reports
-- =====================================================

DROP POLICY IF EXISTS "Users can submit reports" ON public.reports;

CREATE POLICY "Anyone can submit reports" ON public.reports
  FOR INSERT WITH CHECK (true);

-- Allow users to see all reports (for transparency)
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;

CREATE POLICY "Reports are viewable" ON public.reports
  FOR SELECT USING (true);
