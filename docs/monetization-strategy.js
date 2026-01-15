const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');

// Monetization strategies with comprehensive scoring
const strategies = [
  // === SUBSCRIPTION / PREMIUM ===
  {
    category: "Subscription & Premium",
    name: "Premium Shop Listings",
    description: "Tiered monthly subscriptions for businesses: Basic (free), Pro (£15/mo), Premium (£35/mo). Features: priority search placement, analytics dashboard, featured spots, remove competitor suggestions, custom branding.",
    revenue: 82,
    ethics: 90,
    feasibility: 95,
    effort: "Low",
    revenueModel: "Recurring",
    potentialARR: "£15,000 - £40,000",
    rationale: "Industry standard, fair value exchange. Shops expect to pay for visibility. Non-intrusive to users. Easy to implement with existing infrastructure.",
    risks: "May create two-tier experience. Need enough free value to attract shops first."
  },
  {
    category: "Subscription & Premium",
    name: "Shop Analytics Pro",
    description: "Advanced analytics package: competitor benchmarking, customer demographics, peak hours analysis, review sentiment tracking, footfall predictions. £20/month add-on.",
    revenue: 65,
    ethics: 88,
    feasibility: 80,
    effort: "Medium",
    revenueModel: "Recurring",
    potentialARR: "£8,000 - £20,000",
    rationale: "High value for data-driven shop owners. Ethical as it's B2B, not exploiting users. Requires robust data collection first.",
    risks: "Need critical mass of data to be valuable. May expose user behaviour patterns."
  },
  {
    category: "Subscription & Premium",
    name: "Premium User Membership",
    description: "£3.99/month for users: ad-free experience, early access to deals, exclusive discounts, premium badges, priority support.",
    revenue: 55,
    ethics: 70,
    feasibility: 75,
    effort: "Medium",
    revenueModel: "Recurring",
    potentialARR: "£5,000 - £15,000",
    rationale: "Common model but can feel extractive on community platform. Need compelling exclusive value. May fragment community.",
    risks: "Users expect community platforms to be free. Could reduce engagement if core features gated."
  },
  {
    category: "Subscription & Premium",
    name: "Event Organiser Tools",
    description: "Premium tools for event creators: ticketing, attendee management, email campaigns, analytics. 5% of ticket sales or £10/month flat.",
    revenue: 60,
    ethics: 92,
    feasibility: 70,
    effort: "High",
    revenueModel: "Hybrid",
    potentialARR: "£3,000 - £12,000",
    rationale: "Fair value for professional tools. Competes with Eventbrite but local focus wins. Ethical as it's a business tool.",
    risks: "Eventbrite is entrenched. Many local events are free/informal."
  },

  // === TRANSACTION FEES ===
  {
    category: "Transaction Fees",
    name: "Whitstable Gift Card",
    description: "Digital gift card spendable at any participating shop. Revenue from: 3-5% merchant fee, float income on unredeemed balance, corporate bulk sales.",
    revenue: 90,
    ethics: 85,
    feasibility: 65,
    effort: "High",
    revenueModel: "Transactional",
    potentialARR: "£20,000 - £80,000",
    rationale: "Keeps money in local economy - strong ethical story. High revenue potential from merchant fees and float. Complex payment integration required.",
    risks: "Regulatory compliance (e-money). Merchant adoption needed. Unredeemed balance accounting."
  },
  {
    category: "Transaction Fees",
    name: "Marketplace Commission",
    description: "Take 5-10% commission on local marketplace sales (buy/sell between residents). Free for items under £20.",
    revenue: 75,
    ethics: 72,
    feasibility: 80,
    effort: "Medium",
    revenueModel: "Transactional",
    potentialARR: "£10,000 - £35,000",
    rationale: "Facebook Marketplace is free, so need to justify fee with trust/convenience. Small items free keeps goodwill. Payment escrow adds value.",
    risks: "Users may prefer free alternatives. Need critical mass for liquidity."
  },
  {
    category: "Transaction Fees",
    name: "Booking Fees",
    description: "Small fee (£0.50-£2) on class/event bookings made through platform. Split between platform and organiser.",
    revenue: 58,
    ethics: 80,
    feasibility: 85,
    effort: "Medium",
    revenueModel: "Transactional",
    potentialARR: "£5,000 - £18,000",
    rationale: "Users expect convenience fees for bookings. Keep fees low and transparent. Organiser split maintains relationships.",
    risks: "Low fee means high volume needed. May push organisers to direct bookings."
  },
  {
    category: "Transaction Fees",
    name: "Food Waste Deals Fee",
    description: "Too Good To Go model: take £0.50-£1 per surplus food deal sold. Win-win: users save money, shops reduce waste, platform earns.",
    revenue: 62,
    ethics: 95,
    feasibility: 75,
    effort: "Medium",
    revenueModel: "Transactional",
    potentialARR: "£4,000 - £15,000",
    rationale: "Highly ethical - reduces waste and saves money. Proven model. May compete with existing TGTG presence.",
    risks: "Too Good To Go already operates locally. Need differentiator."
  },
  {
    category: "Transaction Fees",
    name: "Service Booking Commission",
    description: "Trades directory with booking: take 5-8% of first job booked through platform. Recurring customers = no fee.",
    revenue: 70,
    ethics: 78,
    feasibility: 70,
    effort: "High",
    revenueModel: "Transactional",
    potentialARR: "£12,000 - £40,000",
    rationale: "High-value transactions (plumbers, electricians). First-job-only is fairer than ongoing. Competes with Checkatrade model.",
    risks: "Trades may bypass platform after first contact. Verification/trust is critical."
  },
  {
    category: "Transaction Fees",
    name: "Loyalty Points Processing",
    description: "Charge shops £0.02-0.05 per loyalty stamp/point issued. Volume-based pricing tiers.",
    revenue: 55,
    ethics: 88,
    feasibility: 85,
    effort: "Low",
    revenueModel: "Transactional",
    potentialARR: "£3,000 - £12,000",
    rationale: "Low friction, adds up at scale. Shops see clear ROI from repeat customers. Very low per-transaction cost.",
    risks: "Need high transaction volume. Some shops may find even small fees annoying."
  },

  // === ADVERTISING ===
  {
    category: "Advertising",
    name: "Sponsored Listings",
    description: "Pay-per-click or impression-based promoted placements in search results and category pages. Clear 'Sponsored' labelling.",
    revenue: 72,
    ethics: 65,
    feasibility: 90,
    effort: "Medium",
    revenueModel: "Variable",
    potentialARR: "£8,000 - £30,000",
    rationale: "Industry standard but can erode trust if overdone. Must maintain clear labelling and limit frequency. Google/Facebook trained users to accept.",
    risks: "Can feel pay-to-win. May favour chains over independents. User trust erosion."
  },
  {
    category: "Advertising",
    name: "Featured Deals Slots",
    description: "Shops pay for prominent placement in deals/offers section. Daily or weekly featured slots. £10-50 per slot.",
    revenue: 60,
    ethics: 75,
    feasibility: 90,
    effort: "Low",
    revenueModel: "Variable",
    potentialARR: "£5,000 - £20,000",
    rationale: "Users want deals so alignment is good. Clear value proposition for shops. Keep slots limited to maintain value.",
    risks: "If too many paid slots, organic deals get buried."
  },
  {
    category: "Advertising",
    name: "Banner Advertising",
    description: "Display ads from local businesses on high-traffic pages. CPM model (cost per 1000 impressions).",
    revenue: 50,
    ethics: 50,
    feasibility: 85,
    effort: "Medium",
    revenueModel: "Variable",
    potentialARR: "£3,000 - £15,000",
    rationale: "Traditional model but feels dated and intrusive. Users have banner blindness. May cheapen the experience.",
    risks: "Ad blockers. Negative brand perception. Low engagement rates."
  },
  {
    category: "Advertising",
    name: "Sponsored Content / Advertorials",
    description: "Paid blog posts, shop spotlights, 'Discover' features. Clearly marked as sponsored. £50-200 per piece.",
    revenue: 45,
    ethics: 60,
    feasibility: 75,
    effort: "Medium",
    revenueModel: "Variable",
    potentialARR: "£2,000 - £10,000",
    rationale: "Native advertising can work if genuinely useful. Must maintain editorial integrity. Clearly label as sponsored.",
    risks: "Blurs editorial/commercial line. Users may lose trust if content feels fake."
  },
  {
    category: "Advertising",
    name: "Push Notification Sponsorship",
    description: "Shops pay to include offers in weekly digest or push notifications. Strict frequency limits.",
    revenue: 55,
    ethics: 45,
    feasibility: 80,
    effort: "Low",
    revenueModel: "Variable",
    potentialARR: "£4,000 - £15,000",
    rationale: "High engagement channel but invasive. Users will unsubscribe if abused. Must add genuine value.",
    risks: "Notification fatigue. Spam perception. Unsubscribes hurt all engagement."
  },

  // === DATA & INSIGHTS ===
  {
    category: "Data & Insights",
    name: "Local Market Reports",
    description: "Sell anonymised, aggregated insights to businesses: foot traffic trends, popular categories, peak times, demographic shifts. Quarterly reports £200-500.",
    revenue: 55,
    ethics: 70,
    feasibility: 60,
    effort: "High",
    revenueModel: "Variable",
    potentialARR: "£5,000 - £20,000",
    rationale: "B2B data monetisation is common but must be carefully anonymised. Value for retail chains, property developers, council.",
    risks: "Privacy concerns even with anonymisation. GDPR compliance critical. Reputational risk if perceived as 'selling data'."
  },
  {
    category: "Data & Insights",
    name: "Tourism Board Partnership",
    description: "Provide visitor insights, trending attractions, seasonal patterns to local tourism board. Annual contract £5,000-15,000.",
    revenue: 50,
    ethics: 82,
    feasibility: 65,
    effort: "Medium",
    revenueModel: "Contract",
    potentialARR: "£5,000 - £15,000",
    rationale: "Public sector partnership is ethical and stable. Supports local tourism promotion. Data used for public good.",
    risks: "Long sales cycle. Budget constraints in public sector. Relationship dependent."
  },
  {
    category: "Data & Insights",
    name: "Council Partnership",
    description: "Provide community insights to Canterbury City Council: popular amenities, parking pain points, community sentiment. Annual grant or contract.",
    revenue: 45,
    ethics: 88,
    feasibility: 55,
    effort: "Medium",
    revenueModel: "Contract",
    potentialARR: "£3,000 - £12,000",
    rationale: "Aligns with civic mission. Can help improve local services. Stable funding if secured.",
    risks: "Political changes affect budgets. Slow procurement process. May limit independence."
  },

  // === PARTNERSHIPS & AFFILIATES ===
  {
    category: "Partnerships",
    name: "Affiliate Commissions",
    description: "Earn referral fees from external bookings: train tickets (Trainline), parking apps (RingGo), accommodation (Booking.com). 3-8% commission.",
    revenue: 48,
    ethics: 75,
    feasibility: 85,
    effort: "Low",
    revenueModel: "Transactional",
    potentialARR: "£2,000 - £10,000",
    rationale: "Passive income from genuine recommendations. Users need these services anyway. Transparent if disclosed.",
    risks: "Low commission rates. Users may book directly. Must maintain editorial integrity."
  },
  {
    category: "Partnerships",
    name: "Shop Onboarding Service",
    description: "Done-for-you shop setup: photography, description writing, menu digitisation. £100-300 one-time fee or ongoing management.",
    revenue: 58,
    ethics: 95,
    feasibility: 90,
    effort: "Medium",
    revenueModel: "Service",
    potentialARR: "£5,000 - £20,000",
    rationale: "Genuine value-add service. Many small shops lack digital skills. Ethical as it's helping businesses.",
    risks: "Labour intensive. Scalability limited. Quality control."
  },
  {
    category: "Partnerships",
    name: "White-Label for Other Towns",
    description: "License the platform to other coastal/market towns. Setup fee + revenue share or monthly license.",
    revenue: 85,
    ethics: 92,
    feasibility: 40,
    effort: "Very High",
    revenueModel: "Licensing",
    potentialARR: "£30,000 - £150,000",
    rationale: "High revenue potential if platform succeeds. Helps other communities. Major engineering and support effort.",
    risks: "Distraction from core business. Each town needs customisation. Support overhead."
  },
  {
    category: "Partnerships",
    name: "Corporate Partnerships",
    description: "Local businesses (estate agents, law firms) sponsor features or events. 'Brought to you by...' Annual sponsorship packages.",
    revenue: 62,
    ethics: 70,
    feasibility: 75,
    effort: "Medium",
    revenueModel: "Contract",
    potentialARR: "£8,000 - £30,000",
    rationale: "Common in local media. Needs careful brand alignment. Can fund community features without user cost.",
    risks: "Editorial independence concerns. Limited sponsor pool locally."
  },
  {
    category: "Partnerships",
    name: "Insurance Partnerships",
    description: "Referral fees for shop insurance, public liability, cyber insurance. Partner with specialist broker.",
    revenue: 40,
    ethics: 75,
    feasibility: 70,
    effort: "Low",
    revenueModel: "Transactional",
    potentialARR: "£2,000 - £8,000",
    rationale: "Shops need insurance, can provide genuine value. Passive referral income. Must ensure quality partner.",
    risks: "Low conversion rates. Trust issues if claims problems. Not core to platform."
  },

  // === COMMUNITY & CROWDFUNDING ===
  {
    category: "Community Funding",
    name: "Voluntary Donations / Tips",
    description: "'Buy us a coffee' or 'Support Whitstable.shop' voluntary contributions. One-time or monthly supporters.",
    revenue: 30,
    ethics: 98,
    feasibility: 90,
    effort: "Very Low",
    revenueModel: "Donations",
    potentialARR: "£1,000 - £5,000",
    rationale: "Highly ethical, community-supported model. Works for Wikipedia, can work locally. Depends on goodwill.",
    risks: "Unreliable income. Donor fatigue. Hard to scale."
  },
  {
    category: "Community Funding",
    name: "Community Membership",
    description: "'Friends of Whitstable.shop' - £20/year. No premium features, just supporting the mission. Name on supporters page, annual thank you event.",
    revenue: 40,
    ethics: 95,
    feasibility: 85,
    effort: "Low",
    revenueModel: "Recurring",
    potentialARR: "£3,000 - £15,000",
    rationale: "Appeals to civic pride. Not transactional - purely supportive. Builds community ownership.",
    risks: "Limited appeal. Needs strong community connection. Not scalable."
  },
  {
    category: "Community Funding",
    name: "Crowdfunding Campaigns",
    description: "Launch specific campaigns for major features: 'Help us build X'. Kickstarter-style with rewards.",
    revenue: 35,
    ethics: 90,
    feasibility: 80,
    effort: "Medium",
    revenueModel: "One-time",
    potentialARR: "£5,000 - £20,000",
    rationale: "Good for specific initiatives. Builds excitement and ownership. One-time not ongoing.",
    risks: "Campaign fatigue if repeated. Delivery expectations. Platform fees (Kickstarter)."
  },
  {
    category: "Community Funding",
    name: "Local Business Consortium",
    description: "Shops collectively fund the platform: £10-20/month each from founding businesses. Democratic governance.",
    revenue: 55,
    ethics: 92,
    feasibility: 50,
    effort: "High",
    revenueModel: "Recurring",
    potentialARR: "£10,000 - £30,000",
    rationale: "Cooperative model aligns incentives. Shops have ownership stake. Sustainable if buy-in achieved.",
    risks: "Hard to organise. Governance complexity. Free-rider problem."
  },

  // === PREMIUM FEATURES ===
  {
    category: "Premium Features",
    name: "API Access",
    description: "Sell API access to shop data, events, local info. For developers, tourism apps, property portals. Tiered pricing.",
    revenue: 45,
    ethics: 78,
    feasibility: 60,
    effort: "High",
    revenueModel: "Recurring",
    potentialARR: "£2,000 - £12,000",
    rationale: "B2B revenue from data access. Must protect user privacy. Limited local market for API.",
    risks: "Small market. Maintenance overhead. Data freshness expectations."
  },
  {
    category: "Premium Features",
    name: "QR Code & Print Materials",
    description: "Sell physical materials to shops: custom QR codes, window stickers, table talkers, review request cards. £20-50 per pack.",
    revenue: 35,
    ethics: 95,
    feasibility: 90,
    effort: "Low",
    revenueModel: "One-time",
    potentialARR: "£2,000 - £8,000",
    rationale: "Physical touchpoint drives digital engagement. Low cost to produce. Genuine value for shops.",
    risks: "One-time purchase. Low margin. Logistics of production/delivery."
  },
  {
    category: "Premium Features",
    name: "Review Management Tools",
    description: "Premium tools: auto-respond to reviews, sentiment analysis, competitor review tracking, review request automation. £10/month.",
    revenue: 52,
    ethics: 82,
    feasibility: 75,
    effort: "Medium",
    revenueModel: "Recurring",
    potentialARR: "£4,000 - £15,000",
    rationale: "Clear value for shops managing reputation. Ethical as helps legitimate businesses. Competes with Trustpilot/Google.",
    risks: "Feature commoditisation. Shops may use Google directly."
  },

  // === PROBLEMATIC / NOT RECOMMENDED ===
  {
    category: "Not Recommended",
    name: "Selling User Data",
    description: "Sell individual user data, browsing history, or personal information to third parties.",
    revenue: 70,
    ethics: 5,
    feasibility: 80,
    effort: "Low",
    revenueModel: "Variable",
    potentialARR: "£10,000 - £50,000",
    rationale: "STRONGLY NOT RECOMMENDED. Destroys trust. Likely illegal under GDPR. Reputational suicide for community platform.",
    risks: "Legal liability. Community backlash. Violates platform values."
  },
  {
    category: "Not Recommended",
    name: "Pay-to-Remove Negative Reviews",
    description: "Charge shops to hide or remove negative reviews.",
    revenue: 45,
    ethics: 5,
    feasibility: 60,
    effort: "Low",
    revenueModel: "Variable",
    potentialARR: "£5,000 - £20,000",
    rationale: "STRONGLY NOT RECOMMENDED. Destroys review credibility. Potentially illegal (fake reviews laws). Harms users.",
    risks: "Legal issues. User trust destroyed. Media backlash."
  },
  {
    category: "Not Recommended",
    name: "Aggressive Paywalls",
    description: "Gate core features (search, viewing shops) behind paywall. Force payment for basic functionality.",
    revenue: 60,
    ethics: 25,
    feasibility: 70,
    effort: "Low",
    revenueModel: "Recurring",
    potentialARR: "£15,000 - £40,000",
    rationale: "NOT RECOMMENDED. Kills community platform. Users will leave. Against community mission.",
    risks: "User exodus. Negative word of mouth. Defeats platform purpose."
  },
  {
    category: "Not Recommended",
    name: "Hidden Fees",
    description: "Add unexpected fees at checkout, mandatory service charges, or unclear pricing.",
    revenue: 40,
    ethics: 10,
    feasibility: 85,
    effort: "Low",
    revenueModel: "Transactional",
    potentialARR: "£5,000 - £15,000",
    rationale: "STRONGLY NOT RECOMMENDED. Dark pattern that erodes trust. May be illegal. Harms brand reputation.",
    risks: "Consumer complaints. Regulatory action. Trust destruction."
  }
];

// Calculate composite score (weighted toward ethics for community platform)
strategies.forEach(s => {
  // For community platform: Ethics 35%, Revenue 40%, Feasibility 25%
  s.composite = Math.round((s.ethics * 0.35) + (s.revenue * 0.40) + (s.feasibility * 0.25));
});

// Sort by composite score
const sortedStrategies = [...strategies].sort((a, b) => b.composite - a.composite);

// Filter out "Not Recommended"
const recommendedStrategies = sortedStrategies.filter(s => s.category !== "Not Recommended");
const notRecommended = sortedStrategies.filter(s => s.category === "Not Recommended");

// Group by category
const categories = [...new Set(strategies.filter(s => s.category !== "Not Recommended").map(s => s.category))];

// Helper functions
function getScoreColor(score) {
  if (score >= 85) return "1B5E20"; // Dark green
  if (score >= 70) return "388E3C"; // Green
  if (score >= 55) return "FFA000"; // Amber
  if (score >= 40) return "F57C00"; // Orange
  return "D32F2F"; // Red
}

function getEthicsEmoji(score) {
  if (score >= 90) return "✓✓";
  if (score >= 75) return "✓";
  if (score >= 50) return "~";
  return "✗";
}

// Build document
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1a365d" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2d3748" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "4a5568" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Whitstable.shop Monetization Strategy", italics: true, size: 18, color: "718096" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, color: "718096" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "718096" }),
            new TextRun({ text: " | Confidential", size: 18, color: "718096" })
          ]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: "WHITSTABLE.SHOP", bold: true, size: 48, color: "0284c7" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Monetization Strategy & Ethics Analysis", size: 32, color: "475569" })]
      }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun(`This document analyses ${strategies.length} potential monetization strategies, scored on three dimensions:`)]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Revenue Potential (40%): ", bold: true }), new TextRun("How much money can this generate? Scalability and sustainability.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Ethics Score (35%): ", bold: true }), new TextRun("Does this align with community values? User trust impact. Fairness.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Feasibility (25%): ", bold: true }), new TextRun("Technical complexity, market readiness, resource requirements.")] }),

      new Paragraph({
        spacing: { after: 300 },
        shading: { fill: "FEF3C7", type: ShadingType.CLEAR },
        children: [new TextRun({ text: "Note: ", bold: true }), new TextRun("As a community platform, ethics is weighted heavily (35%). Strategies that erode trust may generate short-term revenue but destroy long-term value.")]
      }),

      // Revenue Projections Summary
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Revenue Projections Summary")] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [4000, 2500, 2850],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 4000, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Scenario", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 2500, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Annual Revenue", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 2850, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Primary Sources", bold: true, color: "FFFFFF", size: 18 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "F0FDF4", type: ShadingType.CLEAR }, width: { size: 4000, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Conservative (Year 1)", bold: true, size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "F0FDF4", type: ShadingType.CLEAR }, width: { size: 2500, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "£25,000 - £45,000", bold: true, size: 18, color: "166534" })] })] }),
              new TableCell({ borders, shading: { fill: "F0FDF4", type: ShadingType.CLEAR }, width: { size: 2850, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Shop subscriptions, featured listings", size: 16 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "FFFFFF", type: ShadingType.CLEAR }, width: { size: 4000, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Moderate (Year 2)", bold: true, size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "FFFFFF", type: ShadingType.CLEAR }, width: { size: 2500, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "£60,000 - £100,000", bold: true, size: 18, color: "166534" })] })] }),
              new TableCell({ borders, shading: { fill: "FFFFFF", type: ShadingType.CLEAR }, width: { size: 2850, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "+ Marketplace, bookings, gift card", size: 16 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "F0FDF4", type: ShadingType.CLEAR }, width: { size: 4000, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Ambitious (Year 3+)", bold: true, size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "F0FDF4", type: ShadingType.CLEAR }, width: { size: 2500, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "£120,000 - £250,000", bold: true, size: 18, color: "166534" })] })] }),
              new TableCell({ borders, shading: { fill: "F0FDF4", type: ShadingType.CLEAR }, width: { size: 2850, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "+ White-label, partnerships, scale", size: 16 })] })] })
            ]
          })
        ]
      }),

      // Top 10 Strategies
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Top 10 Recommended Strategies")] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [400, 2700, 700, 700, 700, 700, 1600],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 400, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true, color: "FFFFFF", size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 2700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Strategy", bold: true, color: "FFFFFF", size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Revenue", bold: true, color: "FFFFFF", size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ethics", bold: true, color: "FFFFFF", size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feasible", bold: true, color: "FFFFFF", size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Score", bold: true, color: "FFFFFF", size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 1600, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Est. ARR", bold: true, color: "FFFFFF", size: 16 })] })] })
            ]
          }),
          ...recommendedStrategies.slice(0, 10).map((s, i) => new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 400, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}`, bold: true, size: 16 })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 2700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: s.name, bold: true, size: 16 })] }), new Paragraph({ children: [new TextRun({ text: s.category, size: 14, color: "718096" })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.revenue}`, size: 16, color: getScoreColor(s.revenue) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.ethics}`, size: 16, color: getScoreColor(s.ethics) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.feasibility}`, size: 16, color: getScoreColor(s.feasibility) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.composite}`, bold: true, size: 18, color: getScoreColor(s.composite) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 1600, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.potentialARR, size: 14 })] })] })
            ]
          }))
        ]
      }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Ethical Gold Standard
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Ethical Gold Standard (Ethics 85+)")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("Strategies that strongly align with community values and build trust:")] }),
      ...strategies.filter(s => s.ethics >= 85 && s.category !== "Not Recommended").sort((a, b) => b.ethics - a.ethics).map(s =>
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: `${s.name} `, bold: true }), new TextRun(`(Ethics: ${s.ethics}, Revenue: ${s.revenue}) - ${s.rationale.split('.')[0]}.`)] })
      ),

      // Revenue Powerhouses
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Revenue Powerhouses (Revenue 70+)")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("Highest earning potential strategies:")] }),
      ...strategies.filter(s => s.revenue >= 70 && s.category !== "Not Recommended").sort((a, b) => b.revenue - a.revenue).map(s =>
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: `${s.name} `, bold: true }), new TextRun(`(Revenue: ${s.revenue}, Ethics: ${s.ethics}) - ${s.potentialARR}`)] })
      ),

      // Quick Wins
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Quick Wins (Low Effort)")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("Easy to implement, start generating revenue quickly:")] }),
      ...strategies.filter(s => (s.effort === "Low" || s.effort === "Very Low") && s.category !== "Not Recommended").sort((a, b) => b.composite - a.composite).map(s =>
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: `${s.name} `, bold: true }), new TextRun(`(Score: ${s.composite}) - ${s.effort} effort, ${s.potentialARR}`)] })
      ),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Full strategy analysis by category
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Complete Strategy Analysis")] }),

      // Generate sections for each category
      ...categories.flatMap(category => {
        const categoryStrategies = strategies.filter(s => s.category === category).sort((a, b) => b.composite - a.composite);
        return [
          new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(category)] }),
          ...categoryStrategies.flatMap(s => [
            new Paragraph({
              shading: { fill: "F0F9FF", type: ShadingType.CLEAR },
              spacing: { before: 200 },
              children: [
                new TextRun({ text: s.name, bold: true, size: 24 }),
                new TextRun({ text: `  [Score: ${s.composite}]`, size: 20, color: getScoreColor(s.composite) })
              ]
            }),
            new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: s.description, size: 20, color: "4a5568" })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnWidths: [1557, 1557, 1557, 1557, 1557, 1557],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1557, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Revenue", size: 14, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.revenue}`, bold: true, size: 20, color: getScoreColor(s.revenue) })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1557, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ethics", size: 14, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.ethics}`, bold: true, size: 20, color: getScoreColor(s.ethics) })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1557, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feasibility", size: 14, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.feasibility}`, bold: true, size: 20, color: getScoreColor(s.feasibility) })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1557, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Effort", size: 14, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.effort, bold: true, size: 18 })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1557, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Model", size: 14, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.revenueModel, bold: true, size: 16 })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1557, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Est. ARR", size: 14, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.potentialARR, bold: true, size: 14, color: "166534" })] })] })
                  ]
                })
              ]
            }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Rationale: ", bold: true, italics: true, size: 18 }), new TextRun({ text: s.rationale, italics: true, size: 18, color: "64748b" })] }),
            new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Risks: ", bold: true, size: 18, color: "DC2626" }), new TextRun({ text: s.risks, size: 18, color: "7f1d1d" })] })
          ])
        ];
      }),

      // Page break for Not Recommended
      new Paragraph({ children: [new PageBreak()] }),

      // NOT RECOMMENDED Section
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "NOT RECOMMENDED", color: "DC2626" })] }),
      new Paragraph({
        shading: { fill: "FEE2E2", type: ShadingType.CLEAR },
        spacing: { after: 200 },
        children: [new TextRun({ text: "The following strategies should be avoided. They may generate short-term revenue but will destroy community trust and long-term platform value.", color: "7f1d1d" })]
      }),
      ...notRecommended.flatMap(s => [
        new Paragraph({
          shading: { fill: "FEE2E2", type: ShadingType.CLEAR },
          spacing: { before: 200 },
          children: [
            new TextRun({ text: "✗ ", color: "DC2626", size: 24 }),
            new TextRun({ text: s.name, bold: true, size: 24, color: "7f1d1d" })
          ]
        }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: s.description, size: 20, color: "4a5568" })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Why not: ", bold: true, size: 18 }), new TextRun({ text: s.rationale, size: 18, color: "7f1d1d" })] })
      ]),

      // Page break for Implementation
      new Paragraph({ children: [new PageBreak()] }),

      // Implementation Roadmap
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Recommended Monetization Roadmap")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 1: Foundation (Months 1-3)")] }),
      new Paragraph({ children: [new TextRun({ text: "Target: £2,000-4,000/month", bold: true, color: "166534" })] }),
      new Paragraph({ children: [new TextRun("Focus on ethical, low-effort strategies that validate willingness to pay:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Premium Shop Listings ", bold: true }), new TextRun("- Core B2B revenue, industry standard")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Featured Deals Slots ", bold: true }), new TextRun("- Simple, shops understand the value")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Shop Onboarding Service ", bold: true }), new TextRun("- Genuine help, good margins")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Voluntary Donations ", bold: true }), new TextRun("- Test community support appetite")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 2: Transaction Layer (Months 4-6)")] }),
      new Paragraph({ children: [new TextRun({ text: "Target: £5,000-8,000/month", bold: true, color: "166534" })] }),
      new Paragraph({ children: [new TextRun("Add transactional revenue as platform usage grows:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Booking Fees ", bold: true }), new TextRun("- Classes and events, small but consistent")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Food Waste Marketplace ", bold: true }), new TextRun("- High ethics, proven model")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Loyalty Points Processing ", bold: true }), new TextRun("- Micro-fees at scale")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Affiliate Commissions ", bold: true }), new TextRun("- Passive income from recommendations")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 3: Ecosystem (Months 7-12)")] }),
      new Paragraph({ children: [new TextRun({ text: "Target: £10,000-15,000/month", bold: true, color: "166534" })] }),
      new Paragraph({ children: [new TextRun("Expand into higher-value, stickier revenue streams:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Whitstable Gift Card ", bold: true }), new TextRun("- Major revenue, complex but worth it")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Marketplace Commission ", bold: true }), new TextRun("- Local buy/sell with trust layer")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Service Booking Commission ", bold: true }), new TextRun("- Trades directory monetization")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Corporate Partnerships ", bold: true }), new TextRun("- Annual sponsorship deals")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 4: Scale (Year 2+)")] }),
      new Paragraph({ children: [new TextRun({ text: "Target: £20,000+/month", bold: true, color: "166534" })] }),
      new Paragraph({ children: [new TextRun("If successful, explore expansion opportunities:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "White-Label Licensing ", bold: true }), new TextRun("- Other towns want your platform")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Tourism Board Partnership ", bold: true }), new TextRun("- B2G contracts")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 400 }, children: [new TextRun({ text: "API Access ", bold: true }), new TextRun("- B2B data services")] }),

      // Final Principles
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Guiding Principles")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Community First: ", bold: true }), new TextRun("Never sacrifice user trust for short-term revenue. The community IS the product.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Transparent Pricing: ", bold: true }), new TextRun("Always be clear about costs. No hidden fees, no dark patterns.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Value Exchange: ", bold: true }), new TextRun("Only charge when providing genuine value. Free tier must remain useful.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Local Benefit: ", bold: true }), new TextRun("Revenue strategies should support, not extract from, the local economy.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Sustainable Growth: ", bold: true }), new TextRun("Prioritize recurring revenue over one-time gains. Build for the long term.")] }),

      // Scoring methodology
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400 }, children: [new TextRun("Scoring Methodology")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Each strategy was evaluated on three dimensions, weighted for a community platform:")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Revenue Potential (40%): ", bold: true }), new TextRun("Total addressable revenue, scalability, recurring vs one-time, margin potential")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Ethics Score (35%): ", bold: true }), new TextRun("User trust impact, fairness, alignment with community values, transparency")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Feasibility (25%): ", bold: true }), new TextRun("Technical complexity, market readiness, resource requirements, time to revenue")] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Composite Score = (Revenue × 0.40) + (Ethics × 0.35) + (Feasibility × 0.25)", bold: true })] }),
      new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Note: Ethics is weighted heavily (35%) because community trust is the platform's core asset. Strategies that erode trust may generate short-term revenue but destroy long-term value.", italics: true, size: 18, color: "64748b" })] }),

      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "— End of Document —", color: "94a3b8", size: 20 })] })
    ]
  }]
});

// Generate document
Packer.toBuffer(doc).then(buffer => {
  const outputPath = '/sessions/trusting-eloquent-gauss/mnt/whitshop/whitstable-shop/docs/Monetization-Strategy-2026.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log('Document created:', outputPath);
  console.log(`Total strategies analyzed: ${strategies.length}`);
  console.log(`\nTop 5 strategies by composite score:`);
  recommendedStrategies.slice(0, 5).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.name} (Score: ${s.composite}, Ethics: ${s.ethics}, Revenue: ${s.revenue})`);
  });
  console.log(`\nHighest ethics strategies:`);
  strategies.filter(s => s.ethics >= 90 && s.category !== "Not Recommended").sort((a, b) => b.ethics - a.ethics).slice(0, 3).forEach(s => {
    console.log(`  - ${s.name} (Ethics: ${s.ethics})`);
  });
});
