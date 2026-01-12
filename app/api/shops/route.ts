import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = searchParams.get('limit') || '50';
  const featured = searchParams.get('featured');

  const supabase = await createClient();

  let query = supabase
    .from('shops')
    .select('*, category:categories(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(parseInt(limit));

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  const shopData = {
    ...body,
    owner_id: user?.user?.id || null,
    status: 'pending',
  };

  const { data, error } = await supabase.from('shops').insert(shopData).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
