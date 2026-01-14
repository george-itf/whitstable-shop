const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');

// Feature data with comprehensive scoring
const features = [
  // === SOCIAL & COMMUNITY ===
  {
    category: "Social & Community",
    name: "Real-Time Chat / Messaging",
    description: "Direct messaging between users, shop owners. Group chats for communities (e.g., dog walkers, photographers). Integration with existing features.",
    impact: 72,
    demand: 78,
    usp: 45,
    effort: "High",
    rationale: "High engagement driver but common in apps. Privacy/moderation concerns. Would need significant infrastructure.",
    priority: "Medium"
  },
  {
    category: "Social & Community",
    name: "Local Marketplace (Buy/Sell)",
    description: "Residents can list items for sale/free. Categories: furniture, clothes, kids stuff, garden. Integration with existing profiles and reputation.",
    impact: 85,
    demand: 92,
    usp: 68,
    effort: "High",
    rationale: "Very high demand - everyone uses Facebook Marketplace. Local focus is USP vs global platforms. Monetisation potential.",
    priority: "High"
  },
  {
    category: "Social & Community",
    name: "Community Groups",
    description: "User-created groups around interests: Gardening Club, Book Club, Beach Clean volunteers, Parents group. Events, discussions, member lists.",
    impact: 78,
    demand: 75,
    usp: 62,
    effort: "Medium",
    rationale: "Builds sticky community. Competes with Facebook Groups but local-only focus is differentiator.",
    priority: "Medium"
  },
  {
    category: "Social & Community",
    name: "Neighbourhood Watch Integration",
    description: "Alert system for local incidents. Anonymous reporting. Map-based view of recent reports. Partnership with local police.",
    impact: 70,
    demand: 65,
    usp: 75,
    effort: "Medium",
    rationale: "High USP as hyper-local. Safety concerns drive engagement. May be controversial. Needs careful moderation.",
    priority: "Medium"
  },
  {
    category: "Social & Community",
    name: "Local Heroes / Thank You Wall",
    description: "Public appreciation posts for helpful neighbours. Integrate with awards system. Weekly featured heroes.",
    impact: 55,
    demand: 60,
    usp: 70,
    effort: "Low",
    rationale: "Low effort, feel-good feature. Encourages community spirit. Extends existing awards system.",
    priority: "Low-Medium"
  },
  {
    category: "Social & Community",
    name: "Volunteer Coordination Hub",
    description: "Local charities post volunteer needs. Track volunteer hours. Volunteer profiles and badges. Event sign-ups.",
    impact: 72,
    demand: 58,
    usp: 80,
    effort: "Medium",
    rationale: "High USP - no good local solution exists. Builds community goodwill. Lower demand but high-value users.",
    priority: "Medium"
  },

  // === LOCAL SERVICES ===
  {
    category: "Local Services",
    name: "Service Directory (Trades)",
    description: "Plumbers, electricians, cleaners, gardeners. Reviews and ratings. Quote request system. Availability calendar.",
    impact: 88,
    demand: 95,
    usp: 72,
    effort: "Medium",
    rationale: "Extremely high demand - 'who do you recommend' is constant. Checkatrade/Bark competitor but local focus wins.",
    priority: "Very High"
  },
  {
    category: "Local Services",
    name: "Babysitter / Pet Sitter Network",
    description: "Trusted local sitters. DBS check verification. Reviews from families. Booking system. Regular sitter matching.",
    impact: 75,
    demand: 82,
    usp: 78,
    effort: "Medium",
    rationale: "High demand from families. Trust is key - local community aspect helps. Care.com competitor but hyperlocal.",
    priority: "High"
  },
  {
    category: "Local Services",
    name: "Tool / Equipment Library",
    description: "Borrow tools from neighbours. Pressure washer, ladder, drill. Deposit system. Pickup/return coordination.",
    impact: 62,
    demand: 55,
    usp: 85,
    effort: "Medium",
    rationale: "Very high USP - novel concept. Lower demand but cult following potential. Sustainability angle appeals.",
    priority: "Medium"
  },
  {
    category: "Local Services",
    name: "Car Share / Lift Share",
    description: "Offer/request lifts to train station, airport, events. Regular commute matching. Cost sharing calculator.",
    impact: 68,
    demand: 62,
    usp: 65,
    effort: "Medium",
    rationale: "Eco-friendly angle. Canterbury station runs very popular. Competes with BlaBlaCar but hyperlocal works.",
    priority: "Medium"
  },
  {
    category: "Local Services",
    name: "Local Delivery Network",
    description: "Neighbours delivering packages when they're going that way. Shop deliveries by locals. Uber Eats-style for local shops.",
    impact: 70,
    demand: 68,
    usp: 82,
    effort: "High",
    rationale: "High USP and supports local shops. Complex logistics. Insurance/liability concerns.",
    priority: "Medium"
  },

  // === COMMERCE & DEALS ===
  {
    category: "Commerce & Deals",
    name: "Loyalty Card System",
    description: "Digital stamps across shops. 'Visit 10 Whitstable shops, get £10 off'. Cross-shop promotions. Reward tiers.",
    impact: 82,
    demand: 75,
    usp: 88,
    effort: "Medium",
    rationale: "Very high USP - unique to platform. Drives shop visits. Revenue opportunity. Shops will pay for this.",
    priority: "Very High"
  },
  {
    category: "Commerce & Deals",
    name: "Gift Card / Whitstable Wallet",
    description: "Buy digital gift credit for ANY local shop. 'Whitstable Gift Card'. Perfect for gifts, staff rewards, tourism.",
    impact: 85,
    demand: 72,
    usp: 92,
    effort: "High",
    rationale: "Massive USP - keeps money local. Complex payment integration. High revenue potential. Tourism draw.",
    priority: "Very High"
  },
  {
    category: "Commerce & Deals",
    name: "Flash Deals / Happy Hour",
    description: "Time-sensitive offers. '50% off at The Cheese Box until 5pm'. Push notifications. Real-time inventory.",
    impact: 78,
    demand: 85,
    usp: 70,
    effort: "Low-Medium",
    rationale: "High demand for deals. Creates urgency/engagement. Low effort extension of existing offers system.",
    priority: "High"
  },
  {
    category: "Commerce & Deals",
    name: "Pre-Order & Click-Collect",
    description: "Order from any local shop for collection. Skip the queue. Reserve items. Integrated payments.",
    impact: 80,
    demand: 78,
    usp: 75,
    effort: "High",
    rationale: "High value for both users and shops. Complex POS integration. Would need shop partnerships.",
    priority: "High"
  },
  {
    category: "Commerce & Deals",
    name: "Subscription Boxes",
    description: "Monthly curated boxes from local shops. Cheese box, book box, art supplies. Discounted vs individual.",
    impact: 65,
    demand: 55,
    usp: 80,
    effort: "High",
    rationale: "High USP, niche appeal. Complex logistics. Good for certain shop types. Recurring revenue.",
    priority: "Low-Medium"
  },

  // === EVENTS & ACTIVITIES ===
  {
    category: "Events & Activities",
    name: "Booking System for Classes",
    description: "Book yoga, art classes, workshops. Calendar integration. Waitlists. Cancellation policy handling.",
    impact: 75,
    demand: 80,
    usp: 65,
    effort: "Medium",
    rationale: "High demand - lots of classes in Whitstable. Competes with Eventbrite but local focus wins.",
    priority: "High"
  },
  {
    category: "Events & Activities",
    name: "Tide-Synced Beach Activities",
    description: "Activities that depend on tide. Rock pooling alerts, SUP best times, sailing conditions. Auto-scheduling.",
    impact: 70,
    demand: 72,
    usp: 95,
    effort: "Low-Medium",
    rationale: "Extremely high USP - unique to coastal towns. Easy to build on existing tide data. Tourist draw.",
    priority: "High"
  },
  {
    category: "Events & Activities",
    name: "Walking Tours (Self-Guided)",
    description: "GPS-triggered audio tours. History tour, architecture tour, food tour. Shop partnerships along route.",
    impact: 68,
    demand: 65,
    usp: 85,
    effort: "Medium",
    rationale: "High USP for tourists. Can drive shop visits. Medium effort with audio content creation.",
    priority: "Medium"
  },
  {
    category: "Events & Activities",
    name: "Pub Quiz / Trivia Network",
    description: "When & where are pub quizzes. Team formation. Leaderboards across pubs. Book tables.",
    impact: 58,
    demand: 70,
    usp: 75,
    effort: "Low",
    rationale: "Niche but passionate audience. Low effort, high engagement for quiz lovers. Social feature.",
    priority: "Low-Medium"
  },
  {
    category: "Events & Activities",
    name: "Kids Activities Hub",
    description: "What's on for kids by age. School holiday activities. Birthday party venues. Playdate matching.",
    impact: 75,
    demand: 88,
    usp: 72,
    effort: "Medium",
    rationale: "Very high demand from parents. Constant question in local groups. Good category expansion.",
    priority: "High"
  },

  // === CONTENT & DISCOVERY ===
  {
    category: "Content & Discovery",
    name: "Local Blog / News Section",
    description: "Community-contributed articles. Shop spotlights. Event recaps. Seasonal guides. Editorial calendar.",
    impact: 60,
    demand: 55,
    usp: 58,
    effort: "Medium",
    rationale: "Content marketing value. SEO benefits. Competes with local newspapers. Needs editorial effort.",
    priority: "Low"
  },
  {
    category: "Content & Discovery",
    name: "Video Content / Reels",
    description: "Short video clips of shops, events, beach. TikTok-style feed. User-generated content.",
    impact: 72,
    demand: 68,
    usp: 55,
    effort: "High",
    rationale: "Modern, engaging format. High effort for hosting/moderation. May distract from core mission.",
    priority: "Low"
  },
  {
    category: "Content & Discovery",
    name: "Personalised Recommendations",
    description: "AI-powered 'For You' feed. Based on saves, visits, interests. Daily suggestions.",
    impact: 75,
    demand: 70,
    usp: 65,
    effort: "High",
    rationale: "Modern expectation. Increases engagement. Complex ML implementation. May feel creepy.",
    priority: "Medium"
  },
  {
    category: "Content & Discovery",
    name: "Seasonal Guides",
    description: "Best of Summer, Christmas in Whitstable, Rainy Day Activities. Curated collections. Shareable.",
    impact: 65,
    demand: 72,
    usp: 70,
    effort: "Low",
    rationale: "Low effort, high value. Great for SEO and sharing. Tourists love these.",
    priority: "Medium"
  },
  {
    category: "Content & Discovery",
    name: "Audio Guides / Podcast",
    description: "Local history podcast. Shop owner interviews. Walking tour audio. Seasonal episodes.",
    impact: 52,
    demand: 45,
    usp: 72,
    effort: "Medium",
    rationale: "Niche audience. Good USP. Production overhead. Can start with simple format.",
    priority: "Low"
  },

  // === TOURISM & VISITORS ===
  {
    category: "Tourism & Visitors",
    name: "Accommodation Listings",
    description: "B&Bs, holiday rentals, hotels. Availability calendar. Direct booking. Reviews from platform users.",
    impact: 72,
    demand: 65,
    usp: 68,
    effort: "High",
    rationale: "Competes with Airbnb/Booking but local angle. Good revenue potential. Complex booking system.",
    priority: "Medium"
  },
  {
    category: "Tourism & Visitors",
    name: "Day Trip Planner",
    description: "Build itineraries with timing. Breakfast here, shop there, lunch, beach. Printable/shareable.",
    impact: 78,
    demand: 82,
    usp: 80,
    effort: "Medium",
    rationale: "High USP for tourists. 'What should we do in Whitstable?' answered perfectly. Drives shop visits.",
    priority: "High"
  },
  {
    category: "Tourism & Visitors",
    name: "Parking Availability Live",
    description: "Real-time parking space availability. Street parking, car parks. Prediction by time of day.",
    impact: 82,
    demand: 90,
    usp: 85,
    effort: "High",
    rationale: "Massive pain point - parking is nightmare. Would need sensors/partnerships. Very high value if solved.",
    priority: "High (if feasible)"
  },
  {
    category: "Tourism & Visitors",
    name: "Tourist Welcome Pack",
    description: "First-time visitor guide. Essential info bundle. Exclusive welcome offers from shops.",
    impact: 62,
    demand: 60,
    usp: 75,
    effort: "Low",
    rationale: "Low effort, nice touch. Can collect valuable visitor data. Shops would contribute offers.",
    priority: "Low-Medium"
  },

  // === GAMIFICATION & ENGAGEMENT ===
  {
    category: "Gamification & Engagement",
    name: "Whitstable Passport / Stamp Hunt",
    description: "Visit all shops in a category to earn rewards. 'Coffee Passport' - try 10 cafes, get a prize. Seasonal hunts.",
    impact: 88,
    demand: 75,
    usp: 92,
    effort: "Medium",
    rationale: "Very high USP - unique gamification. Drives exploration. Shops love it. Events can sponsor prizes.",
    priority: "Very High"
  },
  {
    category: "Gamification & Engagement",
    name: "Challenges & Achievements",
    description: "Weekly challenges: 'Visit 3 new shops', 'Write 2 reviews', 'Attend an event'. XP system. Levels.",
    impact: 70,
    demand: 62,
    usp: 75,
    effort: "Medium",
    rationale: "Drives engagement. Builds on existing badges. May feel gimmicky to some users.",
    priority: "Medium"
  },
  {
    category: "Gamification & Engagement",
    name: "Resident vs Tourist Rivalry",
    description: "Friendly competition. Which group supports local shops more? Seasonal leaderboards.",
    impact: 55,
    demand: 48,
    usp: 80,
    effort: "Low",
    rationale: "High USP, fun concept. May be divisive. Easy to build. Good for PR/buzz.",
    priority: "Low"
  },
  {
    category: "Gamification & Engagement",
    name: "Monthly Challenges",
    description: "'Plastic-Free July' - track eco-friendly purchases. 'Shop Local September'. Community goals.",
    impact: 65,
    demand: 58,
    usp: 78,
    effort: "Low",
    rationale: "Community building. Ties into seasonal events. Low effort with high potential impact.",
    priority: "Medium"
  },

  // === SUSTAINABILITY & LOCAL ECONOMY ===
  {
    category: "Sustainability",
    name: "Carbon Footprint Tracker",
    description: "Track local vs online purchases. Show money kept local. Environmental impact visualization.",
    impact: 58,
    demand: 52,
    usp: 82,
    effort: "Medium",
    rationale: "High USP, aligns with values. Niche appeal. Good PR angle. Complex to calculate accurately.",
    priority: "Low"
  },
  {
    category: "Sustainability",
    name: "Food Waste Marketplace",
    description: "Too Good To Go style - surplus food from cafes/restaurants at discount. End-of-day deals.",
    impact: 78,
    demand: 80,
    usp: 72,
    effort: "Medium",
    rationale: "High demand, proven model. Competes with TGTG but local-only. Restaurants would join.",
    priority: "High"
  },
  {
    category: "Sustainability",
    name: "Refill Station Map",
    description: "Where to refill water bottles, bring own containers. Zero-waste shop highlights.",
    impact: 52,
    demand: 55,
    usp: 75,
    effort: "Low",
    rationale: "Low effort, feels good. Niche but growing audience. Aligns with beach town ethos.",
    priority: "Low"
  },
  {
    category: "Sustainability",
    name: "Local Producer Partnerships",
    description: "Farm shop connections. What's in season. Farm-to-table restaurant links. Producer profiles.",
    impact: 62,
    demand: 58,
    usp: 78,
    effort: "Medium",
    rationale: "Fits Whitstable food culture. Expands beyond high street. Seasonal content opportunities.",
    priority: "Medium"
  },

  // === SMART FEATURES ===
  {
    category: "Smart Features",
    name: "Weather-Based Recommendations",
    description: "Rainy day? Here's indoor activities. Sunny? Beach and outdoor cafes. Smart push notifications.",
    impact: 72,
    demand: 75,
    usp: 80,
    effort: "Low",
    rationale: "High USP, very useful. Easy to implement with weather API. Great engagement driver.",
    priority: "High"
  },
  {
    category: "Smart Features",
    name: "Crowd Levels / Busy Times",
    description: "Google-style 'busy now' for shops and beach. Best times to visit. Real-time wait times.",
    impact: 80,
    demand: 85,
    usp: 75,
    effort: "High",
    rationale: "Very useful, especially summer. Complex data collection. May need shop participation.",
    priority: "Medium-High"
  },
  {
    category: "Smart Features",
    name: "Smart Notifications",
    description: "Location-aware alerts near favourite shops. Time-sensitive offers. Not spammy - learns preferences.",
    impact: 70,
    demand: 68,
    usp: 65,
    effort: "High",
    rationale: "Modern expectation but privacy concerns. Must be done right or annoying.",
    priority: "Medium"
  },
  {
    category: "Smart Features",
    name: "Voice Assistant Integration",
    description: "'Hey Google, what's open in Whitstable?' Alexa skill. Hands-free information access.",
    impact: 45,
    demand: 35,
    usp: 70,
    effort: "Medium",
    rationale: "Novel but low demand currently. Future-proofing. Good PR value.",
    priority: "Low"
  },

  // === REVENUE & BUSINESS ===
  {
    category: "Business Features",
    name: "Premium Shop Listings",
    description: "Featured placement, analytics dashboard, priority support. Tiered pricing.",
    impact: 65,
    demand: 60,
    usp: 55,
    effort: "Low",
    rationale: "Essential for revenue. Shops expect to pay for visibility. Easy to implement.",
    priority: "High"
  },
  {
    category: "Business Features",
    name: "Shop Analytics Dashboard",
    description: "Detailed insights for shop owners. Traffic, saves, review sentiment, comparison to category.",
    impact: 72,
    demand: 78,
    usp: 65,
    effort: "Medium",
    rationale: "High value for shop owners. Differentiates from Google My Business. Retention driver.",
    priority: "High"
  },
  {
    category: "Business Features",
    name: "Review Response Tools",
    description: "Shop owners respond to reviews. Templates. Sentiment alerts. Review request prompts.",
    impact: 68,
    demand: 75,
    usp: 60,
    effort: "Low",
    rationale: "Table stakes for shop owners. Easy to add. Increases review engagement.",
    priority: "Medium"
  },
  {
    category: "Business Features",
    name: "Advertising Platform",
    description: "Promoted listings, banner ads, sponsored content. Targeted by location, interests.",
    impact: 60,
    demand: 45,
    usp: 50,
    effort: "High",
    rationale: "Revenue potential but may harm user experience. Tread carefully.",
    priority: "Low"
  }
];

// Group by category
const categories = [...new Set(features.map(f => f.category))];

// Calculate composite score
features.forEach(f => {
  f.composite = Math.round((f.impact * 0.4) + (f.demand * 0.35) + (f.usp * 0.25));
});

// Sort by composite score
const sortedFeatures = [...features].sort((a, b) => b.composite - a.composite);

// Helper functions
function getScoreColor(score) {
  if (score >= 80) return "1B5E20"; // Dark green
  if (score >= 70) return "388E3C"; // Green
  if (score >= 60) return "FFA000"; // Amber
  if (score >= 50) return "F57C00"; // Orange
  return "D32F2F"; // Red
}

function getPriorityColor(priority) {
  const colors = {
    "Very High": "1B5E20",
    "High": "388E3C",
    "High (if feasible)": "388E3C",
    "Medium-High": "689F38",
    "Medium": "FFA000",
    "Low-Medium": "F57C00",
    "Low": "D32F2F"
  };
  return colors[priority] || "757575";
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
          children: [new TextRun({ text: "Whitstable.shop Feature Roadmap", italics: true, size: 18, color: "718096" })]
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
            new TextRun({ text: " | Generated January 2026", size: 18, color: "718096" })
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
        children: [new TextRun({ text: "Feature Roadmap & Impact Analysis", size: 32, color: "475569" })]
      }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun(`This document outlines ${features.length} potential features for Whitstable.shop, scored on three dimensions:`)]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Impact (40%): ", bold: true }), new TextRun("How much will this move the needle for the platform?")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Demand (35%): ", bold: true }), new TextRun("How much do users actually want/need this?")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "USP (25%): ", bold: true }), new TextRun("How unique is this vs competitors? Does it differentiate us?")] }),

      // Top 10 Features
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Top 10 Recommended Features")] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [400, 3200, 700, 700, 700, 700, 1100],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 400, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 3200, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: "Feature", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Impact", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Demand", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "USP", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Score", bold: true, color: "FFFFFF", size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: "1a365d", type: ShadingType.CLEAR }, width: { size: 1100, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Effort", bold: true, color: "FFFFFF", size: 18 })] })] })
            ]
          }),
          ...sortedFeatures.slice(0, 10).map((f, i) => new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 400, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}`, bold: true, size: 18 })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 3200, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: f.name, bold: true, size: 18 })] }), new Paragraph({ children: [new TextRun({ text: f.category, size: 16, color: "718096" })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.impact}`, size: 18, color: getScoreColor(f.impact) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.demand}`, size: 18, color: getScoreColor(f.demand) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.usp}`, size: 18, color: getScoreColor(f.usp) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 700, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.composite}`, bold: true, size: 20, color: getScoreColor(f.composite) })] })] }),
              new TableCell({ borders, shading: { fill: i % 2 === 0 ? "F7FAFC" : "FFFFFF", type: ShadingType.CLEAR }, width: { size: 1100, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.effort, size: 18 })] })] })
            ]
          }))
        ]
      }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Quick Wins section
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Quick Wins (Low Effort, High Value)")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("Features that can be built quickly with outsized impact:")] }),
      ...features.filter(f => f.effort === "Low" || f.effort === "Low-Medium").sort((a, b) => b.composite - a.composite).slice(0, 5).map(f =>
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: `${f.name} `, bold: true }), new TextRun(`(Score: ${f.composite}) - ${f.rationale}`)] })
      ),

      // High USP section
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400 }, children: [new TextRun("Highest Differentiation (USP 80+)")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("Features that make Whitstable.shop truly unique:")] }),
      ...features.filter(f => f.usp >= 80).sort((a, b) => b.usp - a.usp).map(f =>
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: `${f.name} `, bold: true }), new TextRun(`(USP: ${f.usp}) - ${f.rationale}`)] })
      ),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Full feature list by category
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Complete Feature Analysis")] }),

      // Generate sections for each category
      ...categories.flatMap(category => {
        const categoryFeatures = features.filter(f => f.category === category).sort((a, b) => b.composite - a.composite);
        return [
          new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(category)] }),
          ...categoryFeatures.flatMap(f => [
            new Paragraph({
              shading: { fill: "F0F9FF", type: ShadingType.CLEAR },
              spacing: { before: 200 },
              children: [
                new TextRun({ text: f.name, bold: true, size: 24 }),
                new TextRun({ text: `  [Score: ${f.composite}]`, size: 20, color: getScoreColor(f.composite) })
              ]
            }),
            new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: f.description, size: 20, color: "4a5568" })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnWidths: [1870, 1870, 1870, 1870, 1870],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1870, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Impact", size: 16, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.impact}`, bold: true, size: 22, color: getScoreColor(f.impact) })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1870, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Demand", size: 16, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.demand}`, bold: true, size: 22, color: getScoreColor(f.demand) })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1870, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "USP", size: 16, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${f.usp}`, bold: true, size: 22, color: getScoreColor(f.usp) })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1870, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Effort", size: 16, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.effort, bold: true, size: 22 })] })] }),
                    new TableCell({ borders, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, width: { size: 1870, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Priority", size: 16, color: "4a5568" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.priority, bold: true, size: 22, color: getPriorityColor(f.priority) })] })] })
                  ]
                })
              ]
            }),
            new Paragraph({ spacing: { before: 80, after: 200 }, children: [new TextRun({ text: "Rationale: ", bold: true, italics: true, size: 18 }), new TextRun({ text: f.rationale, italics: true, size: 18, color: "64748b" })] })
          ])
        ];
      }),

      // Page break for summary
      new Paragraph({ children: [new PageBreak()] }),

      // Implementation Roadmap
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Recommended Implementation Roadmap")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 1: Foundation (Months 1-2)")] }),
      new Paragraph({ children: [new TextRun("Focus on high-impact, lower-effort features that establish platform value:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Service Directory (Trades) ", bold: true }), new TextRun("- Extremely high demand, fills major gap")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Loyalty Card System ", bold: true }), new TextRun("- Unique differentiator, drives repeat visits")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Weather-Based Recommendations ", bold: true }), new TextRun("- Low effort, high engagement quick win")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 2: Growth (Months 3-4)")] }),
      new Paragraph({ children: [new TextRun("Add features that create stickiness and community:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Local Marketplace ", bold: true }), new TextRun("- High demand, competes with Facebook groups")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Whitstable Passport / Stamp Hunt ", bold: true }), new TextRun("- Gamification that drives exploration")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Kids Activities Hub ", bold: true }), new TextRun("- Captures family demographic")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 3: Monetisation (Months 5-6)")] }),
      new Paragraph({ children: [new TextRun("Enable revenue generation:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Whitstable Gift Card / Wallet ", bold: true }), new TextRun("- Revenue from float, keeps money local")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Premium Shop Listings ", bold: true }), new TextRun("- B2B revenue stream")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Booking System for Classes ", bold: true }), new TextRun("- Transaction fees potential")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 4: Expansion (Months 7+)")] }),
      new Paragraph({ children: [new TextRun("Advanced features and ecosystem growth:")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Day Trip Planner ", bold: true }), new TextRun("- Tourism draw, shareable content")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Food Waste Marketplace ", bold: true }), new TextRun("- Sustainability angle, proven model")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 400 }, children: [new TextRun({ text: "Tide-Synced Beach Activities ", bold: true }), new TextRun("- Unique coastal town feature")] }),

      // Final notes
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Scoring Methodology")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Each feature was evaluated on three dimensions, weighted by strategic importance:")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Impact (40%): ", bold: true }), new TextRun("Revenue potential, user growth, engagement lift, strategic value")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Demand (35%): ", bold: true }), new TextRun("User research, competitor analysis, community requests, market trends")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "USP (25%): ", bold: true }), new TextRun("Uniqueness vs existing solutions, defensibility, local-first advantage")] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Composite Score = (Impact × 0.4) + (Demand × 0.35) + (USP × 0.25)", bold: true })] }),

      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "— End of Document —", color: "94a3b8", size: 20 })] })
    ]
  }]
});

// Generate document
Packer.toBuffer(doc).then(buffer => {
  const outputPath = '/sessions/trusting-eloquent-gauss/mnt/whitshop/whitstable-shop/docs/Feature-Roadmap-2026.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log('Document created:', outputPath);
  console.log(`Total features analyzed: ${features.length}`);
  console.log(`Top 3 features by composite score:`);
  sortedFeatures.slice(0, 3).forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.name} (${f.composite})`);
  });
});
