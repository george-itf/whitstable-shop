import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications/preferences
 * Get the current user's notification preferences
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Get preferences error:', error);
      return NextResponse.json({ error: 'Failed to get preferences' }, { status: 500 });
    }

    // Return defaults if no preferences exist
    if (!preferences) {
      return NextResponse.json({
        weekly_digest: true,
        new_review_alert: true,
        event_reminders: true,
        answer_notifications: true,
        save_notifications: false,
        push_enabled: false,
        push_new_events: true,
        push_trending: false,
        push_deals: true,
        digest_frequency: 'weekly',
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/notifications/preferences
 * Update the current user's notification preferences
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate allowed fields
    const allowedFields = [
      'weekly_digest',
      'new_review_alert',
      'event_reminders',
      'answer_notifications',
      'save_notifications',
      'push_enabled',
      'push_new_events',
      'push_trending',
      'push_deals',
      'digest_frequency',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        // Validate digest_frequency
        if (field === 'digest_frequency') {
          if (!['daily', 'weekly', 'monthly', 'never'].includes(body[field])) {
            return NextResponse.json(
              { error: 'Invalid digest_frequency value' },
              { status: 400 }
            );
          }
        }
        // Validate booleans
        else if (typeof body[field] !== 'boolean') {
          return NextResponse.json(
            { error: `${field} must be a boolean` },
            { status: 400 }
          );
        }
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Upsert preferences
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert(
        { user_id: user.id, ...updates },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Update preferences error:', error);
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Preferences PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications/preferences
 * Toggle a single notification preference
 *
 * Body: { field: string }
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { field } = await request.json();

    const toggleableFields = [
      'weekly_digest',
      'new_review_alert',
      'event_reminders',
      'answer_notifications',
      'save_notifications',
      'push_enabled',
      'push_new_events',
      'push_trending',
      'push_deals',
    ];

    if (!toggleableFields.includes(field)) {
      return NextResponse.json(
        { error: 'Invalid field to toggle' },
        { status: 400 }
      );
    }

    // Get current value
    const { data: current } = await supabase
      .from('notification_preferences')
      .select(field)
      .eq('user_id', user.id)
      .single();

    const currentValue = current?.[field] ?? true;
    const newValue = !currentValue;

    // Upsert with toggled value
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert(
        { user_id: user.id, [field]: newValue },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Toggle preference error:', error);
      return NextResponse.json({ error: 'Failed to toggle preference' }, { status: 500 });
    }

    return NextResponse.json({
      field,
      value: newValue,
      preferences: data,
    });
  } catch (error) {
    console.error('Preferences PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
