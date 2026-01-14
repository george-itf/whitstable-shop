import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/dog-walks
 * Get all active dog walking routes with their schedules
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Optional: get walks for specific date

    const supabase = await createClient();

    // Get all active routes with schedules
    const { data: routes, error: routesError } = await supabase
      .from('dog_walk_routes')
      .select(`
        *,
        schedules:dog_walk_schedule(
          id,
          day_of_week,
          time_slot,
          max_participants,
          is_active
        )
      `)
      .eq('is_active', true)
      .order('display_order');

    if (routesError) {
      console.error('Dog walks GET error:', routesError);
      return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
    }

    // If date provided, get attendee counts for that date
    if (date && routes) {
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();

      // Get attendee counts for the specified date
      const { data: attendeeCounts } = await supabase
        .from('dog_walk_attendees')
        .select('schedule_id')
        .eq('walk_date', date)
        .eq('status', 'attending');

      // Count attendees per schedule
      const countsBySchedule: Record<string, number> = {};
      attendeeCounts?.forEach((a: { schedule_id: string }) => {
        countsBySchedule[a.schedule_id] = (countsBySchedule[a.schedule_id] || 0) + 1;
      });

      // Filter schedules to only include those for the target day
      // and add attendee counts
      interface Schedule {
        id: string;
        day_of_week: number;
        time_slot: string;
        max_participants: number;
        is_active: boolean;
      }
      const routesWithCounts = routes.map((route: { schedules?: Schedule[] }) => ({
        ...route,
        schedules: (route.schedules || [])
          .filter((s) => s.day_of_week === dayOfWeek && s.is_active)
          .map((s) => ({
            ...s,
            attendee_count: countsBySchedule[s.id] || 0,
          })),
      }));

      return NextResponse.json(routesWithCounts);
    }

    return NextResponse.json(routes);
  } catch (error) {
    console.error('Dog walks GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
