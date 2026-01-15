import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications/push
 * Get the current user's push subscriptions
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, created_at, last_used, user_agent')
      .eq('user_id', user.id)
      .order('last_used', { ascending: false });

    if (error) {
      console.error('Get push subscriptions error:', error);
      return NextResponse.json({ error: 'Failed to get subscriptions' }, { status: 500 });
    }

    return NextResponse.json({
      subscriptions: subscriptions || [],
      vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null,
    });
  } catch (error) {
    console.error('Push GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/notifications/push
 * Subscribe to push notifications
 *
 * Body: {
 *   endpoint: string,
 *   keys: { p256dh: string, auth: string }
 * }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: 'Missing subscription data' },
        { status: 400 }
      );
    }

    // Get user agent for device identification
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Upsert subscription (update if exists)
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh: keys.p256dh,
          auth_key: keys.auth,
          user_agent: userAgent.substring(0, 255),
          last_used: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,endpoint',
        }
      )
      .select('id')
      .single();

    if (error) {
      console.error('Subscribe push error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    // Also enable push in notification preferences
    await supabase
      .from('notification_preferences')
      .upsert(
        { user_id: user.id, push_enabled: true },
        { onConflict: 'user_id' }
      );

    return NextResponse.json({
      success: true,
      subscriptionId: data.id,
    });
  } catch (error) {
    console.error('Push POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications/push
 * Unsubscribe from push notifications
 *
 * Query params:
 * - endpoint: The push endpoint to remove (optional, removes all if not provided)
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    let query = supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id);

    if (endpoint) {
      query = query.eq('endpoint', endpoint);
    }

    const { error } = await query;

    if (error) {
      console.error('Unsubscribe push error:', error);
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }

    // Check if user has any remaining subscriptions
    const { count } = await supabase
      .from('push_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Disable push in preferences if no subscriptions left
    if (count === 0) {
      await supabase
        .from('notification_preferences')
        .upsert(
          { user_id: user.id, push_enabled: false },
          { onConflict: 'user_id' }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
