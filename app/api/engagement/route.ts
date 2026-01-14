import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// Valid entity types and actions
const VALID_ENTITY_TYPES = ['shop', 'charity', 'question', 'info_page', 'photo', 'event'];
const VALID_ACTIONS = ['view', 'like', 'save', 'share', 'comment', 'answer', 'review', 'vote', 'rsvp'];

// Points for each action (fallback if not in DB)
const ACTION_POINTS: Record<string, number> = {
  view: 1,
  like: 2,
  save: 2,
  share: 3,
  comment: 4,
  answer: 4,
  review: 5,
  vote: 2,
  rsvp: 3,
};

/**
 * POST /api/engagement
 * Record an engagement event (view, like, share, etc.)
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    // Different rate limits for views vs other actions
    // Views: 100 per minute (normal browsing)
    // Other actions: 30 per minute (more restrictive)

    let body: {
      entity_type: string;
      entity_id: string;
      action: string;
      session_id?: string;
      metadata?: Record<string, unknown>;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { entity_type, entity_id, action, session_id, metadata } = body;

    // Validate required fields
    if (!entity_type || !entity_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: entity_type, entity_id, action' },
        { status: 400 }
      );
    }

    // Validate entity type
    if (!VALID_ENTITY_TYPES.includes(entity_type)) {
      return NextResponse.json(
        { error: `Invalid entity_type. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate action
    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Apply rate limiting
    const isView = action === 'view';
    const rateLimit = checkRateLimit(
      `engagement:${isView ? 'view' : 'action'}:${ip}`,
      { limit: isView ? 100 : 30, windowSeconds: 60 }
    );

    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.reset);
    }

    const supabase = await createClient();

    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Get points for this action
    const points = ACTION_POINTS[action] || 1;

    // Insert engagement event
    const { data, error } = await supabase
      .from('engagement_events')
      .insert({
        entity_type,
        entity_id,
        action,
        points,
        user_id: user?.id || null,
        session_id: session_id || null,
        metadata: metadata || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Engagement record error:', error);
      return NextResponse.json({ error: 'Failed to record engagement' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      event_id: data.id,
      points,
    });
  } catch (error) {
    console.error('Engagement POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/engagement
 * Get engagement stats for an entity
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity_type = searchParams.get('entity_type');
    const entity_id = searchParams.get('entity_id');

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: 'Missing required params: entity_type, entity_id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get engagement summary for this entity
    const { data, error } = await supabase
      .from('engagement_events')
      .select('action, points')
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Engagement GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch engagement' }, { status: 500 });
    }

    // Aggregate stats
    const stats = {
      total_events: data.length,
      total_points: data.reduce((sum, e) => sum + e.points, 0),
      views: data.filter(e => e.action === 'view').length,
      likes: data.filter(e => e.action === 'like').length,
      saves: data.filter(e => e.action === 'save').length,
      shares: data.filter(e => e.action === 'share').length,
      comments: data.filter(e => e.action === 'comment').length,
      reviews: data.filter(e => e.action === 'review').length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Engagement GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
