import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from'); // Date filter start
    const to = searchParams.get('to'); // Date filter end
    const limit = parseInt(searchParams.get('limit') || '50');
    const shopId = searchParams.get('shop_id');

    const supabase = await createClient();

    let query = supabase
      .from('events')
      .select('*, shop:shops(id, name, slug, images:shop_images(url, is_primary))')
      .order('start_date', { ascending: true }) // Canonical field name
      .limit(limit);

    // Date filtering
    if (from) {
      query = query.gte('start_date', from); // Canonical field name
    } else {
      // Default to today onwards
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('start_date', today); // Canonical field name
    }

    if (to) {
      query = query.lte('start_date', to); // Canonical field name
    }

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Events GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Events GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    // Validate required fields
    const { title, start_date, location } = body; // Use canonical field name
    if (!title || !start_date) {
      return NextResponse.json({ error: 'title and start_date are required' }, { status: 400 });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date as string)) {
      return NextResponse.json({ error: 'Invalid date format (expected YYYY-MM-DD)' }, { status: 400 });
    }

    // If shop_id provided, verify ownership
    if (body.shop_id) {
      const { data: shop } = await supabase
        .from('shops')
        .select('owner_id')
        .eq('id', body.shop_id)
        .single();

      if (!shop || shop.owner_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized to create events for this shop' }, { status: 403 });
      }
    }

    const eventData = {
      shop_id: body.shop_id || null,
      title: (title as string).trim(),
      slug: (title as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description ? (body.description as string).trim() : null,
      start_date, // Canonical field name
      end_date: body.end_date || null, // Canonical field name
      start_time: body.start_time || null, // Canonical field name
      end_time: body.end_time || null, // Canonical field name
      location: location ? (location as string).trim() : null,
      venue: body.venue || null,
      is_recurring: body.is_recurring || false,
      recurrence_rule: body.recurrence_rule || null,
      is_active: true,
      is_featured: false,
    };

    const { data, error } = await supabase.from('events').insert(eventData).select().single();

    if (error) {
      console.error('Events POST error:', error);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Events POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
