# Shop Listing Approved Email

**Trigger:** Sent when admin approves a new shop listing

---

## Subject Line Options

- Your shop is now live on whitstable.shop
- {{shop_name}} is now on whitstable.shop
- Good news — you're listed!

**Recommended:** Your shop is now live on whitstable.shop

---

## Merge Fields

| Field | Description |
|-------|-------------|
| `{{shop_name}}` | Name of the business |
| `{{shop_url}}` | Full URL to shop page |
| `{{owner_name}}` | Owner's first name (if known) |

---

## Email Body

---

**Your shop is live!**

Hi {{owner_name}},

Great news — **{{shop_name}}** is now listed on whitstable.shop.

**Your page:** {{shop_url}}

Here's what you can do now:

**Check your details**
Make sure your opening hours, contact info, and description are correct. You can edit anytime from your dashboard.

**Add photos**
Good photos help customers find you. Add your best shots of your shop, products, or food.

**Claim your listing** (if you haven't already)
This lets you respond to reviews and get notified when someone leaves feedback.

**Share it**
Post your listing on social media. Let your regulars know where to find you online.

→ [View your shop page]({{shop_url}})
→ [Edit your details](https://whitstable.shop/dashboard)

Thanks for being part of whitstable.shop.

Cheers,
whitstable.shop

---

*You're receiving this because {{shop_name}} was added to whitstable.shop. Questions? Reply to this email.*

---

## Design Notes

- Friendly, congratulatory tone
- Clear call to action: view the page
- Keep it brief — shop owners are busy
- No marketing fluff
