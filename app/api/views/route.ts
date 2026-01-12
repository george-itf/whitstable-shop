import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { generateSessionId } from '@/lib/utils';
import { VIEW_COOLDOWN_MS } from '@/lib/constants';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.shop_id) {
    return NextResponse.json({ error: 'shop_id is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;

  // Generate session ID if not exists
  if (!sessionId) {
    sessionId = generateSessionId();
    // Note: In a real app, you'd set this cookie in the response
  }

  const supabase = await createClient();

  // Check if this session already viewed this shop within cooldown period
  const cooldownTime = new Date(Date.now() - VIEW_COOLDOWN_MS).toISOString();
  const { data: existingView } = await supabase
    .from('shop_views')
    .select('id')
    .eq('shop_id', body.shop_id)
    .eq('session_id', sessionId)
    .gte('viewed_at', cooldownTime)
    .single();

  if (existingView) {
    return NextResponse.json({ success: true, message: 'View already counted' });
  }

  // Record new view
  const { error } = await supabase.from('shop_views').insert({
    shop_id: body.shop_id,
    session_id: sessionId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update shop view count
  // This would be better done with a Postgres trigger
  try {
    await supabase.rpc('increment_view_count', { shop_id: body.shop_id });
  } catch {
    // If RPC doesn't exist, fail silently
  }

  return NextResponse.json({ success: true });
}
