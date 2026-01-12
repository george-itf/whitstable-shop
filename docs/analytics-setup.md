# Analytics Setup Guide

This document describes the analytics setup for whitstable.shop, using privacy-focused analytics that don't require cookie consent banners.

## Recommended: Plausible Analytics

[Plausible](https://plausible.io) is a lightweight, privacy-friendly analytics tool. It's GDPR-compliant by design and doesn't use cookies.

### Why Plausible?

- **Privacy-first**: No cookies, no personal data collection
- **GDPR compliant**: No consent banner required
- **Lightweight**: <1KB script (vs 45KB+ for GA4)
- **Simple**: Clean, easy-to-understand dashboard
- **Open source**: Can self-host if needed

### Setup Steps

1. **Create Account**
   - Sign up at https://plausible.io
   - Add your site: `whitstable.shop`

2. **Add Environment Variable**
   ```bash
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=whitstable.shop
   ```

3. **Add Script to Layout**
   The analytics script is automatically loaded via the `lib/analytics.ts` module.

   ```tsx
   // app/layout.tsx
   import Script from 'next/script';

   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           <Script
             defer
             data-domain="whitstable.shop"
             src="https://plausible.io/js/script.js"
           />
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

### Pricing

- **Free trial**: 30 days
- **Paid**: From $9/month for up to 10K monthly pageviews
- **Self-hosted**: Free (requires server)

---

## Alternative: Umami Analytics

[Umami](https://umami.is) is another excellent privacy-focused option, especially if you want to self-host.

### Setup Steps

1. **Create Account or Self-Host**
   - Cloud: https://cloud.umami.is
   - Self-host: https://github.com/umami-software/umami

2. **Add Environment Variables**
   ```bash
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
   NEXT_PUBLIC_UMAMI_URL=https://analytics.umami.is  # or your self-hosted URL
   ```

3. **Script Auto-Loads**
   The `lib/analytics.ts` module handles script loading automatically.

### Pricing

- **Cloud**: Free for up to 10K events/month, then from $9/month
- **Self-hosted**: Free

---

## What We Track

### Automatic Metrics

Both Plausible and Umami automatically track:

- **Page views**: Which pages are visited
- **Unique visitors**: Using privacy-safe fingerprinting
- **Referral sources**: Where traffic comes from
- **Geographic data**: Country/region level (not precise location)
- **Device data**: Browser, OS, device type
- **Time on site**: Session duration

### Custom Events

We track these custom events via `lib/analytics.ts`:

| Event | Properties | Description |
|-------|------------|-------------|
| `shop_view` | `shop_slug`, `category` | User views a shop page |
| `shop_save` | `shop_slug` | User saves a shop |
| `shop_unsave` | `shop_slug` | User unsaves a shop |
| `review_submit` | `shop_slug`, `rating` | User submits a review |
| `search` | `query`, `results_count` | User performs a search |
| `map_open` | - | User opens the map |
| `map_marker_click` | `shop_slug` | User clicks a map marker |
| `directions_click` | `shop_slug` | User clicks for directions |
| `call_click` | `shop_slug` | User clicks to call |
| `event_view` | `event_id` | User views an event page |
| `signup` | `source` | User creates an account |
| `login` | - | User logs in |

### Usage Example

```tsx
import { trackShopView, trackSearch } from '@/lib/analytics';

// Track shop view
function ShopPage({ shop }) {
  useEffect(() => {
    trackShopView(shop.slug, shop.category);
  }, [shop.slug, shop.category]);
}

// Track search
function SearchResults({ query, results }) {
  useEffect(() => {
    trackSearch(query, results.length);
  }, [query, results.length]);
}
```

---

## Conversion Funnels

Key funnels to monitor for business health:

### 1. Visitor → Engaged

Measures visitor engagement depth.

```
Homepage → Shop Page → Second Shop Page
Target: 30% reach step 2, 10% reach step 3
```

### 2. Visitor → Saver

Measures save feature adoption.

```
Shop Page → Save Click → Signup → Save Complete
Target: 5% conversion
```

### 3. Visitor → Reviewer

Measures review contribution.

```
Shop Page → Write Review → Submit → Published
Target: 2% conversion
```

### 4. Shop Owner → Claimed

Measures business engagement.

```
Shop Page → Claim Click → Signup → Claim Request → Approved
Target: 20% of shop owners claim within 3 months
```

---

## Dashboard Metrics

### Daily Checks

- Unique visitors
- Top pages
- Referral sources
- Any unusual traffic patterns

### Weekly Checks

- Week-over-week visitor growth
- Top search queries
- Map engagement
- Save/review activity

### Monthly Checks

- Overall traffic trends
- Geographic breakdown
- Device/browser stats
- Goal completions

---

## Privacy Compliance

### Why No Cookie Banner?

Both Plausible and Umami:

1. **Don't use cookies** for tracking
2. **Don't collect personal data** (no IP storage, no fingerprinting for identity)
3. **Don't track across sites**
4. **Are GDPR, PECR, and CCPA compliant** by design

This means we can track basic analytics without:
- Cookie consent banners
- Complex consent management
- User opt-out mechanisms (though still recommended)

### Data Processing Agreement

If using Plausible Cloud or Umami Cloud, ensure you have:
- [ ] Signed DPA (Data Processing Agreement)
- [ ] Reviewed their privacy policy
- [ ] Listed them in your privacy policy

---

## Integration Checklist

- [ ] Create analytics account (Plausible or Umami)
- [ ] Add environment variables
- [ ] Verify script loads on production
- [ ] Test custom event tracking
- [ ] Set up any custom goals
- [ ] Update privacy policy to mention analytics provider
- [ ] Train team on dashboard usage
- [ ] Set up weekly reporting routine

---

## Resources

- [Plausible Documentation](https://plausible.io/docs)
- [Umami Documentation](https://umami.is/docs)
- [Our Analytics Library](/lib/analytics.ts)
