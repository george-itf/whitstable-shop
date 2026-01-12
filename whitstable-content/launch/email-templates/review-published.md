# Review Published Email

**Trigger:** Sent when a user's review is approved and published

---

## Subject Line Options

- Your review is live!
- Thanks for your review of {{shop_name}}
- Your review has been published

**Recommended:** Your review is live!

---

## Merge Fields

| Field | Description |
|-------|-------------|
| `{{shop_name}}` | Name of the reviewed business |
| `{{shop_url}}` | URL to the shop page |
| `{{review_snippet}}` | First 50 characters of their review |
| `{{author_name}}` | Reviewer's display name |

---

## Email Body

---

**Your review is live**

Hi {{author_name}},

Thanks for reviewing **{{shop_name}}**. Your review is now published and helping others discover great local spots.

**Your review:** "{{review_snippet}}..."

→ [See it on the shop page]({{shop_url}})

**What next?**

Tried other places in Whitstable? We'd love to hear about them too. Every review helps locals and visitors find somewhere great.

→ [Browse more shops](https://whitstable.shop/shops)

Thanks for being part of the community.

Cheers,
whitstable.shop

---

*You're receiving this because you left a review on whitstable.shop. [Unsubscribe](#) from review notifications.*

---

## Design Notes

- Brief and appreciative
- Show a snippet of their review (makes it personal)
- Encourage more reviews (soft ask)
- One clear call to action
