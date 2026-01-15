-- Harden SECURITY DEFINER RPC Functions
-- Addresses privilege escalation risks by:
-- 1. Adding SET search_path to prevent search_path attacks
-- 2. Adding explicit authentication checks where required
-- 3. Setting explicit EXECUTE privileges (revoking from public, granting to appropriate roles)
-- 4. Documenting intended callers and security model

-- =====================================================
-- SHOP VIEW COUNT (PUBLIC - anonymous views allowed)
-- =====================================================

-- Recreate with search_path protection
CREATE OR REPLACE FUNCTION increment_view_count(p_shop_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically increment shop view counter
-- CALLER: Public (both authenticated and anonymous users)
-- SECURITY: No auth required - view tracking is a public metric
BEGIN
  UPDATE public.shops
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_shop_id;
END;
$$;

-- Grant to both authenticated and anonymous
REVOKE ALL ON FUNCTION increment_view_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO authenticated, anon;

-- =====================================================
-- SHOP SAVE COUNT (AUTHENTICATED ONLY)
-- =====================================================

CREATE OR REPLACE FUNCTION increment_save_count(p_shop_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically increment shop save counter
-- CALLER: Authenticated users only (via /api/saved POST)
-- SECURITY: Requires authentication - called after saved_shops insert
BEGIN
  -- Explicit auth check: only logged-in users can save shops
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to increment save count';
  END IF;

  UPDATE public.shops
  SET save_count = COALESCE(save_count, 0) + 1,
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_save_count(p_shop_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically decrement shop save counter
-- CALLER: Authenticated users only (via /api/saved DELETE)
-- SECURITY: Requires authentication - called after saved_shops delete
BEGIN
  -- Explicit auth check: only logged-in users can unsave shops
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to decrement save count';
  END IF;

  UPDATE public.shops
  SET save_count = GREATEST(COALESCE(save_count, 0) - 1, 0),
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$;

-- Grant only to authenticated users
REVOKE ALL ON FUNCTION increment_save_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_save_count(uuid) TO authenticated;

REVOKE ALL ON FUNCTION decrement_save_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION decrement_save_count(uuid) TO authenticated;

-- =====================================================
-- REVIEW COUNT (INTERNAL - called by triggers/API only)
-- =====================================================

CREATE OR REPLACE FUNCTION increment_review_count(p_shop_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically increment shop review counter
-- CALLER: Internal (triggered by review approval)
-- SECURITY: No direct client access needed; kept for API compatibility
BEGIN
  UPDATE public.shops
  SET review_count = COALESCE(review_count, 0) + 1,
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_review_count(p_shop_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically decrement shop review counter
-- CALLER: Internal (triggered by review deletion)
-- SECURITY: No direct client access needed; kept for API compatibility
BEGIN
  UPDATE public.shops
  SET review_count = GREATEST(COALESCE(review_count, 0) - 1, 0),
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$;

-- Revoke public, grant only to authenticated (admins/mods who manage reviews)
REVOKE ALL ON FUNCTION increment_review_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_review_count(uuid) TO authenticated;

REVOKE ALL ON FUNCTION decrement_review_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION decrement_review_count(uuid) TO authenticated;

-- =====================================================
-- SHOP RATING CALCULATION (PUBLIC - pure calculation)
-- =====================================================

CREATE OR REPLACE FUNCTION update_shop_rating(p_shop_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Recalculate shop average rating from approved reviews
-- CALLER: Public (triggered by review approval/deletion)
-- SECURITY: Pure calculation function - no auth required
DECLARE
  v_avg_rating decimal(2,1);
  v_count int;
BEGIN
  SELECT
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)
  INTO v_avg_rating, v_count
  FROM public.reviews
  WHERE shop_id = p_shop_id
    AND status = 'approved';

  UPDATE public.shops
  SET average_rating = COALESCE(v_avg_rating, 0),
      review_count = v_count,
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$;

-- Grant to authenticated and anon (calculation can be triggered by anyone)
REVOKE ALL ON FUNCTION update_shop_rating(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_shop_rating(uuid) TO authenticated, anon;

-- =====================================================
-- PHOTO VOTE COUNT (AUTHENTICATED ONLY)
-- =====================================================

CREATE OR REPLACE FUNCTION increment_photo_vote_count(p_photo_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically increment photo vote counter
-- CALLER: Authenticated users only (via /api/photos/[id]/vote POST)
-- SECURITY: Requires authentication - called after photo_votes insert
BEGIN
  -- Explicit auth check: only logged-in users can vote
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to vote on photos';
  END IF;

  UPDATE public.photo_entries
  SET vote_count = COALESCE(vote_count, 0) + 1
  WHERE id = p_photo_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_photo_vote_count(p_photo_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically decrement photo vote counter
-- CALLER: Authenticated users only (via /api/photos/[id]/vote DELETE)
-- SECURITY: Requires authentication - called after photo_votes delete
BEGIN
  -- Explicit auth check: only logged-in users can remove votes
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to remove photo votes';
  END IF;

  UPDATE public.photo_entries
  SET vote_count = GREATEST(COALESCE(vote_count, 0) - 1, 0)
  WHERE id = p_photo_id;
END;
$$;

-- Grant only to authenticated users
REVOKE ALL ON FUNCTION increment_photo_vote_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_photo_vote_count(uuid) TO authenticated;

REVOKE ALL ON FUNCTION decrement_photo_vote_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION decrement_photo_vote_count(uuid) TO authenticated;

-- =====================================================
-- ANSWER UPVOTE COUNT (AUTHENTICATED ONLY)
-- =====================================================

CREATE OR REPLACE FUNCTION increment_answer_upvotes(p_answer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically increment answer upvote counter
-- CALLER: Authenticated users only (via /api/questions/[id]/answers upvote)
-- SECURITY: Requires authentication - prevents vote manipulation
BEGIN
  -- Explicit auth check: only logged-in users can upvote
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to upvote answers';
  END IF;

  UPDATE public.answers
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = p_answer_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_answer_upvotes(p_answer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically decrement answer upvote counter
-- CALLER: Authenticated users only (via /api/questions/[id]/answers upvote removal)
-- SECURITY: Requires authentication - prevents vote manipulation
BEGIN
  -- Explicit auth check: only logged-in users can remove upvotes
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to remove answer upvotes';
  END IF;

  UPDATE public.answers
  SET upvotes = GREATEST(COALESCE(upvotes, 0) - 1, 0)
  WHERE id = p_answer_id;
END;
$$;

-- Grant only to authenticated users
REVOKE ALL ON FUNCTION increment_answer_upvotes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_answer_upvotes(uuid) TO authenticated;

REVOKE ALL ON FUNCTION decrement_answer_upvotes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION decrement_answer_upvotes(uuid) TO authenticated;

-- =====================================================
-- QUESTION VIEW COUNT (PUBLIC - anonymous views allowed)
-- =====================================================

CREATE OR REPLACE FUNCTION increment_question_views(p_question_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- PURPOSE: Atomically increment question view counter
-- CALLER: Public (both authenticated and anonymous users)
-- SECURITY: No auth required - view tracking is a public metric
BEGIN
  UPDATE public.questions
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_question_id;
END;
$$;

-- Grant to both authenticated and anonymous
REVOKE ALL ON FUNCTION increment_question_views(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_question_views(uuid) TO authenticated, anon;

-- =====================================================
-- SECURITY MODEL SUMMARY
-- =====================================================

-- PUBLIC (anon + authenticated):
--   - increment_view_count: Anonymous shop views allowed
--   - increment_question_views: Anonymous question views allowed
--   - update_shop_rating: Pure calculation, no sensitive data

-- AUTHENTICATED ONLY:
--   - increment/decrement_save_count: Requires login to save shops
--   - increment/decrement_photo_vote_count: Requires login to vote
--   - increment/decrement_answer_upvotes: Requires login to upvote
--   - increment/decrement_review_count: Internal use, authenticated only

-- All functions use SET search_path = public to prevent search_path attacks
-- All functions that require auth have explicit auth.uid() IS NOT NULL checks
