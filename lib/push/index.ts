/**
 * Web Push Notification Service
 *
 * Handles sending push notifications via the Web Push protocol.
 *
 * Setup:
 * 1. Generate VAPID keys: npx web-push generate-vapid-keys
 * 2. Set in .env:
 *    - NEXT_PUBLIC_VAPID_PUBLIC_KEY
 *    - VAPID_PRIVATE_KEY
 *    - VAPID_EMAIL (contact email for push service)
 */

export interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth_key: string;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  vibrate?: number[];
}

export interface PushResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

/**
 * Send a push notification to a single subscription
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<PushResult> {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_EMAIL || 'hello@whitstable.shop';

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.log('📱 Push notification would be sent (no VAPID keys configured):');
    console.log(`   Title: ${payload.title}`);
    console.log(`   Body: ${payload.body}`);
    return {
      success: true, // Dev mode - pretend success
      statusCode: 200,
    };
  }

  try {
    // Import web-push dynamically (it's a server-only package)
    const webpush = await import('web-push');

    webpush.setVapidDetails(
      `mailto:${vapidEmail}`,
      vapidPublicKey,
      vapidPrivateKey
    );

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth_key,
      },
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );

    return {
      success: true,
      statusCode: 201,
    };
  } catch (error) {
    const pushError = error as { statusCode?: number; message?: string };

    // Handle common errors
    if (pushError.statusCode === 410 || pushError.statusCode === 404) {
      // Subscription expired or invalid - should be removed
      return {
        success: false,
        statusCode: pushError.statusCode,
        error: 'Subscription expired',
      };
    }

    console.error('Push notification error:', error);
    return {
      success: false,
      statusCode: pushError.statusCode,
      error: pushError.message || 'Unknown error',
    };
  }
}

/**
 * Send push notifications to multiple subscriptions
 */
export async function sendBatchPushNotifications(
  subscriptions: PushSubscription[],
  payload: PushPayload
): Promise<{
  sent: number;
  failed: number;
  expired: string[]; // Endpoints to remove
}> {
  let sent = 0;
  let failed = 0;
  const expired: string[] = [];

  // Process in parallel with concurrency limit
  const batchSize = 10;
  for (let i = 0; i < subscriptions.length; i += batchSize) {
    const batch = subscriptions.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (sub) => {
        const result = await sendPushNotification(sub, payload);
        return { subscription: sub, result };
      })
    );

    for (const { subscription, result } of results) {
      if (result.success) {
        sent++;
      } else {
        failed++;
        if (result.error === 'Subscription expired') {
          expired.push(subscription.endpoint);
        }
      }
    }
  }

  return { sent, failed, expired };
}

/**
 * Create notification payloads for common scenarios
 */
export const notificationPayloads = {
  newEvent: (eventTitle: string, eventSlug: string): PushPayload => ({
    title: '📅 New Event in Whitstable',
    body: eventTitle,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: `event-${eventSlug}`,
    data: {
      url: `/events/${eventSlug}`,
      type: 'event',
    },
    actions: [
      { action: 'view', title: 'View Event' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }),

  newOffer: (shopName: string, offerTitle: string, shopSlug: string): PushPayload => ({
    title: `🏷️ New Deal at ${shopName}`,
    body: offerTitle,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: `offer-${shopSlug}`,
    data: {
      url: `/shops/${shopSlug}`,
      type: 'offer',
    },
    actions: [
      { action: 'view', title: 'View Deal' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }),

  trendingAlert: (itemName: string, itemType: string, itemSlug: string): PushPayload => ({
    title: '🔥 Trending in Whitstable',
    body: `${itemName} is trending right now!`,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: `trending-${itemSlug}`,
    data: {
      url: itemType === 'shop' ? `/shops/${itemSlug}` : `/trending`,
      type: 'trending',
    },
  }),

  newAnswer: (questionExcerpt: string, questionId: string): PushPayload => ({
    title: '💬 New Answer to Your Question',
    body: questionExcerpt,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: `answer-${questionId}`,
    data: {
      url: `/ask/${questionId}`,
      type: 'answer',
    },
    requireInteraction: true,
  }),

  newReview: (shopName: string, rating: number, shopSlug: string): PushPayload => ({
    title: `⭐ New Review for ${shopName}`,
    body: `Someone left a ${rating}-star review!`,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: `review-${shopSlug}`,
    data: {
      url: `/dashboard`,
      type: 'review',
    },
    requireInteraction: true,
  }),
};
