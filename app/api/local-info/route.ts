import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/local-info
 * Fetch active local info pages (public)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (slug) {
      // Fetch single page by slug
      const { data, error } = await supabase
        .from('local_info_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }
        throw error;
      }

      return NextResponse.json(data);
    }

    // Fetch all active pages
    const { data, error } = await supabase
      .from('local_info_pages')
      .select('id, slug, title, subtitle, icon, color, bg_color, image_url, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching local info pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch local info pages' },
      { status: 500 }
    );
  }
}
