-- Fix Reports Privacy - Critical Security Issue
-- Reports contain sensitive information and should NOT be publicly readable
-- This migration reverts the overly permissive policy from 002_fix_rls_policies.sql

-- =====================================================
-- REPORTS PRIVACY FIX
-- =====================================================

-- Remove the overly permissive "Reports are viewable" policy
DROP POLICY IF EXISTS "Reports are viewable" ON public.reports;

-- Allow users to view only their own reports
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Allow admins and moderators to view all reports
CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'moderator')
    )
  );

-- Keep anonymous submission policy (from 002)
-- This is fine - we just need to restrict who can READ reports
-- CREATE POLICY "Anyone can submit reports" ON public.reports
--   FOR INSERT WITH CHECK (true);
-- (Already exists from migration 002)
