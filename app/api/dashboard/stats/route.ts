import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's shops
    const { data: shops } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .eq('status', 'approved');

    if (!shops || shops.length === 0) {
      return NextResponse.json({
        views: 0,
        saves: 0,
        reviews: 0,
        has_shop: false,
      });
    }

    const shopIds = shops.map((s: { id: string }) => s.id);

    // Get total views for all shops
    // shop_views is an event log, so count the rows instead of summing a view_count column
    const { count: totalViews } = await supabase
      .from('shop_views')
      .select('*', { count: 'exact', head: true })
      .in('shop_id', shopIds);

    // Get saves count
    const { count: savesCount } = await supabase
      .from('saved_shops')
      .select('*', { count: 'exact', head: true })
      .in('shop_id', shopIds);

    // Get reviews count
    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .in('shop_id', shopIds)
      .eq('status', 'approved');

    // Get recent activity
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, shops(name)')
      .in('shop_id', shopIds)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      views: totalViews,
      saves: savesCount || 0,
      reviews: reviewsCount || 0,
      has_shop: true,
      recent_reviews: recentReviews || [],
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
