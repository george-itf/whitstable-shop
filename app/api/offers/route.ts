import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // discount, freebie, bundle, loyalty, event, other
    const shopId = searchParams.get('shop_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const ongoing = searchParams.get('ongoing'); // 'true' for ongoing only

    const supabase = await createClient();

    let query = supabase
      .from('offers')
      .select('*, shop:shops(id, name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter to valid offers (not expired)
    const today = new Date().toISOString().split('T')[0];
    query = query.or(`valid_until.is.null,valid_until.gte.${today}`);

    if (type) {
      query = query.eq('offer_type', type);
    }

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    if (ongoing === 'true') {
      query = query.eq('is_ongoing', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Offers GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Offers GET exception:', error);
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
    const { shop_id, title, offer_type } = body;
    if (!shop_id || !title || !offer_type) {
      return NextResponse.json({ error: 'shop_id, title, and offer_type are required' }, { status: 400 });
    }

    // Validate offer_type
    const validTypes = ['discount', 'freebie', 'bundle', 'loyalty', 'event', 'other'];
    if (!validTypes.includes(offer_type as string)) {
      return NextResponse.json({ error: 'Invalid offer_type' }, { status: 400 });
    }

    // Verify shop ownership
    const { data: shop } = await supabase.from('shops').select('owner_id').eq('id', shop_id).single();

    if (!shop || shop.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to create offers for this shop' }, { status: 403 });
    }

    const offerData = {
      shop_id,
      title: (title as string).trim(),
      description: body.description ? (body.description as string).trim() : null,
      valid_from: body.valid_from || new Date().toISOString().split('T')[0],
      valid_until: body.valid_until || null,
      is_ongoing: body.is_ongoing || false,
      terms: body.terms ? (body.terms as string).trim() : null,
      offer_type,
      is_active: true,
    };

    const { data, error } = await supabase.from('offers').insert(offerData).select().single();

    if (error) {
      console.error('Offers POST error:', error);
      return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Offers POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
