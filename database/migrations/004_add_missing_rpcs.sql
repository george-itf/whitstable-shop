-- Add Missing RPC Functions
-- Creates atomic counter increment/decrement functions that are referenced by API code

-- =====================================================
-- SAVE COUNT FUNCTIONS
-- =====================================================

-- Increment save count atomically
CREATE OR REPLACE FUNCTION increment_save_count(p_shop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.shops
  SET save_count = COALESCE(save_count, 0) + 1,
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement save count atomically (don't go below zero)
CREATE OR REPLACE FUNCTION decrement_save_count(p_shop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.shops
  SET save_count = GREATEST(COALESCE(save_count, 0) - 1, 0),
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REVIEW COUNT FUNCTIONS
-- =====================================================

-- Increment review count atomically
CREATE OR REPLACE FUNCTION increment_review_count(p_shop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.shops
  SET review_count = COALESCE(review_count, 0) + 1,
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement review count atomically (don't go below zero)
CREATE OR REPLACE FUNCTION decrement_review_count(p_shop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.shops
  SET review_count = GREATEST(COALESCE(review_count, 0) - 1, 0),
      updated_at = now()
  WHERE id = p_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATE AVERAGE RATING FUNCTION
-- =====================================================

-- Recalculate average rating for a shop based on approved reviews
CREATE OR REPLACE FUNCTION update_shop_rating(p_shop_id uuid)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VOTE COUNT FUNCTIONS (for photos, answers, etc.)
-- =====================================================

-- Increment vote count on photo entries
CREATE OR REPLACE FUNCTION increment_photo_vote_count(p_photo_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.photo_entries
  SET vote_count = COALESCE(vote_count, 0) + 1
  WHERE id = p_photo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement vote count on photo entries
CREATE OR REPLACE FUNCTION decrement_photo_vote_count(p_photo_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.photo_entries
  SET vote_count = GREATEST(COALESCE(vote_count, 0) - 1, 0)
  WHERE id = p_photo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ANSWER VOTE FUNCTIONS
-- =====================================================

-- Increment upvote count on answers
CREATE OR REPLACE FUNCTION increment_answer_upvotes(p_answer_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.answers
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = p_answer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement upvote count on answers
CREATE OR REPLACE FUNCTION decrement_answer_upvotes(p_answer_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.answers
  SET upvotes = GREATEST(COALESCE(upvotes, 0) - 1, 0)
  WHERE id = p_answer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- QUESTION VIEW COUNT FUNCTION
-- =====================================================

-- Increment view count on questions
CREATE OR REPLACE FUNCTION increment_question_views(p_question_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.questions
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
