import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = await createClient();

    const { data: photo, error } = await supabase
      .from('photos')
      .select('*, profiles:user_id(display_name, avatar_url), shop:shops(id, name, slug)')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
      }
      console.error('Photo GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Photo GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
