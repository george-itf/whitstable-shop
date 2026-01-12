# Review Growth Strategy

Reviews are critical for building trust and providing value to users. This document outlines strategies for generating authentic, high-quality reviews.

## Why Reviews Matter

1. **Social proof**: Users trust peer reviews over marketing
2. **SEO value**: Review content improves search rankings
3. **User engagement**: Review writers become invested users
4. **Shop owner value**: Feedback helps businesses improve
5. **Content generation**: User-generated content scales naturally

## Review Generation Strategies

### Strategy 1: Post-Save Prompts

**Trigger**: After a user saves their 3rd shop

**Message**:
> "Been to any of these places? Leave a quick review to help others discover great shops in Whitstable."

**Implementation**:
```tsx
// Check save count after each save
const saveCount = user.savedShops.length;
if (saveCount === 3 && !user.hasSeenReviewPrompt) {
  showReviewPrompt(user.savedShops);
  markPromptAsSeen(user.id);
}
```

**Expected conversion**: 5-10% of prompted users

---

### Strategy 2: Return Visitor Detection

**Trigger**: User returns to a shop page they viewed 3+ days ago

**Message**:
> "Welcome back! How was your visit to [Shop Name]? Share your experience to help others."

**Implementation**:
```tsx
// Track recently viewed shops in localStorage
const viewedShops = getRecentlyViewed();
const daysSinceView = getDaysSince(viewedShops[shopSlug]);

if (daysSinceView >= 3 && daysSinceView <= 14) {
  showReturnVisitorPrompt(shop);
}
```

**Expected conversion**: 3-5% of prompted users

---

### Strategy 3: Post-Event Prompts

**Trigger**: Day after a user viewed an event that has now passed

**Message**:
> "Did you make it to [Event Name]? Share your thoughts to help future attendees."

**Implementation**:
- Track event page views
- Send prompt via email or push notification (if enabled)
- Link directly to event review form

**Expected conversion**: 8-12% (events have higher engagement)

---

### Strategy 4: First Review Incentive

**Trigger**: New user completes registration

**Message**:
> "Share your first review and unlock the 'Local Voice' badge on your profile!"

**Gamification elements**:
- Profile badges for milestone reviews (1, 5, 10, 25, 50)
- "Helpful" votes on reviews
- Leaderboard of top reviewers (optional)

**Expected conversion**: 15-20% write first review within 30 days

---

### Strategy 5: Shop Owner Outreach

**For verified shop owners**:

1. Provide table cards / QR codes linking to review page
2. Suggest review prompts: "Share your experience on whitstable.shop"
3. Email customers post-purchase (if they have email list)

**Important**: Shop owners must NOT:
- Offer incentives for reviews
- Write fake reviews
- Ask only satisfied customers

**Materials to provide**:
- Printable QR code linking to shop's review page
- Suggested social media post template
- Email template for customer follow-up

---

### Strategy 6: Seasonal Prompts

**Christmas/Peak Season**:
> "Visited any Whitstable shops this weekend? Share your finds to help other shoppers!"

**Summer Tourist Season**:
> "Discovering Whitstable? Leave a review to help fellow visitors find the best spots."

**Oyster Festival**:
> "Enjoying Oyster Festival? Tell us about your favourite stalls and experiences!"

---

## Review Quality Guidelines

### What Makes a Good Review

- **Specific**: Mentions particular products, dishes, or experiences
- **Balanced**: Notes both positives and areas for improvement
- **Personal**: Written from genuine first-hand experience
- **Helpful**: Answers questions future visitors might have
- **Recent**: Reflects current state of the business

### Review Moderation

**Auto-approve** reviews that:
- Have 50+ characters
- Don't contain flagged keywords
- Are from accounts 24+ hours old

**Queue for moderation** reviews that:
- Contain potential profanity
- Are extremely short
- Are from brand new accounts
- Have been flagged by other users

**Reject** reviews that:
- Are clearly fake or spam
- Contain personal attacks
- Include promotional content
- Violate community guidelines

---

## Review Request Timing

| Scenario | Best Timing | Channel |
|----------|-------------|---------|
| Post-save prompt | After 3rd save, on site | In-app modal |
| Return visitor | 3-14 days after view | In-app banner |
| Post-event | Day after event | Email/push |
| Seasonal | Peak weekends | Homepage banner |
| New user | 7 days after signup | Email |

---

## Metrics to Track

### Volume Metrics
- Total reviews per week
- Reviews per shop (average)
- Shops with 0 reviews
- New reviewers per week

### Quality Metrics
- Average review length
- Average rating (watch for skew)
- Helpful votes per review
- Reviews flagged/removed

### Conversion Metrics
- Prompt → Review start rate
- Review start → Submit rate
- By prompt type performance

### Target Goals (Month 6)

- 50+ reviews total
- Average 0.5 reviews per shop
- <20% of shops with 0 reviews
- Average review length: 80+ words

---

## Anti-Gaming Measures

To prevent fake or manipulated reviews:

1. **One review per shop per user**
2. **Account age requirement** (24 hours minimum)
3. **Email verification required**
4. **IP-based rate limiting**
5. **Machine learning spam detection** (future)
6. **User flagging system**
7. **Manual moderation queue**

---

## Review Display

### Shop Page Display

- Show most helpful reviews first
- Show most recent reviews option
- Display rating distribution (5-star, 4-star, etc.)
- Highlight "Verified Visitor" badge if implemented

### Review Card Components

```
[Avatar] [Username] [Date]
[Star Rating]
[Review Text - truncate at 150 chars with "Read more"]
[Helpful? Yes (X) | Report]
```

---

## Future Enhancements

1. **Photo reviews**: Allow users to attach photos
2. **Response from owner**: Let claimed businesses respond
3. **Aspect ratings**: Rate specific aspects (service, value, quality)
4. **Verified purchase**: Integration with booking/payment systems
5. **Review reminders**: Push notifications for frequent visitors

---

*Review this strategy quarterly and adjust based on performance data.*
