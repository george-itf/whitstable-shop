# Letter Template with Merge Fields

Use this template to generate personalized letters for each shop.

---

## Merge Fields

| Field | Description | Example |
|-------|-------------|---------|
| `{{shop_name}}` | Name of the business | Wheeler's Oyster Bar |
| `{{owner_name}}` | Owner's name (if known) | Mark Wheeler |
| `{{shop_url}}` | Full URL to shop page | whitstable.shop/shops/wheelers-oyster-bar |
| `{{shop_slug}}` | URL slug | wheelers-oyster-bar |
| `{{qr_code}}` | QR code image linking to shop page | [Generated image] |
| `{{date}}` | Date of letter | 15 January 2026 |

---

## Personalized Letter Template

---

**{{date}}**

Dear {{owner_name}},

I hope this finds you well at **{{shop_name}}**.

I'm writing to let you know about **whitstable.shop** — a new website I've built for our town. It's a simple idea: one place where locals and visitors can find all of Whitstable's independent shops, cafés, and restaurants.

**{{shop_name}} is already listed.** I've added your opening hours, address, and a description based on what I know. But you know your shop better than anyone, so I'd love you to check it and make any changes.

## Why does this exist?

Whitstable's high street is special. We have butchers, bakers, bookshops, and galleries that have been here for generations. But when someone searches online, they usually end up on Google or TripAdvisor — platforms that don't really understand what makes a place like ours tick.

whitstable.shop is different. It's built specifically for Whitstable. No algorithms. No paid listings. Just local businesses with honest reviews.

## What does it cost?

Nothing. It's free.

## What should you do?

1. **Visit your listing:** Scan the QR code or go to **{{shop_url}}**
2. **Claim your shop:** Click "Claim this shop" and verify ownership
3. **Update your details:** Add your description, photos, and hours

Takes about five minutes.

Questions? Email hello@whitstable.shop

Thanks for being part of what makes Whitstable brilliant.

Best wishes,

*[Your name]*

---

**{{qr_code}}**

**{{shop_url}}**

---

*This is a community project, not a business.*

---

## Implementation Notes

### Generating QR Codes

Use a QR code library to generate codes for each shop URL:
- Recommended size: 2cm x 2cm minimum
- Error correction: High (H) for better scanning
- Format: PNG or SVG

### Mail Merge Tools

Compatible with:
- Microsoft Word Mail Merge
- Google Docs + Sheets
- Python script with Jinja2
- Node.js script with Handlebars

### Printing Specs

- Paper: 120gsm uncoated for friendly feel
- Size: A5 (148 x 210mm)
- Printing: Black and white is fine, colour for QR code area
- Fold: Single fold to fit standard envelope

### Envelope Specs

- Size: C6 (114 x 162mm) for folded A5
- Style: Plain white, no window
- Consider handwritten addresses for personal touch
