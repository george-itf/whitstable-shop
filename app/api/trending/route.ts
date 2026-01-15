import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Types for trending items
interface TrendingItem {
  entity_type: string;
  entity_id: string;
  score: number;
  trend_direction: 'up' | 'down' | 'steady' | 'new';
  trend_change_pct: number;
  view_count: number;
  engagement_count: number;
  rank: number;
  // Entity-specific details
  name?: string;
  slug?: string;
  tagline?: string;
  image_url?: string;
  reason: string;
}

/**
 * GET /api/trending
 * Get trending content across all entity types
 *
 * Query params:
 * - type: Filter by entity type (shop, charity, question, photo, event, info_page)
 * - limit: Number of items to return (default: 10, max: 50)
 * - period: Time period (24h, 7d, 30d) - default: 7d
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Filter by entity type
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const period = searchParams.get('period') || '7d'; // 24h, 7d, 30d

    const supabase = await createClient();

    // Determine which score column to use based on period
    const scoreColumn = period === '24h' ? 'score_24h' : period === '30d' ? 'score_30d' : 'score_7d';

    // Build query
    let query = supabase
      .from('trending_scores')
      .select('*')
      .gt(scoreColumn, 0)
      .order(scoreColumn, { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('entity_type', type);
    }

    const { data: trendingScores, error: trendingError } = await query;

    if (trendingError) {
      // Table doesn't exist yet - silently fall back to legacy method
      // PGRST205 = table not found, 42P01 = undefined_table
      if (trendingError.code !== 'PGRST205' && trendingError.code !== '42P01') {
        console.error('Trending scores error:', trendingError);
      }
      return getLegacyTrending(supabase, type, limit);
    }

    if (!trendingScores || trendingScores.length === 0) {
      // No trending data yet, fall back to legacy
      return getLegacyTrending(supabase, type, limit);
    }

    // Fetch entity details for each trending item
    const trendingItems: TrendingItem[] = [];

    for (const score of trendingScores) {
      const item = await enrichTrendingItem(supabase, score, scoreColumn);
      if (item) {
        trendingItems.push(item);
      }
    }

    return NextResponse.json(trendingItems);
  } catch (error) {
    console.error('Trending GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Enrich trending score with entity details
 */
async function enrichTrendingItem(
  supabase: Awaited<ReturnType<typeof createClient>>,
  score: Record<string, unknown>,
  scoreColumn: string
): Promise<TrendingItem | null> {
  const entityType = score.entity_type as string;
  const entityId = score.entity_id as string;

  let name = '';
  let slug = '';
  let tagline = '';
  let image_url = '';

  // Fetch entity details based on type
  switch (entityType) {
    case 'shop': {
      const { data } = await supabase
        .from('shops')
        .select('name, slug, tagline')
        .eq('id', entityId)
        .eq('status', 'approved')
        .single();
      if (!data) return null;
      name = data.name;
      slug = data.slug;
      tagline = data.tagline || '';
      break;
    }
    case 'charity': {
      const { data } = await supabase
        .from('charities')
        .select('name, slug, description')
        .eq('id', entityId)
        .single();
      if (!data) return null;
      name = data.name;
      slug = data.slug;
      tagline = data.description || '';
      break;
    }
    case 'question': {
      const { data } = await supabase
        .from('questions')
        .select('id, question')
        .eq('id', entityId)
        .single();
      if (!data) return null;
      name = data.question.substring(0, 60) + (data.question.length > 60 ? '...' : '');
      slug = data.id;
      break;
    }
    case 'photo': {
      const { data } = await supabase
        .from('photos')
        .select('id, caption, image_url')
        .eq('id', entityId)
        .single();
      if (!data) return null;
      name = data.caption || 'Photo';
      slug = data.id;
      image_url = data.image_url || '';
      break;
    }
    case 'event': {
      const { data } = await supabase
        .from('events')
        .select('id, title, description')
        .eq('id', entityId)
        .single();
      if (!data) return null;
      name = data.title;
      slug = data.id;
      tagline = data.description || '';
      break;
    }
    case 'info_page': {
      // Info pages use slug as ID
      name = formatInfoPageName(entityId);
      slug = entityId;
      break;
    }
    default:
      return null;
  }

  // Generate reason text
  const reason = generateTrendingReason(
    entityType,
    score.trend_direction as string,
    score.view_count_7d as number,
    score.engagement_count_7d as number
  );

  return {
    entity_type: entityType,
    entity_id: entityId,
    score: score[scoreColumn] as number,
    trend_direction: score.trend_direction as 'up' | 'down' | 'steady' | 'new',
    trend_change_pct: score.trend_change_pct as number,
    view_count: score.view_count_7d as number,
    engagement_count: score.engagement_count_7d as number,
    rank: score.rank_in_type as number,
    name,
    slug,
    tagline,
    image_url,
    reason,
  };
}

/**
 * Format info page slug to readable name
 */
function formatInfoPageName(slug: string): string {
  const names: Record<string, string> = {
    'bin-collection': 'Bin Collection Days',
    'tide-times': 'Tide Times',
    'oyster-festival': 'Oyster Festival',
    'carnival': 'Carnival',
    'parking': 'Parking',
    'beach-info': 'Beach Info',
    'emergency': 'Emergency Contacts',
    'council': 'Council Contacts',
    'school-terms': 'School Term Dates',
  };
  return names[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Generate human-readable reason for trending
 */
function generateTrendingReason(
  entityType: string,
  trendDirection: string,
  viewCount: number,
  engagementCount: number
): string {
  if (trendDirection === 'new') {
    return 'New & getting attention';
  }

  if (trendDirection === 'up') {
    if (engagementCount > 10) {
      return `${engagementCount} people engaging`;
    }
    return 'Trending up this week';
  }

  if (viewCount > 100) {
    return `${viewCount}+ views this week`;
  }

  if (engagementCount > 5) {
    const label = entityType === 'shop' ? 'saves' : entityType === 'question' ? 'answers' : 'interactions';
    return `${engagementCount} ${label}`;
  }

  return 'Popular this week';
}

/**
 * Legacy trending calculation (fallback when new system not set up)
 * This uses the old shop_views table and simple counting
 */
async function getLegacyTrending(
  supabase: Awaited<ReturnType<typeof createClient>>,
  type: string | null,
  limit: number
) {
  // Only supports shops in legacy mode
  if (type && type !== 'shop') {
    return NextResponse.json([]);
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get view counts per shop
  const { data: viewCounts } = await supabase
    .from('shop_views')
    .select('shop_id')
    .gte('viewed_at', sevenDaysAgo);

  const shopViewCounts: Record<string, number> = {};
  viewCounts?.forEach((view: { shop_id: string }) => {
    shopViewCounts[view.shop_id] = (shopViewCounts[view.shop_id] || 0) + 1;
  });

  // Get recent reviews count
  const { data: reviewCounts } = await supabase
    .from('reviews')
    .select('shop_id')
    .eq('status', 'approved')
    .gte('created_at', sevenDaysAgo);

  const shopReviewCounts: Record<string, number> = {};
  reviewCounts?.forEach((review: { shop_id: string }) => {
    shopReviewCounts[review.shop_id] = (shopReviewCounts[review.shop_id] || 0) + 1;
  });

  // Get all approved shops
  const { data: shops, error: shopError } = await supabase
    .from('shops')
    .select('id, name, slug, tagline, save_count, category:categories(name)')
    .eq('status', 'approved');

  if (shopError || !shops) {
    return NextResponse.json([]);
  }

  // Calculate trending score
  type TrendingShop = { id: string; name: string; slug: string; tagline: string | null; save_count: number | null; category: unknown };
  const trendingShops = shops.map((shop: TrendingShop) => {
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
      entity_type: 'shop',
      entity_id: shop.id,
      score,
      trend_direction: 'steady' as const,
      trend_change_pct: 0,
      view_count: views,
      engagement_count: reviews + saves,
      rank: 0,
      name: shop.name,
      slug: shop.slug,
      tagline: shop.tagline || '',
      reason,
    };
  });

  // Sort by score and take top items
  type TrendingResult = { score: number; rank: number; name: string; slug: string; tagline: string; reason: string };
  const sorted = trendingShops
    .filter((s: TrendingResult) => s.score > 0)
    .sort((a: TrendingResult, b: TrendingResult) => b.score - a.score)
    .slice(0, limit)
    .map((item: TrendingResult, index: number) => ({ ...item, rank: index + 1 }));

  return NextResponse.json(sorted);
}
