import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('saved_shops')
      .select('shop_id, created_at, shop:shops(*, category:categories(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Saved GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch saved shops' }, { status: 500 });
    }

    // Extract just the shop data with saved timestamp
    const shops = data.map((item) => ({
      ...item.shop,
      saved_at: item.created_at,
    }));

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Saved GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit: 50 save operations per hour per IP
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`saved:post:${ip}`, { limit: 50, windowSeconds: 3600 });
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

    const { shop_id } = body;
    if (!shop_id) {
      return NextResponse.json({ error: 'shop_id is required' }, { status: 400 });
    }

    // Check if shop exists
    const { data: shop } = await supabase.from('shops').select('id').eq('id', shop_id).single();

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_shops')
      .select('id')
      .eq('user_id', user.id)
      .eq('shop_id', shop_id)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already saved' }, { status: 200 });
    }

    // Save the shop
    const { error } = await supabase.from('saved_shops').insert({
      user_id: user.id,
      shop_id,
    });

    if (error) {
      console.error('Saved POST error:', error);
      return NextResponse.json({ error: 'Failed to save shop' }, { status: 500 });
    }

    // Increment save count (fire-and-forget)
    supabase.rpc('increment_save_count', { p_shop_id: shop_id }).then(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Saved POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Rate limit: 50 unsave operations per hour per IP
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`saved:delete:${ip}`, { limit: 50, windowSeconds: 3600 });
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

    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shop_id');

    if (!shopId) {
      return NextResponse.json({ error: 'shop_id is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_shops')
      .delete()
      .eq('user_id', user.id)
      .eq('shop_id', shopId);

    if (error) {
      console.error('Saved DELETE error:', error);
      return NextResponse.json({ error: 'Failed to unsave shop' }, { status: 500 });
    }

    // Decrement save count (fire-and-forget)
    supabase.rpc('decrement_save_count', { p_shop_id: shopId }).then(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Saved DELETE exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
