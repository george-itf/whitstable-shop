import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateUKPostcode, hashIP } from '@/lib/utils';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shop_id');

  if (!shopId) {
    return NextResponse.json({ error: 'shop_id is required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('shop_id', shopId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const ipHash = hashIP(ip);

  const supabase = await createClient();

  // Validate required fields
  if (!body.shop_id || !body.author_name || !body.author_postcode || !body.rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate postcode format
  if (!validateUKPostcode(body.author_postcode)) {
    return NextResponse.json({ error: 'Invalid UK postcode format' }, { status: 400 });
  }

  // Validate rating
  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  // Check rate limiting (max 3 reviews per day per IP)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', oneDayAgo);

  if (count && count >= 3) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again tomorrow.' }, { status: 429 });
  }

  // Basic spam detection
  let flaggedReason: string | null = null;

  // Check for URLs in comment
  if (body.comment && /https?:\/\/|www\./i.test(body.comment)) {
    flaggedReason = 'Contains URL';
  }

  // Check for repeated characters
  if (body.comment && /(.)\1{4,}/.test(body.comment)) {
    flaggedReason = 'Contains repeated characters';
  }

  // Check if postcode is far from Whitstable (CT5)
  // This is a simplified check - in production you'd use a geocoding API
  const whitstablePostcodes = ['CT5', 'CT6', 'CT1', 'CT2', 'CT3', 'CT4'];
  const postcodePrefix = body.author_postcode.toUpperCase().replace(/\s+/g, '').slice(0, 3);
  if (!whitstablePostcodes.some(p => postcodePrefix.startsWith(p.slice(0, 2)))) {
    flaggedReason = flaggedReason || 'Postcode far from Whitstable';
  }

  const reviewData = {
    shop_id: body.shop_id,
    user_id: null, // Would get from auth if logged in
    author_name: body.author_name.trim(),
    author_postcode: body.author_postcode.toUpperCase().trim(),
    rating: body.rating,
    comment: body.comment?.trim() || null,
    status: flaggedReason ? 'pending' : 'approved',
    flagged_reason: flaggedReason,
    ip_hash: ipHash,
  };

  const { data, error } = await supabase.from('reviews').insert(reviewData).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update shop review count
  // This would be better done with a Postgres trigger
  if (!flaggedReason) {
    // Could update shop's save_count here
  }

  return NextResponse.json(data);
}
