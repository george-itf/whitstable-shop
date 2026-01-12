import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Get shops with view counts from last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get view counts per shop
  const { data: viewCounts, error: viewError } = await supabase
    .from('shop_views')
    .select('shop_id')
    .gte('viewed_at', sevenDaysAgo);

  if (viewError) {
    return NextResponse.json({ error: viewError.message }, { status: 500 });
  }

  // Count views per shop
  const shopViewCounts: Record<string, number> = {};
  viewCounts?.forEach((view) => {
    shopViewCounts[view.shop_id] = (shopViewCounts[view.shop_id] || 0) + 1;
  });

  // Get recent reviews count
  const { data: reviewCounts, error: reviewError } = await supabase
    .from('reviews')
    .select('shop_id')
    .eq('status', 'approved')
    .gte('created_at', sevenDaysAgo);

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  const shopReviewCounts: Record<string, number> = {};
  reviewCounts?.forEach((review) => {
    shopReviewCounts[review.shop_id] = (shopReviewCounts[review.shop_id] || 0) + 1;
  });

  // Get all approved shops
  const { data: shops, error: shopError } = await supabase
    .from('shops')
    .select('id, name, slug, save_count, category:categories(name)')
    .eq('status', 'approved');

  if (shopError) {
    return NextResponse.json({ error: shopError.message }, { status: 500 });
  }

  // Calculate trending score
  const trendingShops = shops?.map((shop) => {
    const views = shopViewCounts[shop.id] || 0;
    const reviews = shopReviewCounts[shop.id] || 0;
    const saves = shop.save_count || 0;

    // Weighted score: views (1x) + reviews (5x) + saves (2x)
    const score = views + (reviews * 5) + (saves * 2);

    // Determine reason for trending
    let reason = 'Popular this week';
    if (reviews > 0) {
      reason = `${reviews} new review${reviews !== 1 ? 's' : ''} this week`;
    } else if (views > 50) {
      reason = 'Lots of views this week';
    } else if (saves > 10) {
      reason = 'Most saved this month';
    }

    return {
      ...shop,
      score,
      reason,
    };
  });

  // Sort by score and take top 10
  const sorted = trendingShops
    ?.sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return NextResponse.json(sorted);
}
