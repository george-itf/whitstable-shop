/**
 * Email Templates
 *
 * Reusable HTML email templates for the platform
 */

// Base wrapper for all emails
function baseTemplate(content: string, previewText?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Whitstable.shop</title>
  ${previewText ? `<meta name="x-apple-disable-message-reformatting"><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><span style="display:none;font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;mso-hide:all;">${previewText}</span>` : ''}
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0;
      font-size: 14px;
    }
    .content {
      padding: 32px 24px;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #0284c7;
    }
    .card {
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .card-title {
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 4px;
    }
    .card-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
    .button {
      display: inline-block;
      background-color: #0284c7;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }
    .button:hover {
      background-color: #0369a1;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #0284c7;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 24px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>
        <a href="https://whitstable.shop">Whitstable.shop</a> - Your local community hub
      </p>
      <p>
        <a href="https://whitstable.shop/settings/notifications">Manage notification preferences</a>
      </p>
      <p style="margin-top: 16px;">
        Whitstable, Kent, UK 🦪
      </p>
    </div>
  </div>
</body>
</html>
`;
}

// Weekly Digest Email
export interface DigestData {
  userName: string;
  trendingShops: Array<{ name: string; tagline: string; slug: string }>;
  upcomingEvents: Array<{ title: string; date: string; slug: string }>;
  newReviews: Array<{ shopName: string; rating: number; excerpt: string }>;
  topQuestion?: { question: string; answerCount: number; id: string };
  weeklyStats?: { newShops: number; totalEvents: number; photosSubmitted: number };
}

export function weeklyDigestTemplate(data: DigestData): { html: string; text: string } {
  const { userName, trendingShops, upcomingEvents, newReviews, topQuestion, weeklyStats } = data;

  const shopCards = trendingShops.slice(0, 3).map(shop => `
    <div class="card">
      <p class="card-title">${shop.name}</p>
      <p class="card-subtitle">${shop.tagline}</p>
    </div>
  `).join('');

  const eventCards = upcomingEvents.slice(0, 3).map(event => `
    <div class="card">
      <p class="card-title">${event.title}</p>
      <p class="card-subtitle">${event.date}</p>
    </div>
  `).join('');

  const reviewCards = newReviews.slice(0, 2).map(review => `
    <div class="card">
      <p class="card-title">${review.shopName} ${'⭐'.repeat(review.rating)}</p>
      <p class="card-subtitle">"${review.excerpt}"</p>
    </div>
  `).join('');

  const html = baseTemplate(`
    <div class="header">
      <h1>Whitstable.shop</h1>
      <p>Your weekly update</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 24px;">
        Hi ${userName} 👋
      </p>
      <p style="margin-bottom: 32px;">
        Here's what's been happening in Whitstable this week:
      </p>

      ${trendingShops.length > 0 ? `
        <div class="section">
          <h2 class="section-title">🔥 Trending This Week</h2>
          ${shopCards}
          <a href="https://whitstable.shop/trending" class="button" style="margin-top: 8px;">See all trending</a>
        </div>
      ` : ''}

      ${upcomingEvents.length > 0 ? `
        <div class="section">
          <h2 class="section-title">📅 Upcoming Events</h2>
          ${eventCards}
          <a href="https://whitstable.shop/events" class="button" style="margin-top: 8px;">View all events</a>
        </div>
      ` : ''}

      ${newReviews.length > 0 ? `
        <div class="section">
          <h2 class="section-title">⭐ Recent Reviews</h2>
          ${reviewCards}
        </div>
      ` : ''}

      ${topQuestion ? `
        <div class="section">
          <h2 class="section-title">❓ Hot Question</h2>
          <div class="card">
            <p class="card-title">${topQuestion.question}</p>
            <p class="card-subtitle">${topQuestion.answerCount} answers</p>
          </div>
          <a href="https://whitstable.shop/ask?question=${topQuestion.id}" class="button" style="margin-top: 8px;">Join the discussion</a>
        </div>
      ` : ''}

      ${weeklyStats ? `
        <div class="divider"></div>
        <div style="text-align: center; color: #64748b; font-size: 14px;">
          <p><strong>This week in numbers:</strong></p>
          <p>${weeklyStats.newShops} new shops • ${weeklyStats.totalEvents} events • ${weeklyStats.photosSubmitted} photos shared</p>
        </div>
      ` : ''}
    </div>
  `, `Your weekly Whitstable update - trending shops, events, and community news`);

  // Plain text version
  const text = `
Hi ${userName},

Here's what's been happening in Whitstable this week:

${trendingShops.length > 0 ? `TRENDING THIS WEEK
${trendingShops.map(s => `- ${s.name}: ${s.tagline}`).join('\n')}
` : ''}
${upcomingEvents.length > 0 ? `UPCOMING EVENTS
${upcomingEvents.map(e => `- ${e.title} (${e.date})`).join('\n')}
` : ''}
${newReviews.length > 0 ? `RECENT REVIEWS
${newReviews.map(r => `- ${r.shopName}: "${r.excerpt}"`).join('\n')}
` : ''}

Visit https://whitstable.shop for more!

---
Whitstable.shop - Your local community hub
Manage preferences: https://whitstable.shop/settings/notifications
  `.trim();

  return { html, text };
}

// Welcome Email
export function welcomeEmailTemplate(userName: string): { html: string; text: string } {
  const html = baseTemplate(`
    <div class="header">
      <h1>Welcome to Whitstable.shop! 🦪</h1>
    </div>
    <div class="content">
      <p style="font-size: 18px; margin-bottom: 24px;">
        Hi ${userName},
      </p>
      <p style="margin-bottom: 24px;">
        Welcome to Whitstable's community hub! We're thrilled to have you join our local community.
      </p>

      <div class="section">
        <h2 class="section-title">🎯 Get Started</h2>
        <div class="card">
          <p class="card-title">Discover Local Shops</p>
          <p class="card-subtitle">Browse 100+ independent businesses in Whitstable</p>
        </div>
        <div class="card">
          <p class="card-title">Save Your Favourites</p>
          <p class="card-subtitle">Tap the heart to save shops you love</p>
        </div>
        <div class="card">
          <p class="card-title">Share Your Experience</p>
          <p class="card-subtitle">Write reviews and help the community</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="https://whitstable.shop/shops" class="button">Start Exploring</a>
      </div>
    </div>
  `, `Welcome to Whitstable.shop! Start exploring local shops and events.`);

  const text = `
Hi ${userName},

Welcome to Whitstable.shop! 🦪

We're thrilled to have you join our local community.

GET STARTED:
- Discover 100+ local shops
- Save your favourites
- Share reviews to help others

Start exploring: https://whitstable.shop/shops

---
Whitstable.shop - Your local community hub
  `.trim();

  return { html, text };
}

// New Review Notification (for shop owners)
export function newReviewNotificationTemplate(
  ownerName: string,
  shopName: string,
  rating: number,
  reviewText: string,
  shopSlug: string
): { html: string; text: string } {
  const html = baseTemplate(`
    <div class="header">
      <h1>New Review for ${shopName}</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 24px;">
        Hi ${ownerName},
      </p>
      <p style="margin-bottom: 24px;">
        Great news! Someone just left a review for <strong>${shopName}</strong>.
      </p>

      <div class="card" style="border-left: 4px solid #0284c7;">
        <p style="font-size: 24px; margin: 0 0 8px;">${'⭐'.repeat(rating)}</p>
        <p style="font-style: italic; margin: 0;">"${reviewText}"</p>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="https://whitstable.shop/shops/${shopSlug}" class="button">View Review</a>
      </div>

      <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
        Tip: Responding to reviews shows customers you care and can boost your visibility on the platform.
      </p>
    </div>
  `, `New ${rating}-star review for ${shopName}`);

  const text = `
Hi ${ownerName},

Great news! Someone just left a review for ${shopName}.

Rating: ${'⭐'.repeat(rating)}
"${reviewText}"

View and respond: https://whitstable.shop/shops/${shopSlug}

---
Whitstable.shop
  `.trim();

  return { html, text };
}

// Event Reminder
export function eventReminderTemplate(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  eventSlug: string
): { html: string; text: string } {
  const html = baseTemplate(`
    <div class="header">
      <h1>Event Reminder 📅</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 24px;">
        Hi ${userName},
      </p>
      <p style="margin-bottom: 24px;">
        Just a friendly reminder about an upcoming event you might be interested in:
      </p>

      <div class="card" style="text-align: center;">
        <h3 style="margin: 0 0 8px; font-size: 20px;">${eventTitle}</h3>
        <p style="margin: 0; font-size: 16px; color: #0284c7;">${eventDate}</p>
        <p style="margin: 8px 0 0; color: #64748b;">${eventLocation}</p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://whitstable.shop/events/${eventSlug}" class="button">View Event Details</a>
      </div>
    </div>
  `, `Reminder: ${eventTitle} - ${eventDate}`);

  const text = `
Hi ${userName},

Reminder about an upcoming event:

${eventTitle}
${eventDate}
${eventLocation}

Details: https://whitstable.shop/events/${eventSlug}

---
Whitstable.shop
  `.trim();

  return { html, text };
}
