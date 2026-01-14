import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/dog-walks/attend
 * Get attendees for a specific walk instance
 *
 * Query params:
 * - schedule_id: The schedule ID
 * - date: The walk date (YYYY-MM-DD)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('schedule_id');
    const date = searchParams.get('date');

    if (!scheduleId || !date) {
      return NextResponse.json(
        { error: 'schedule_id and date are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get attendees with their profile info
    const { data: attendees, error } = await supabase
      .from('dog_walk_attendees')
      .select(`
        id,
        dog_name,
        dog_breed,
        notes,
        status,
        created_at,
        user:profiles!dog_walk_attendees_user_id_fkey(
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('schedule_id', scheduleId)
      .eq('walk_date', date)
      .eq('status', 'attending')
      .order('created_at');

    if (error) {
      console.error('Attendees GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
    }

    return NextResponse.json(attendees || []);
  } catch (error) {
    console.error('Attendees GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/dog-walks/attend
 * Join a dog walk
 *
 * Body:
 * - schedule_id: The schedule ID
 * - date: The walk date (YYYY-MM-DD)
 * - dog_name?: Optional dog name
 * - dog_breed?: Optional breed
 * - notes?: Any notes (e.g., "My dog is reactive")
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse body
    let body: {
      schedule_id: string;
      date: string;
      dog_name?: string;
      dog_breed?: string;
      notes?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { schedule_id, date, dog_name, dog_breed, notes } = body;

    if (!schedule_id || !date) {
      return NextResponse.json(
        { error: 'schedule_id and date are required' },
        { status: 400 }
      );
    }

    // Validate the schedule exists and is active
    const { data: schedule, error: scheduleError } = await supabase
      .from('dog_walk_schedule')
      .select('id, max_participants')
      .eq('id', schedule_id)
      .eq('is_active', true)
      .single();

    if (scheduleError || !schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    // Check if already at max capacity
    const { count } = await supabase
      .from('dog_walk_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('schedule_id', schedule_id)
      .eq('walk_date', date)
      .eq('status', 'attending');

    if (count && count >= schedule.max_participants) {
      return NextResponse.json(
        { error: 'This walk is full. Try another time slot!' },
        { status: 400 }
      );
    }

    // Check if user already attending this walk
    const { data: existing } = await supabase
      .from('dog_walk_attendees')
      .select('id, status')
      .eq('schedule_id', schedule_id)
      .eq('walk_date', date)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      if (existing.status === 'attending') {
        return NextResponse.json(
          { error: 'You are already attending this walk' },
          { status: 400 }
        );
      }

      // Re-activate cancelled attendance
      const { data: updated, error: updateError } = await supabase
        .from('dog_walk_attendees')
        .update({
          status: 'attending',
          dog_name,
          dog_breed,
          notes,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: 'Failed to rejoin walk' }, { status: 500 });
      }

      return NextResponse.json(updated);
    }

    // Create new attendance
    const { data: attendance, error: insertError } = await supabase
      .from('dog_walk_attendees')
      .insert({
        schedule_id,
        walk_date: date,
        user_id: user.id,
        dog_name,
        dog_breed,
        notes,
        status: 'attending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Attendance insert error:', insertError);
      return NextResponse.json({ error: 'Failed to join walk' }, { status: 500 });
    }

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Attendance POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/dog-walks/attend
 * Leave/cancel attendance at a dog walk
 *
 * Query params:
 * - schedule_id: The schedule ID
 * - date: The walk date (YYYY-MM-DD)
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('schedule_id');
    const date = searchParams.get('date');

    if (!scheduleId || !date) {
      return NextResponse.json(
        { error: 'schedule_id and date are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Update status to cancelled (soft delete for history)
    const { error } = await supabase
      .from('dog_walk_attendees')
      .update({ status: 'cancelled' })
      .eq('schedule_id', scheduleId)
      .eq('walk_date', date)
      .eq('user_id', user.id);

    if (error) {
      console.error('Attendance DELETE error:', error);
      return NextResponse.json({ error: 'Failed to leave walk' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Attendance DELETE exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
