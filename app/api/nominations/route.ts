import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      category,
      nominee_name,
      nominee_business,
      reason,
      nominator_name,
      nominator_email,
      award_month,
    } = body;

    // Validate required fields
    if (!category || !nominee_name || !reason || !nominator_name || !award_month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['hospitality_star', 'community_hero'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // If Supabase not configured, just return success (for demo)
      console.log('Nomination received (Supabase not configured):', body);
      return NextResponse.json({ success: true, demo: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert nomination
    const { data, error } = await supabase
      .from('nominations')
      .insert({
        category,
        nominee_name,
        nominee_business,
        reason,
        nominator_name,
        nominator_email,
        award_month,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting nomination:', error);
      return NextResponse.json(
        { error: 'Failed to submit nomination' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error processing nomination:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return current month's winners (public endpoint)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ winners: [], demo: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('award_winners')
      .select('*')
      .eq('award_month', currentMonth)
      .order('category')
      .order('rank');

    if (error) {
      console.error('Error fetching winners:', error);
      return NextResponse.json({ winners: [] });
    }

    return NextResponse.json({ winners: data });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json({ winners: [] });
  }
}
