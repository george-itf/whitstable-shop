import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const withEvents = searchParams.get('with_events'); // Include upcoming events

    const supabase = await createClient();

    let query = supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true })
      .limit(limit);

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data: charities, error } = await query;

    if (error) {
      console.error('Charities GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch charities' }, { status: 500 });
    }

    // If with_events requested, also get upcoming events
    if (withEvents === 'true' && charities.length > 0) {
      const charityIds = charities.map((c) => c.id);
      const today = new Date().toISOString().split('T')[0];

      const { data: events, error: eventsError } = await supabase
        .from('charity_events')
        .select('*')
        .in('charity_id', charityIds)
        .gte('date', today)
        .eq('is_active', true)
        .order('date', { ascending: true })
        .limit(10);

      if (!eventsError && events) {
        // Attach events to charities
        const charitiesWithEvents = charities.map((charity) => ({
          ...charity,
          upcoming_events: events.filter((e) => e.charity_id === charity.id),
        }));
        return NextResponse.json(charitiesWithEvents);
      }
    }

    return NextResponse.json(charities);
  } catch (error) {
    console.error('Charities GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
