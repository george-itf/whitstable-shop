import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper to check if user is admin
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  return profile?.role === 'admin';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { category, nominee_name, nominee_business, reason, nominator_name, nominator_email, award_month } = body;

    // Validate required fields
    if (!category || !nominee_name || !reason || !nominator_name || !award_month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate category
    if (!['hospitality_star', 'community_hero'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Validate award_month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(award_month)) {
      return NextResponse.json({ error: 'Invalid award_month format (expected YYYY-MM)' }, { status: 400 });
    }

    // Validate email if provided
    if (nominator_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nominator_email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert nomination
    const { data, error } = await supabase
      .from('nominations')
      .insert({
        category,
        nominee_name: nominee_name.trim(),
        nominee_business: nominee_business?.trim() || null,
        reason: reason.trim(),
        nominator_name: nominator_name.trim(),
        nominator_email: nominator_email?.trim() || null,
        award_month,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting nomination:', error);
      return NextResponse.json({ error: 'Failed to submit nomination' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Error processing nomination:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const month = searchParams.get('month');
    const winners = searchParams.get('winners');

    const supabase = await createClient();

    // If requesting winners, return from award_winners table
    if (winners === 'true') {
      const now = new Date();
      const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('award_winners')
        .select('*')
        .eq('award_month', targetMonth)
        .order('category')
        .order('rank');

      if (error) {
        console.error('Error fetching winners:', error);
        return NextResponse.json({ winners: [] });
      }

      return NextResponse.json({ winners: data });
    }

    // If requesting by status (admin), check permissions
    if (status) {
      const adminCheck = await isAdmin(supabase);
      if (!adminCheck) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      let query = supabase.from('nominations').select('*').eq('status', status).order('created_at', { ascending: false });

      if (month) {
        query = query.eq('award_month', month);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching nominations:', error);
        return NextResponse.json({ error: 'Failed to fetch nominations' }, { status: 500 });
      }

      return NextResponse.json({ nominations: data });
    }

    // Default: return current month's pending count (public)
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { count, error } = await supabase
      .from('nominations')
      .select('*', { count: 'exact', head: true })
      .eq('award_month', currentMonth)
      .eq('status', 'pending');

    if (error) {
      console.error('Error counting nominations:', error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count, month: currentMonth });
  } catch (error) {
    console.error('Error fetching nominations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin: Update nomination status or make winner
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    // Check admin
    const adminCheck = await isAdmin(supabase);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, rank } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    // Get the nomination
    const { data: nomination, error: fetchError } = await supabase
      .from('nominations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !nomination) {
      return NextResponse.json({ error: 'Nomination not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Just approve without making winner
      const { error } = await supabase.from('nominations').update({ status: 'approved' }).eq('id', id);

      if (error) {
        console.error('Error approving nomination:', error);
        return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
      }

      return NextResponse.json({ success: true, status: 'approved' });
    }

    if (action === 'winner') {
      // Make this nomination a winner
      const winnerRank = rank || 1;

      // Insert into award_winners
      const { error: winnerError } = await supabase.from('award_winners').insert({
        award_month: nomination.award_month,
        category: nomination.category,
        rank: winnerRank,
        winner_name: nomination.nominee_name,
        winner_business: nomination.nominee_business,
        reason: nomination.reason,
        nomination_id: nomination.id,
      });

      if (winnerError) {
        console.error('Error creating winner:', winnerError);
        return NextResponse.json({ error: 'Failed to create winner' }, { status: 500 });
      }

      // Update nomination status
      const { error: updateError } = await supabase.from('nominations').update({ status: 'winner' }).eq('id', id);

      if (updateError) {
        console.error('Error updating nomination:', updateError);
      }

      return NextResponse.json({ success: true, status: 'winner', rank: winnerRank });
    }

    if (action === 'reject') {
      const { error } = await supabase.from('nominations').update({ status: 'rejected' }).eq('id', id);

      if (error) {
        console.error('Error rejecting nomination:', error);
        return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
      }

      return NextResponse.json({ success: true, status: 'rejected' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating nomination:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin: Delete nomination
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // Check admin
    const adminCheck = await isAdmin(supabase);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabase.from('nominations').delete().eq('id', id);

    if (error) {
      console.error('Error deleting nomination:', error);
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting nomination:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
