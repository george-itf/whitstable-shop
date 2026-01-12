# Claim Request Email (Admin Notification)

**Trigger:** Sent to admin when someone requests to claim a shop listing

---

## Subject Line

New claim request: {{shop_name}}

---

## Merge Fields

| Field | Description |
|-------|-------------|
| `{{shop_name}}` | Name of the business being claimed |
| `{{shop_slug}}` | URL slug of the shop |
| `{{shop_url}}` | Full URL to shop page |
| `{{requester_name}}` | Name of person claiming |
| `{{requester_email}}` | Email of person claiming |
| `{{requester_phone}}` | Phone number (if provided) |
| `{{requester_role}}` | Stated role (owner, manager, staff) |
| `{{request_message}}` | Optional message from requester |
| `{{request_date}}` | Date and time of request |
| `{{admin_url}}` | Link to admin review page |

---

## Email Body

---

**New Claim Request**

Someone wants to claim a shop listing.

---

**Shop Details**

- **Shop:** {{shop_name}}
- **Page:** {{shop_url}}

---

**Requester Details**

- **Name:** {{requester_name}}
- **Email:** {{requester_email}}
- **Phone:** {{requester_phone}}
- **Role:** {{requester_role}}
- **Submitted:** {{request_date}}

**Message from requester:**
{{request_message}}

---

**Verification Steps**

Before approving, consider:

1. Does the email domain match the business website?
2. Is the phone number the same as listed for the business?
3. Does a quick Google search confirm this person's role?
4. For high-profile claims, consider calling the business directly

---

**Actions**

→ [Review in admin panel]({{admin_url}})
→ [View shop page]({{shop_url}})

---

*This is an automated notification from whitstable.shop*

---

## Admin Actions (in admin panel)

**Approve:**
- Grants owner access to the shop listing
- Sends confirmation email to requester
- Logs action with admin notes

**Reject:**
- Sends polite rejection email
- Optionally request more verification
- Logs reason for rejection

**Request More Info:**
- Sends email asking for additional verification
- Suggested: photo of business license, utility bill, or standing in front of shop
