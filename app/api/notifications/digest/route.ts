import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, sendBatchEmails } from '@/lib/email';
import { weeklyDigestTemplate, DigestData } from '@/lib/email/templates';

/**
 * POST /api/notifications/digest
 * Send weekly digest emails to subscribed users
 *
 * This endpoint should be called by a cron job (e.g., Vercel Cron, pg_cron)
 * every Monday morning.
 *
 * Query params:
 * - test: If "true", only sends to admin emails and doesn't mark as sent
 * - email: Specific email to test with (requires test=true)
 *
 * Headers:
 * - Authorization: Bearer <CRON_SECRET> (required in production)
 */
export async function POST(request: Request) {
  try {
    // Verify cron secret in production
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const isTest = searchParams.get('test') === 'true';
    const testEmail = searchParams.get('email');

    const supabase = await createClient();

    // Gather digest data
    const digestData = await gatherDigestData(supabase);

    // Get subscribers
    let subscribers;

    if (isTest && testEmail) {
      // Test mode with specific email
      subscribers = [{
        email: testEmail,
        name: 'Test User',
        id: 'test-user-id'
      }];
    } else if (isTest) {
      // Test mode - send to admins only
      const { data: admins } = await supabase
        .from('profiles')
        .select('id, email, display_name')
        .eq('is_admin', true);

      subscribers = (admins || []).map((a: { id: string; email: string; display_name: string | null }) => ({
        id: a.id,
        email: a.email,
        name: a.display_name || 'Admin'
      }));
    } else {
      // Production mode - get all subscribed users
      subscribers = await getDigestSubscribers(supabase);
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: 'No subscribers to send to',
        test: isTest
      });
    }

    // Prepare emails
    type Subscriber = { id: string; email: string; name: string };
    const emails = subscribers.map((subscriber: Subscriber) => {
      const personalizedData: DigestData = {
        ...digestData,
        userName: subscriber.name || 'Local',
      };
      const { html, text } = weeklyDigestTemplate(personalizedData);

      return {
        to: subscriber.email,
        subject: `🦪 Your Whitstable Weekly - ${formatDate(new Date())}`,
        html,
        text,
      };
    });

    // Send emails
    const results = await sendBatchEmails(emails);

    // Log digest send (unless test mode)
    if (!isTest) {
      await supabase.from('digest_logs').insert({
        sent_at: new Date().toISOString(),
        recipient_count: results.sent,
        failed_count: results.failed,
      });
    }

    return NextResponse.json({
      message: 'Weekly digest sent',
      test: isTest,
      sent: results.sent,
      failed: results.failed,
      recipientCount: subscribers.length,
    });
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json(
      { error: 'Failed to send digest' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/digest
 * Preview the digest content (for admins)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Gather and return digest data
    const digestData = await gatherDigestData(supabase);
    const { html, text } = weeklyDigestTemplate({
      ...digestData,
      userName: 'Preview User',
    });

    return NextResponse.json({
      data: digestData,
      preview: {
        html,
        text,
      },
    });
  } catch (error) {
    console.error('Digest preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

/**
 * Gather all data needed for the weekly digest
 */
async function gatherDigestData(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Omit<DigestData, 'userName'>> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date();

  // Get trending shops
  const { data: trendingShops } = await supabase
    .from('shops')
    .select('name, tagline, slug, save_count')
    .eq('status', 'approved')
    .order('save_count', { ascending: false })
    .limit(5);

  // Get upcoming events (next 14 days)
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('title, start_date, slug')
    .gte('start_date', now.toISOString())
    .lte('start_date', fourteenDaysFromNow)
    .order('start_date', { ascending: true })
    .limit(5);

  // Get recent reviews
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select(`
      rating,
      content,
      shop:shops(name)
    `)
    .eq('status', 'approved')
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get top question
  const { data: topQuestion } = await supabase
    .from('questions')
    .select('id, question, answer_count')
    .gte('created_at', sevenDaysAgo)
    .order('answer_count', { ascending: false })
    .limit(1)
    .single();

  // Get weekly stats
  const { count: newShopsCount } = await supabase
    .from('shops')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo);

  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('start_date', now.toISOString())
    .lte('start_date', fourteenDaysFromNow);

  const { count: photoCount } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo);

  return {
    trendingShops: (trendingShops || []).map((shop: { name: string; tagline: string | null; slug: string }) => ({
      name: shop.name,
      tagline: shop.tagline || 'Local Whitstable business',
      slug: shop.slug,
    })),
    upcomingEvents: (upcomingEvents || []).map((event: { title: string; start_date: string; slug: string }) => ({
      title: event.title,
      date: formatEventDate(event.start_date),
      slug: event.slug,
    })),
    newReviews: (recentReviews || []).map((review: { shop: unknown; rating: number; content: string | null }) => ({
      shopName: (review.shop as { name: string })?.name || 'Unknown Shop',
      rating: review.rating,
      excerpt: truncateText(review.content || '', 100),
    })),
    topQuestion: topQuestion ? {
      question: topQuestion.question,
      answerCount: topQuestion.answer_count || 0,
      id: topQuestion.id,
    } : undefined,
    weeklyStats: {
      newShops: newShopsCount || 0,
      totalEvents: eventCount || 0,
      photosSubmitted: photoCount || 0,
    },
  };
}

/**
 * Get users subscribed to the weekly digest
 */
async function getDigestSubscribers(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Array<{ id: string; email: string; name: string }>> {
  // Check if notification_preferences table exists
  const { data: preferences, error } = await supabase
    .from('notification_preferences')
    .select('user_id, profiles(email, display_name)')
    .eq('weekly_digest', true);

  if (error) {
    // Table might not exist yet - fall back to all verified users
    console.log('notification_preferences table not found, using fallback');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('email_verified', true)
      .limit(100); // Safety limit

    return (profiles || []).map((p: { id: string; email: string; display_name: string | null }) => ({
      id: p.id,
      email: p.email,
      name: p.display_name || 'Local',
    }));
  }

  return (preferences || []).map((p: { user_id: string; profiles: unknown }) => {
    const profile = p.profiles as { email: string; display_name: string } | null;
    return {
      id: p.user_id,
      email: profile?.email || '',
      name: profile?.display_name || 'Local',
    };
  }).filter((p: { id: string; email: string; name: string }) => p.email);
}

/**
 * Format date for email subject
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Format event date for display
 */
function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Truncate text to specified length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
