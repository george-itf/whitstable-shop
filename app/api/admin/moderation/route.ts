import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createModerationActionEvent, logAuditEvent } from '@/lib/auth/audit';

/**
 * GET /api/admin/moderation
 * Fetch all pending moderation items (shops and reviews)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin/moderator access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'moderator'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // 'shops', 'reviews', 'all'
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const results: {
      shops: unknown[];
      reviews: unknown[];
      counts: {
        pendingShops: number;
        pendingReviews: number;
        flaggedReviews: number;
      };
    } = {
      shops: [],
      reviews: [],
      counts: {
        pendingShops: 0,
        pendingReviews: 0,
        flaggedReviews: 0,
      },
    };

    // Fetch shops if requested
    if (type === 'all' || type === 'shops') {
      const { data: shops, count: shopCount } = await supabase
        .from('shops')
        .select(`
          id,
          name,
          slug,
          tagline,
          description,
          address,
          phone,
          website,
          status,
          created_at,
          owner:profiles!owner_id(id, email, full_name),
          category:categories!category_id(id, name, slug)
        `, { count: 'exact' })
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      results.shops = (shops || []).map(shop => ({
        ...shop,
        type: 'shop',
        owner: Array.isArray(shop.owner) ? shop.owner[0] : shop.owner,
        category: Array.isArray(shop.category) ? shop.category[0] : shop.category,
      }));

      if (status === 'pending') {
        results.counts.pendingShops = shopCount || 0;
      }
    }

    // Fetch reviews if requested
    if (type === 'all' || type === 'reviews') {
      const { data: reviews, count: reviewCount } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          author_name,
          author_postcode,
          status,
          flagged_reason,
          created_at,
          shop:shops!shop_id(id, name, slug),
          user:profiles!user_id(id, email, full_name)
        `, { count: 'exact' })
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      results.reviews = (reviews || []).map(review => ({
        ...review,
        type: 'review',
        shop: Array.isArray(review.shop) ? review.shop[0] : review.shop,
        user: Array.isArray(review.user) ? review.user[0] : review.user,
      }));

      if (status === 'pending') {
        results.counts.pendingReviews = reviewCount || 0;
      }
    }

    // Get count of flagged reviews
    const { count: flaggedCount } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .not('flagged_reason', 'is', null);

    results.counts.flaggedReviews = flaggedCount || 0;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching moderation queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moderation queue' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/moderation
 * Perform moderation action (approve, reject, flag)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin/moderator access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'moderator'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, contentType, contentId, reason, note } = body;

    // Validate action
    if (!['approve', 'reject', 'flag', 'unflag'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Validate content type
    if (!['shop', 'review'].includes(contentType)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const tableName = contentType === 'shop' ? 'shops' : 'reviews';
    let newStatus: string;

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'flag':
      case 'unflag':
        // For flagging, we update the flagged_reason field
        const flagUpdate = action === 'flag'
          ? { flagged_reason: reason || 'Flagged by moderator' }
          : { flagged_reason: null };

        const { error: flagError } = await supabase
          .from(tableName)
          .update(flagUpdate)
          .eq('id', contentId);

        if (flagError) throw flagError;

        await logAuditEvent(
          createModerationActionEvent(action, contentType, contentId, user.id, profile.role, reason)
        );

        return NextResponse.json({
          success: true,
          message: `${contentType} ${action === 'flag' ? 'flagged' : 'unflagged'} successfully`,
        });
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update status
    const updateData: Record<string, unknown> = { status: newStatus };

    // Add moderation note if provided
    if (note) {
      updateData.moderation_note = note;
      updateData.moderated_by = user.id;
      updateData.moderated_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', contentId);

    if (error) throw error;

    // Log the moderation action
    await logAuditEvent(
      createModerationActionEvent(action, contentType, contentId, user.id, profile.role, reason)
    );

    return NextResponse.json({
      success: true,
      message: `${contentType} ${action}d successfully`,
    });
  } catch (error) {
    console.error('Error performing moderation action:', error);
    return NextResponse.json(
      { error: 'Failed to perform moderation action' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/moderation (Bulk actions)
 * Perform moderation action on multiple items
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin access (bulk actions require admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required for bulk actions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, items } = body;

    // Validate
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (items.length > 50) {
      return NextResponse.json({ error: 'Maximum 50 items per bulk action' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const results = { success: 0, failed: 0 };

    // Group items by content type
    const shopIds = items.filter(i => i.type === 'shop').map(i => i.id);
    const reviewIds = items.filter(i => i.type === 'review').map(i => i.id);

    // Update shops
    if (shopIds.length > 0) {
      const { error } = await supabase
        .from('shops')
        .update({
          status: newStatus,
          moderated_by: user.id,
          moderated_at: new Date().toISOString(),
        })
        .in('id', shopIds);

      if (error) {
        results.failed += shopIds.length;
      } else {
        results.success += shopIds.length;

        // Log each action
        for (const id of shopIds) {
          await logAuditEvent(
            createModerationActionEvent(action, 'shop', id, user.id, profile.role)
          );
        }
      }
    }

    // Update reviews
    if (reviewIds.length > 0) {
      const { error } = await supabase
        .from('reviews')
        .update({
          status: newStatus,
          moderated_by: user.id,
          moderated_at: new Date().toISOString(),
        })
        .in('id', reviewIds);

      if (error) {
        results.failed += reviewIds.length;
      } else {
        results.success += reviewIds.length;

        // Log each action
        for (const id of reviewIds) {
          await logAuditEvent(
            createModerationActionEvent(action, 'review', id, user.id, profile.role)
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${action === 'approve' ? 'Approved' : 'Rejected'} ${results.success} items`,
      results,
    });
  } catch (error) {
    console.error('Error performing bulk moderation action:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk moderation action' },
      { status: 500 }
    );
  }
}
