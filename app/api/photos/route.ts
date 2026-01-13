import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Competition month (YYYY-MM)
    const shopId = searchParams.get('shop_id');
    const winners = searchParams.get('winners'); // 'true' for winners only
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createClient();

    let query = supabase
      .from('photos')
      .select('*, profiles:user_id(display_name, avatar_url), shop:shops(id, name, slug)')
      .eq('status', 'approved')
      .order('vote_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (month) {
      query = query.eq('competition_month', month);
    }

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    if (winners === 'true') {
      query = query.eq('is_winner', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Photos GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Photos GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit: 10 photo submissions per hour per IP
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`photos:post:${ip}`, { limit: 10, windowSeconds: 3600 });
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.reset);
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { image_url, caption, shop_id, competition_month } = body;

    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(image_url as string);
    } catch {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    // If shop_id provided, verify it exists
    if (shop_id) {
      const { data: shop } = await supabase.from('shops').select('id').eq('id', shop_id).single();
      if (!shop) {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
      }
    }

    // Get current month for competition
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const photoData = {
      user_id: user.id,
      shop_id: shop_id || null,
      image_url,
      caption: caption ? (caption as string).trim() : null,
      competition_month: competition_month || currentMonth,
      vote_count: 0,
      is_winner: false,
      status: 'pending', // Requires approval
    };

    const { data, error } = await supabase.from('photos').insert(photoData).select().single();

    if (error) {
      console.error('Photos POST error:', error);
      return NextResponse.json({ error: 'Failed to submit photo' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Photos POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
