# Referral Program Specification

## Overview

A referral program that incentivises shop owners to promote their whitstable.shop listing, creating a viral growth loop.

**Status**: Future Feature (v2.0+)
**Priority**: Medium
**Estimated Development**: 2-3 weeks

---

## Core Concept

Every claimed shop gets a unique referral link. When visitors arrive via that link, the shop owner sees:
- How many people they've brought to the site
- Their ranking among other shops
- Recognition badges on their profile

**Key Insight**: Shop owners naturally want to promote their business. Give them tools and recognition for driving traffic.

---

## User Stories

### As a Shop Owner

1. I can copy my unique referral link from my dashboard
2. I can share this link on social media, my website, or in-store
3. I can see how many visitors I've referred
4. I earn badges for referral milestones
5. I appear on a public leaderboard (opt-in)

### As a Visitor

1. I can discover whitstable.shop through a shop's promotion
2. I see which shop referred me (optional welcome message)
3. I can explore other shops after landing

---

## Technical Implementation

### Referral Link Structure

```
https://whitstable.shop/shop/[shop-slug]?ref=[shop-id]
OR
https://whitstable.shop/r/[shop-id] (short URL redirect)
```

### Database Schema

```sql
-- Track referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id),
  visitor_id TEXT, -- Anonymous fingerprint or user_id
  source_url TEXT,
  landing_page TEXT,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Referral stats (materialized for performance)
CREATE TABLE referral_stats (
  shop_id UUID PRIMARY KEY REFERENCES shops(id),
  total_referrals INTEGER DEFAULT 0,
  this_month INTEGER DEFAULT 0,
  best_month INTEGER DEFAULT 0,
  badge_level TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Referral Tracking Flow

1. Visitor clicks referral link
2. Server logs referral with shop_id, timestamp, source
3. Set cookie/localStorage to attribute future actions
4. Update real-time count for shop owner
5. Calculate badge eligibility daily

---

## Badge System

### Referral Badges

| Badge | Requirement | Display |
|-------|-------------|---------|
| Community Starter | 10+ referrals | Bronze badge |
| Local Promoter | 50+ referrals | Silver badge |
| Whitstable Champion | 100+ referrals | Gold badge |
| Legendary Local | 250+ referrals | Platinum badge |

### Badge Display

- Shown on shop's public listing
- Shown on shop owner's profile
- Included in search results (visual flair)

---

## Leaderboard

### Monthly Leaderboard

Public leaderboard showing top referring shops:

```
🏆 Most Recommended This Month

1. 🥇 The Cheese Box - 47 referrals
2. 🥈 Oxford Street Books - 34 referrals
3. 🥉 Harbour Coffee - 28 referrals
4. Whitstable Oyster Co - 25 referrals
5. The Gallivant - 22 referrals
```

**Features**:
- Updates daily
- Opt-in only (some may not want ranking)
- Reset monthly to keep competition fresh
- Archive shows all-time leaders

### Social Proof Widget

Badge that shops can embed on their website:

```html
<a href="https://whitstable.shop/shop/the-cheese-box">
  <img src="https://whitstable.shop/badge/the-cheese-box.svg"
       alt="Recommended by 127 people on whitstable.shop" />
</a>
```

---

## Shop Owner Dashboard

### Referral Stats Section

```
📊 Your Referrals

Total All-Time: 127 people
This Month: 23 people
Your Rank: #4 in Whitstable

🏅 Badge: Local Promoter (50+ referrals)
   Next: Whitstable Champion at 100

[Copy Referral Link] [View Full Stats]
```

### Detailed Stats View

- Daily referral chart
- Referral sources breakdown
- Peak referral times
- Conversion to saves/reviews

---

## Promotional Materials

### For Shop Owners to Use

**Social Media Templates**:

> "Find us on whitstable.shop - your guide to independent Whitstable! 🏪
> [link]"

> "We're proud to be listed on whitstable.shop. Discover our reviews and more independent shops!
> [link]"

**In-Store Materials**:
- QR code linking to their listing
- "Find us on whitstable.shop" window sticker
- Table tent with QR code

**Website Embed**:
```html
<!-- whitstable.shop badge -->
<a href="https://whitstable.shop/shop/your-shop">
  <img src="/badge.svg" alt="Find us on whitstable.shop" />
</a>
```

---

## Anti-Gaming Measures

To prevent manipulation:

1. **Unique visitor counting**: Based on fingerprint, not raw visits
2. **Rate limiting**: Max referrals from single IP per day
3. **Bot detection**: Block obvious automated traffic
4. **Manual review**: Flag suspicious patterns for review
5. **No monetary incentive**: Recognition only, no payments

---

## Success Metrics

### Launch Goals (First 3 Months)

- 50% of claimed shops use referral link at least once
- 500 total referred visitors
- 5 shops reach "Community Starter" badge
- Positive shop owner feedback

### Ongoing Metrics

- Referral link usage rate
- Referred visitor behaviour (vs. organic)
- Badge progression rate
- Leaderboard engagement

---

## Future Enhancements

1. **Team referrals**: Staff members get individual links
2. **Campaign tracking**: UTM parameter integration
3. **Referral rewards**: Occasional promotional benefits
4. **Cross-promotion**: "Shops you might like" from same referrer
5. **Analytics API**: Let shop owners pull data into their systems

---

## Implementation Phases

### Phase 1: Basic Tracking
- Generate referral links
- Track referral visits
- Display count to shop owners

### Phase 2: Recognition
- Badge system
- Public leaderboard
- Dashboard improvements

### Phase 3: Growth Tools
- Embeddable badges
- Social sharing tools
- Promotional materials

---

*This feature specification will be refined based on shop owner feedback and early adoption patterns.*
