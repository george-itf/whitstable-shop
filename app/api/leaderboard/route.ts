import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const week = searchParams.get('week'); // Optional: specific week (YYYY-MM-DD of week start)

    const supabase = await createClient();

    // If requesting specific week stats from shop_weekly_stats table
    if (week) {
      const { data, error } = await supabase
        .from('shop_weekly_stats')
        .select('*, shop:shops(id, name, slug, category:categories(*))')
        .eq('week_start', week)
        .order('rank', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Leaderboard GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // Default: calculate current rankings from shops table
    const { data, error } = await supabase
      .from('shops')
      .select('id, name, slug, tagline, view_count, save_count, category:categories(*)')
      .eq('status', 'approved')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Leaderboard GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    // Add rank and calculate engagement score
    const leaderboard = data.map((shop, index) => ({
      ...shop,
      rank: index + 1,
      engagement_score: (shop.view_count || 0) + (shop.save_count || 0) * 5,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
