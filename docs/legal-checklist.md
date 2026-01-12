# Legal & Compliance Checklist

Essential legal requirements for operating whitstable.shop in the UK.

---

## Privacy & Data Protection

### GDPR / UK GDPR Compliance

The UK GDPR and Data Protection Act 2018 apply. Key requirements:

- [ ] **Privacy Policy**: Published and accessible
- [ ] **Lawful basis**: Document lawful basis for processing
- [ ] **Data minimisation**: Only collect necessary data
- [ ] **User rights**: Enable access, deletion, portability
- [ ] **Consent**: Clear consent for marketing emails
- [ ] **Breach procedures**: Plan for data breach response

### Privacy Policy Requirements

Your privacy policy must include:

- [ ] Identity and contact details
- [ ] Types of data collected
- [ ] How data is used
- [ ] Legal basis for processing
- [ ] Data sharing (third parties)
- [ ] International transfers
- [ ] Retention periods
- [ ] User rights
- [ ] Right to complain to ICO
- [ ] Cookie usage

**Status**: ✅ Implemented at `/app/privacy/page.tsx`

### ICO Registration

If you process personal data, you may need to register with the Information Commissioner's Office (ICO).

**Exemptions apply for**:
- Small businesses (turnover <£632k)
- Processing only for personal/household purposes
- Certain non-profit activities

**Check**: https://ico.org.uk/for-organisations/register/

- [ ] Determine if registration required
- [ ] Register if applicable (£40/year for most small businesses)

---

## Terms of Service

### Requirements

Terms of service should cover:

- [ ] Acceptance of terms
- [ ] Service description
- [ ] User accounts and responsibilities
- [ ] User content and licensing
- [ ] Prohibited activities
- [ ] Intellectual property
- [ ] Disclaimer of warranties
- [ ] Limitation of liability
- [ ] Indemnification
- [ ] Dispute resolution
- [ ] Governing law (England & Wales)
- [ ] Changes to terms
- [ ] Contact information

**Status**: ✅ Implemented at `/app/terms/page.tsx`

---

## Cookie Compliance

### PECR (Privacy and Electronic Communications Regulations)

UK law requires consent for non-essential cookies.

### Our Approach

Using privacy-focused analytics (Plausible/Umami) that don't use cookies means:

- [ ] ✅ No tracking cookies
- [ ] ✅ No cookie consent banner required for analytics
- [ ] Session cookies only (for authentication) - can use legitimate interest

### Required Cookies Disclosure

Document essential cookies used:

| Cookie | Purpose | Duration | Consent |
|--------|---------|----------|---------|
| Auth token | Login session | Session | Essential |
| User preferences | Settings | 1 year | Essential |

Include this in privacy policy.

---

## Business Registration

### Sole Trader

Simplest option for starting:
- [ ] Register for Self Assessment with HMRC
- [ ] Keep records of income/expenses
- [ ] File annual Self Assessment tax return

### Limited Company

Consider if:
- Revenue exceeds £30-50k
- Want liability protection
- Planning to raise investment

Steps:
- [ ] Register with Companies House
- [ ] Register for Corporation Tax
- [ ] Set up business bank account
- [ ] Annual accounts and returns

### Trading Name

"whitstable.shop" is a trading name. If using as sole trader:
- [ ] Register trading name (not required but recommended)
- [ ] Ensure domain ownership documented

---

## Intellectual Property

### Trademarks

Consider trademarking "whitstable.shop" if successful:
- [ ] Search existing trademarks
- [ ] File UK trademark application (if proceeding)
- Cost: ~£170+ for one class

### Copyright

- Your original content is automatically copyrighted
- User-generated content: Users retain ownership, license to you
- Third-party content: Ensure proper rights/licenses

### Domain Ownership

- [ ] Document domain registration
- [ ] Enable auto-renewal
- [ ] Secure similar domains (optional)
- [ ] Register with privacy protection

---

## Third-Party Services

### Data Processing Agreements

For services handling user data, ensure DPAs in place:

| Service | Purpose | DPA Status |
|---------|---------|------------|
| Supabase | Database, Auth | Standard terms include DPA |
| Vercel | Hosting | Standard terms include DPA |
| Mapbox | Maps | Review terms |
| Plausible/Umami | Analytics | Privacy-compliant by design |
| Buttondown | Email | Review DPA |

- [ ] Review terms for each service
- [ ] Document data flows
- [ ] List in privacy policy

---

## Business Listings

### User-Generated Business Data

For business listings:
- [ ] Clearly state data source (public information)
- [ ] Provide claim/correction mechanism
- [ ] Respond to removal requests reasonably
- [ ] Don't guarantee accuracy

### Review Moderation

- [ ] Clear review guidelines published
- [ ] Fair moderation process
- [ ] Don't remove negative reviews for being negative
- [ ] Respond to legal requests appropriately

---

## Consumer Rights

### Distance Selling

If selling subscriptions in future:
- [ ] Clear pricing
- [ ] 14-day cooling off period for consumers
- [ ] Clear cancellation process
- [ ] Refund policy

### Advertising Standards

- [ ] Don't make misleading claims
- [ ] Disclose sponsored content
- [ ] Follow ASA guidelines

---

## Accessibility

### WCAG Compliance

Not legally required for most private websites, but good practice:

- [ ] Keyboard navigation works
- [ ] Colour contrast sufficient
- [ ] Alt text on images
- [ ] Form labels present
- [ ] Screen reader compatible

### Public Sector

If partnering with councils/public bodies, may need:
- [ ] WCAG 2.1 AA compliance
- [ ] Accessibility statement

---

## Insurance

### Consider

- **Professional Indemnity**: If giving business advice
- **Public Liability**: If meeting businesses in person
- **Cyber Insurance**: For data breach coverage

For early stage, personal approach:
- [ ] Review existing insurance coverage
- [ ] Consider basic cyber insurance as platform grows

---

## Ongoing Compliance

### Monthly

- [ ] Review user deletion requests
- [ ] Check for legal requirement changes
- [ ] Update privacy policy if processing changes

### Annually

- [ ] Review all legal documents
- [ ] Renew ICO registration (if applicable)
- [ ] Update third-party service list
- [ ] Tax filings

### When Changing

- [ ] New features: Review privacy implications
- [ ] New services: Add to DPA list
- [ ] New data collection: Update privacy policy
- [ ] Expansion: Review geographic requirements

---

## Key Contacts

### Regulatory

- **ICO**: https://ico.org.uk / 0303 123 1113
- **Companies House**: https://www.gov.uk/government/organisations/companies-house
- **HMRC**: https://www.gov.uk/government/organisations/hm-revenue-customs

### Legal Advice

Consider consulting a solicitor for:
- Complex terms of service
- Business structuring
- Investment/funding agreements
- Disputes

**Affordable options**:
- Legal Zoom UK
- Rocket Lawyer
- Local solicitors (initial consultation often free)

---

## Checklist Summary

### Pre-Launch (Essential)

- [x] Privacy policy published
- [x] Terms of service published
- [ ] Cookie approach documented
- [ ] ICO registration determined
- [ ] Domain ownership secured

### Post-Launch (Important)

- [ ] Business registration (sole trader or Ltd)
- [ ] Bank account for business
- [ ] Basic record keeping
- [ ] Third-party DPAs reviewed

### Future (As Needed)

- [ ] Trademark registration
- [ ] Insurance coverage
- [ ] Formal legal review

---

*This checklist is for guidance only and does not constitute legal advice. Consult a solicitor for specific legal questions.*
