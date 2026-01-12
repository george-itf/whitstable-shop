# Metrics Dashboard Specification

Technical specification for the admin/analytics dashboard to track platform health and growth.

---

## Overview

A simple, internal dashboard for monitoring whitstable.shop's key metrics. Initially manual/SQL-based, with potential for automated dashboard in future.

---

## Health Metrics (Weekly)

Track the fundamental health of the platform.

### 1. Total Approved Shops

```sql
SELECT COUNT(*) as total_shops
FROM shops
WHERE status = 'approved';
```

**Target**: 80+ at launch, growing steadily

---

### 2. Total Registered Users

```sql
SELECT COUNT(*) as total_users
FROM users
WHERE email_confirmed = true;
```

**Target**: 100+ by Month 3

---

### 3. Total Reviews

```sql
SELECT COUNT(*) as total_reviews
FROM reviews
WHERE status = 'published';
```

**Target**: 50+ by Month 3

---

### 4. Active Users (7-day)

```sql
SELECT COUNT(DISTINCT user_id) as active_users
FROM user_activity
WHERE created_at > NOW() - INTERVAL '7 days';
```

**Target**: 30% of registered users

---

## Growth Metrics (Weekly)

Track week-over-week growth.

### 5. New Shops Added

```sql
SELECT COUNT(*) as new_shops
FROM shops
WHERE created_at > NOW() - INTERVAL '7 days'
AND status = 'approved';
```

---

### 6. New Users Signed Up

```sql
SELECT COUNT(*) as new_users
FROM users
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

### 7. New Reviews Submitted

```sql
SELECT COUNT(*) as new_reviews
FROM reviews
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

### 8. Shops Claimed

```sql
SELECT COUNT(*) as claimed_shops
FROM shops
WHERE claimed_at IS NOT NULL
AND claimed_at > NOW() - INTERVAL '7 days';
```

---

## Engagement Metrics (Weekly)

Track how users interact with the platform.

### 9. Page Views

*From analytics (Plausible/Umami)*

**Track**:
- Total page views
- Unique visitors
- Pages per session
- Average session duration

---

### 10. Saves

```sql
-- Total saves
SELECT COUNT(*) as total_saves
FROM saved_shops;

-- Saves this week
SELECT COUNT(*) as new_saves
FROM saved_shops
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

### 11. Map Opens

*From custom event tracking*

```sql
SELECT COUNT(*) as map_opens
FROM analytics_events
WHERE event_name = 'map_open'
AND created_at > NOW() - INTERVAL '7 days';
```

---

### 12. Search Queries

```sql
SELECT
  query,
  COUNT(*) as search_count
FROM search_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY search_count DESC
LIMIT 20;
```

---

## Quality Metrics (Monthly)

Track content quality and platform health.

### 13. Reviews Per Shop (Average)

```sql
SELECT
  AVG(review_count) as avg_reviews_per_shop
FROM (
  SELECT shop_id, COUNT(*) as review_count
  FROM reviews
  WHERE status = 'published'
  GROUP BY shop_id
) shop_reviews;
```

---

### 14. Shops with Zero Reviews

```sql
SELECT COUNT(*) as shops_without_reviews
FROM shops s
LEFT JOIN reviews r ON s.id = r.shop_id AND r.status = 'published'
WHERE s.status = 'approved'
AND r.id IS NULL;
```

**Target**: <30% of shops

---

### 15. Claim Response Rate

```sql
SELECT
  COUNT(CASE WHEN responded_at IS NOT NULL THEN 1 END)::float /
  COUNT(*)::float * 100 as response_rate
FROM claim_requests
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

### 16. Time to Approve Shops

```sql
SELECT
  AVG(EXTRACT(EPOCH FROM (approved_at - created_at)) / 3600) as avg_hours_to_approve
FROM shops
WHERE approved_at IS NOT NULL
AND created_at > NOW() - INTERVAL '30 days';
```

**Target**: <24 hours average

---

## Month 1 Targets

| Metric | Target |
|--------|--------|
| Approved shops | 80+ |
| Unique visitors | 500+ |
| Registered users | 50+ |
| Total saves | 100+ |
| Total reviews | 50+ |
| Claimed shops | 10+ |

---

## Dashboard Views

### 1. Overview Dashboard

Key numbers at a glance:
- Total shops
- Total users
- Total reviews
- Visitors (7-day)
- Saves (total)

### 2. Growth Dashboard

Week-over-week trends:
- New shops (trend line)
- New users (trend line)
- New reviews (trend line)
- Page views (trend line)

### 3. Content Dashboard

Content health:
- Shops by category
- Reviews by rating distribution
- Shops needing reviews
- Pending claims

### 4. Engagement Dashboard

User engagement:
- Top viewed shops
- Most saved shops
- Most searched terms
- Map interactions

---

## Alert Thresholds

Set up alerts for:

| Metric | Alert When |
|--------|------------|
| Daily visitors | <50 for 3+ days |
| New reviews | 0 for 7+ days |
| Error rate | >1% |
| Page load time | >3s average |
| Claim queue | >5 pending for 48+ hours |

---

## Data Sources

### Primary: Supabase

- User data
- Shop data
- Reviews
- Saves
- Claims

### Secondary: Analytics (Plausible/Umami)

- Page views
- Visitors
- Geographic data
- Device data
- Referrers

### Tertiary: Custom Events

- Map opens
- Search queries
- Share clicks
- Call/direction clicks

---

## Implementation Phases

### Phase 1: Manual Tracking (Launch)

- Weekly spreadsheet with key metrics
- Manual SQL queries
- Basic analytics dashboard

### Phase 2: Basic Dashboard (Month 2-3)

- Simple admin page with metrics
- Auto-updating numbers
- Basic charts

### Phase 3: Full Dashboard (Month 6+)

- Real-time metrics
- Historical trends
- Alert system
- Export functionality

---

## SQL Query Collection

### Weekly Report Query

```sql
WITH metrics AS (
  SELECT
    (SELECT COUNT(*) FROM shops WHERE status = 'approved') as total_shops,
    (SELECT COUNT(*) FROM users WHERE email_confirmed = true) as total_users,
    (SELECT COUNT(*) FROM reviews WHERE status = 'published') as total_reviews,
    (SELECT COUNT(*) FROM saved_shops) as total_saves,
    (SELECT COUNT(*) FROM shops WHERE claimed_at IS NOT NULL) as claimed_shops,
    (SELECT COUNT(*) FROM shops WHERE created_at > NOW() - INTERVAL '7 days' AND status = 'approved') as new_shops_7d,
    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_7d,
    (SELECT COUNT(*) FROM reviews WHERE created_at > NOW() - INTERVAL '7 days' AND status = 'published') as new_reviews_7d
)
SELECT * FROM metrics;
```

### Shop Coverage Query

```sql
SELECT
  c.name as category,
  COUNT(s.id) as shop_count,
  COUNT(CASE WHEN s.claimed_at IS NOT NULL THEN 1 END) as claimed_count,
  ROUND(AVG(COALESCE(r.rating, 0)), 2) as avg_rating
FROM categories c
LEFT JOIN shops s ON c.id = s.category_id AND s.status = 'approved'
LEFT JOIN reviews r ON s.id = r.shop_id AND r.status = 'published'
GROUP BY c.id, c.name
ORDER BY shop_count DESC;
```

---

## Tools

### Recommended

- **Metabase**: Free, self-hosted BI tool
- **Supabase Dashboard**: Built-in for basic queries
- **Spreadsheets**: Manual tracking initially
- **Vercel Analytics**: Free performance metrics

### Future Consideration

- **Grafana**: Advanced dashboards
- **Custom Admin Panel**: Built into app

---

*Start simple with weekly manual tracking, then automate as the platform grows.*
