# Whitstable.shop - Comprehensive Codebase Analysis

> **Generated:** January 2026
> **Analyst:** Claude Code
> **Repository:** whitstable-shop

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Tech Stack Breakdown](#tech-stack-breakdown)
3. [Directory Structure](#directory-structure)
4. [File-by-File Reference](#file-by-file-reference)
5. [Architecture Diagram](#architecture-diagram)
6. [Data Models](#data-models)
7. [API Reference](#api-reference)
8. [Component Library](#component-library)
9. [Third-Party Integrations](#third-party-integrations)
10. [Potential Issues](#potential-issues)
11. [Recommended Improvements](#recommended-improvements)

---

## Executive Summary

**Whitstable.shop** is a local business directory and community platform for Whitstable, Kent, UK. It provides residents and visitors with a comprehensive guide to local independent shops, restaurants, cafes, events, and community activities.

### Core Purpose
- **Business Directory**: Discover and explore local shops with detailed listings, reviews, and ratings
- **Event Calendar**: Find local events, festivals, and community gatherings
- **Community Features**: Q&A system, awards/recognition, charity support, and photo competitions
- **Local Information**: Tide times, parking, emergency contacts, and other essential info
- **Shop Owner Tools**: Dashboard for business owners to manage their listings

### Target Users
1. **Residents**: Local Whitstable residents looking for shops, events, and community engagement
2. **Visitors**: Tourists seeking authentic local experiences
3. **Shop Owners**: Local business owners managing their online presence

### Current State
The application is a **functional MVP** with mock data throughout. The infrastructure is in place for Supabase integration, but most pages currently use hardcoded mock data pending database connection.

---

## Tech Stack Breakdown

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router |
| **React** | 19.x | UI component library |
| **TypeScript** | 5.x | Type safety and developer experience |

### Styling
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework |
| **PostCSS** | CSS processing |
| Custom color palette: `sky`, `coral`, `ink`, `oyster`, etc.

### Backend/Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database + Authentication |
| **@supabase/supabase-js** | JavaScript client |
| **@supabase/ssr** | Server-side rendering support |

### External Services
| Service | Purpose |
|---------|---------|
| **Mapbox** | Interactive maps |
| **Google OAuth** | Social authentication |
| **Plausible/Umami** | Privacy-focused analytics (planned) |

### Development Dependencies
| Package | Purpose |
|---------|---------|
| **ESLint** | Code linting |
| **lucide-react** | Icon library |
| **clsx/tailwind-merge** | Conditional classnames |
| **date-fns** | Date formatting |

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anonymous key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=        # Mapbox access token

# Analytics (planned)
NEXT_PUBLIC_ANALYTICS_ID=        # Analytics tracking ID
```

---

## Directory Structure

```
whitstable-shop/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── nominations/route.ts  # Award nominations
│   │   ├── reviews/route.ts      # Shop reviews
│   │   ├── shops/route.ts        # Shop CRUD
│   │   ├── trending/route.ts     # Trending shops
│   │   └── views/route.ts        # View tracking
│   ├── admin/                    # Admin panel pages
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── nominations/page.tsx  # Manage nominations
│   │   ├── notices/page.tsx      # Manage notices
│   │   ├── reviews/page.tsx      # Moderate reviews
│   │   └── shops/page.tsx        # Manage shops
│   ├── auth/                     # Authentication
│   │   ├── callback/route.ts     # OAuth callback
│   │   ├── login/page.tsx        # Login page
│   │   └── signup/page.tsx       # Signup page
│   ├── ask/                      # Q&A feature
│   │   ├── page.tsx              # Questions list
│   │   └── [id]/page.tsx         # Question detail
│   ├── awards/page.tsx           # Community awards
│   ├── community/                # Community hub
│   │   ├── page.tsx              # Main community page
│   │   └── charities/page.tsx    # Local charities
│   ├── dashboard/                # Shop owner dashboard
│   │   ├── page.tsx              # Dashboard home
│   │   ├── events/page.tsx       # Manage events
│   │   └── shop/page.tsx         # Edit shop details
│   ├── events/page.tsx           # Events calendar
│   ├── info/                     # Local information
│   │   ├── page.tsx              # Info categories
│   │   └── [slug]/page.tsx       # Info detail pages
│   ├── leaderboard/page.tsx      # Shop rankings
│   ├── map/page.tsx              # Interactive map
│   ├── nominate/page.tsx         # Nomination form
│   ├── offers/page.tsx           # Deals & offers
│   ├── photos/                   # Photo competition
│   │   ├── page.tsx              # Gallery
│   │   ├── [id]/page.tsx         # Photo detail
│   │   ├── competition/page.tsx  # Competition info
│   │   ├── submit/page.tsx       # Submit photo
│   │   └── winners/page.tsx      # Past winners
│   ├── privacy/page.tsx          # Privacy policy
│   ├── report/page.tsx           # Report issues
│   ├── saved/page.tsx            # Saved shops
│   ├── search/page.tsx           # Search page
│   ├── settings/                 # User settings
│   │   ├── notifications/page.tsx
│   │   └── profile/page.tsx
│   ├── shops/                    # Shop listings
│   │   ├── page.tsx              # Shop list
│   │   └── [slug]/page.tsx       # Shop detail
│   ├── terms/page.tsx            # Terms of service
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── robots.ts                 # Robots.txt
│   └── sitemap.ts                # Dynamic sitemap
│
├── components/                   # React components
│   ├── auth/                     # Auth components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── charity/                  # Charity components
│   │   ├── CharityCard.tsx
│   │   ├── CharityEventCard.tsx
│   │   └── index.ts
│   ├── home/                     # Homepage components
│   │   ├── CTABanner.tsx
│   │   ├── CommunitySection.tsx
│   │   ├── DealsPreview.tsx
│   │   ├── EventsScroll.tsx
│   │   ├── FeaturedShop.tsx
│   │   ├── FeedList.tsx
│   │   ├── Hero.tsx
│   │   ├── HubButtons.tsx
│   │   ├── LocalInfoGrid.tsx
│   │   ├── MapPreview.tsx
│   │   ├── Notice.tsx
│   │   └── TrendingList.tsx
│   ├── layout/                   # Layout components
│   │   ├── BottomNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── MobileWrapper.tsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   └── index.ts
│   ├── offers/
│   │   ├── OfferCard.tsx
│   │   └── index.ts
│   ├── photos/                   # Photo components
│   │   ├── CompetitionBanner.tsx
│   │   ├── PhotoCard.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── PhotoModal.tsx
│   │   ├── PhotoSubmitForm.tsx
│   │   ├── VoteButton.tsx
│   │   ├── WinnerCard.tsx
│   │   └── index.ts
│   ├── questions/
│   │   ├── AnswerCard.tsx
│   │   ├── AskQuestionForm.tsx
│   │   ├── QuestionCard.tsx
│   │   └── index.ts
│   ├── reports/
│   │   ├── ReportForm.tsx
│   │   └── index.ts
│   ├── reviews/
│   │   ├── ReviewCard.tsx
│   │   └── ReviewForm.tsx
│   ├── seo/                      # SEO utilities
│   │   ├── MetaTags.tsx
│   │   └── StructuredData.tsx
│   ├── shops/
│   │   ├── ShopActions.tsx
│   │   ├── ShopCard.tsx
│   │   ├── ShopContact.tsx
│   │   ├── ShopHero.tsx
│   │   ├── ShopHours.tsx
│   │   ├── ShopList.tsx
│   │   ├── ShopMap.tsx
│   │   └── ShopReviews.tsx
│   ├── ui/                       # UI primitives
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Countdown.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Select.tsx
│   │   ├── Tabs.tsx
│   │   ├── Textarea.tsx
│   │   └── index.ts
│   ├── PWAPrompt.tsx
│   └── ShareButton.tsx
│
├── database/                     # SQL schemas
│   ├── awards-schema.sql         # Awards system
│   ├── engagement-schema.sql     # Engagement tracking
│   └── migrations/
│       └── 001_schema_reconciliation.sql
│
├── lib/                          # Utilities
│   ├── analytics.ts              # Analytics helper
│   ├── constants.ts              # App constants
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── middleware.ts         # Auth middleware
│   │   └── server.ts             # Server client
│   └── utils.ts                  # Helper functions
│
├── public/
│   └── seagull.svg               # Mascot image
│
├── types/                        # TypeScript types
│   ├── database.ts               # Database types
│   └── index.ts                  # App types
│
├── .env.local.example            # Environment template
├── .eslintrc.json                # ESLint config
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

---

## File-by-File Reference

### App Layer (`/app`)

#### `app/layout.tsx`
**Purpose:** Root layout wrapper for the entire application.

**Key Features:**
- Sets up `<html>` and `<body>` tags
- Applies global font (Inter)
- Includes global CSS
- Provides viewport and metadata configuration

**Dependencies:** None (root component)

**Data Flow:** Wraps all pages, passes children through

---

#### `app/page.tsx`
**Purpose:** Homepage - the main entry point for users.

**Key Features:**
- Hero section with tide widget
- Hub navigation buttons
- Trending shops list
- Featured shop highlight
- Community section
- Footer

**Components Used:**
- `MobileWrapper`
- `Hero`
- `HubButtons`
- `TrendingList`
- `FeaturedShop`
- `CommunitySection`
- `Footer`
- `BottomNav`

**Data Flow:** Uses mock data for trending shops and featured shop. Will fetch from Supabase API in production.

---

#### `app/shops/page.tsx`
**Purpose:** Shop listing page with category filtering.

**Key Features:**
- Category filter bar
- Grid layout of shop cards
- Responsive design

**Components Used:**
- `MobileWrapper`
- `BottomNav`
- `ShopList`

**Data Flow:** Mock shop data with category filtering. Expects `shops` and `categories` from database.

---

#### `app/shops/[slug]/page.tsx`
**Purpose:** Individual shop detail page.

**Key Features:**
- Hero image gallery
- Shop info (name, tagline, description)
- Contact information
- Opening hours
- Location map
- Reviews section
- Save/bookmark functionality

**Components Used:**
- `MobileWrapper`
- `BottomNav`
- `Badge`
- Shop-specific components

**Data Flow:**
- **Input:** Slug from URL params
- **Output:** Shop details, reviews, images
- Calls `/api/views` to track page views

---

#### `app/map/page.tsx`
**Purpose:** Interactive map view of all shops.

**Key Features:**
- Mapbox GL integration
- Category filtering
- Custom markers with category colors
- Shop info popup on marker click
- Error/loading states

**External Dependencies:**
- `mapbox-gl` library
- `NEXT_PUBLIC_MAPBOX_TOKEN` environment variable

**State Management:**
- `selectedCategory` - filter state
- `selectedShop` - popup state
- `mapLoaded` / `mapError` - loading states

---

#### `app/search/page.tsx`
**Purpose:** Search functionality for shops.

**Key Features:**
- Text search input
- Category filter pills
- Results count display
- Empty state handling

**State Management:**
- `query` - search text
- `selectedCategory` - filter

**Data Flow:** Client-side filtering of mock data. Production should use server-side search.

---

#### `app/events/page.tsx`
**Purpose:** Events calendar showing upcoming events.

**Key Features:**
- Events grouped by month
- Date badge display
- Recurring event indicators
- Event location and time

**Data Flow:** Uses mock events data. Production should fetch from `events` table.

---

#### `app/auth/login/page.tsx` & `app/auth/signup/page.tsx`
**Purpose:** User authentication pages.

**Key Features:**
- Email/password authentication
- Google OAuth integration
- Redirect handling after auth
- Form validation

**External Dependencies:**
- Supabase Auth

**Data Flow:**
1. User submits credentials
2. Calls Supabase auth methods
3. On success, redirects to previous page or home
4. Session stored in cookies via middleware

---

#### `app/auth/callback/route.ts`
**Purpose:** OAuth callback handler.

**Key Features:**
- Exchanges auth code for session
- Handles redirect after OAuth

**Data Flow:**
1. OAuth provider redirects here with code
2. Exchange code for session
3. Redirect to intended destination

---

### API Routes (`/app/api`)

#### `app/api/shops/route.ts`
**Purpose:** Shop CRUD operations.

**Methods:**
- `GET` - Fetch shops (with optional filters)
- `POST` - Create new shop (requires auth)

**Query Parameters:**
- `featured` - Get featured shops only
- `category` - Filter by category slug
- `limit` - Pagination limit

---

#### `app/api/reviews/route.ts`
**Purpose:** Review management.

**Methods:**
- `GET` - Fetch reviews for a shop
- `POST` - Submit new review (requires auth)

**Query Parameters:**
- `shop_id` - Required for GET

**Body (POST):**
```typescript
{
  shop_id: string;
  rating: number;
  comment?: string;
}
```

---

#### `app/api/nominations/route.ts`
**Purpose:** Award nomination submissions.

**Methods:**
- `POST` - Submit nomination

**Body:**
```typescript
{
  nominee_name: string;
  category: 'hospitality_star' | 'community_hero';
  reason: string;
  submitter_name?: string;
  submitter_email?: string;
}
```

---

#### `app/api/views/route.ts`
**Purpose:** Track shop page views.

**Methods:**
- `POST` - Increment view count

**Body:**
```typescript
{
  shop_id: string;
}
```

---

#### `app/api/trending/route.ts`
**Purpose:** Get trending shops based on engagement.

**Methods:**
- `GET` - Fetch trending shops

**Response:**
```typescript
{
  shops: Array<{
    id: string;
    name: string;
    slug: string;
    reason: string;  // e.g., "12 new reviews"
  }>;
}
```

---

### Components Layer (`/components`)

#### Layout Components

##### `components/layout/MobileWrapper.tsx`
**Purpose:** Constrains content to mobile-width viewport (430px max).

**Props:**
```typescript
interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;  // Adds bottom padding for nav
}
```

---

##### `components/layout/Header.tsx`
**Purpose:** Top header with logo and hamburger menu.

**Features:**
- Logo link to homepage
- Slide-out menu panel
- Menu sections: Discover, Community, Account
- Menu state management

**Props:**
```typescript
interface HeaderProps {
  variant?: 'default' | 'transparent';
  showMenu?: boolean;
}
```

---

##### `components/layout/BottomNav.tsx`
**Purpose:** Fixed bottom navigation bar.

**Navigation Items:**
- Home (`/`)
- Search (`/search`)
- Map (`/map`)
- Saved (`/saved`)

**Features:**
- Active state highlighting
- Icon + label display

---

##### `components/layout/Footer.tsx`
**Purpose:** Site footer with links.

**Sections:**
- Explore links
- Community links
- Account links
- Legal links
- Copyright notice

---

#### UI Components (`/components/ui`)

##### `Button.tsx`
**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'coral' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

---

##### `Card.tsx`
**Props:**
```typescript
interface CardProps {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'outlined';
}
```

---

##### `Badge.tsx`
**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'sky' | 'coral' | 'green' | 'yellow' | 'grey' |
            'success' | 'warning' | 'info' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}
```

---

##### `Input.tsx`
**Props:**
```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
}
```

---

##### `Modal.tsx`
**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

---

##### `Tabs.tsx`
**Components:**
- `Tabs` - Context provider
- `TabsList` - Tab button container
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab panel content

**Usage:**
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

##### `Avatar.tsx`
**Props:**
```typescript
interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;  // Used to generate initials
}
```

---

##### `Countdown.tsx`
**Purpose:** Countdown timer component.

**Props:**
```typescript
interface CountdownProps {
  targetDate: Date | string;
  onComplete?: () => void;
  variant?: 'default' | 'compact';
}
```

---

##### `ProgressBar.tsx`
**Props:**
```typescript
interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}
```

---

##### `EmptyState.tsx`
**Props:**
```typescript
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

### Library Layer (`/lib`)

#### `lib/utils.ts`
**Purpose:** Utility functions used throughout the app.

**Key Functions:**
```typescript
// Classname merging
cn(...classes): string

// Date formatting
formatDate(date: string, format: string): string
formatRelativeTime(date: string): string
getRelativeTime(date: string): string

// Opening hours
isCurrentlyOpen(hours: OpeningHours | null): { isOpen: boolean; message: string }

// Currency
formatCurrency(amount: number): string

// Calculations
getPercentage(value: number, total: number): number

// Text
pluralize(count: number, singular: string): string
```

---

#### `lib/constants.ts`
**Purpose:** Application-wide constants.

**Contents:**
```typescript
// Category slugs and colors
CATEGORIES: { id, name, slug, icon }[]
CATEGORY_COLORS: Record<string, string>

// Shop status options
SHOP_STATUSES: string[]

// Engagement weights
ENGAGEMENT_WEIGHTS: Record<string, number>
```

---

#### `lib/analytics.ts`
**Purpose:** Analytics tracking utilities.

**Functions:**
```typescript
trackEvent(event: string, properties?: object): void
trackPageView(path: string): void
```

---

#### `lib/supabase/client.ts`
**Purpose:** Browser-side Supabase client.

```typescript
export function createClient(): SupabaseClient
```

---

#### `lib/supabase/server.ts`
**Purpose:** Server-side Supabase client with cookie handling.

```typescript
export async function createClient(): Promise<SupabaseClient>
```

---

#### `lib/supabase/middleware.ts`
**Purpose:** Supabase middleware for session management.

```typescript
export async function updateSession(request: NextRequest): Promise<NextResponse>
```

---

### Types Layer (`/types`)

#### `types/index.ts`
**Core Application Types:**

```typescript
// Shop
interface Shop {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category_id: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address_line1: string;
  address_line2: string | null;
  postcode: string;
  latitude: number;
  longitude: number;
  opening_hours: OpeningHours | null;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  view_count: number;
  save_count: number;
  created_at: string;
  updated_at: string;
}

// Category
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
}

// Review
interface Review {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  author_name: string;
  author_postcode: string;
  created_at: string;
}

// Event
interface Event {
  id: string;
  shop_id: string | null;
  title: string;
  description: string;
  date: string;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// OpeningHours
interface OpeningHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}
```

---

#### `types/database.ts`
**Extended Database Types:**

```typescript
// Profile
interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  postcode: string | null;
  is_local: boolean;
  points: number;
  created_at: string;
}

// Charity
interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  donation_url: string | null;
  current_campaign: string | null;
  target_amount: number | null;
  raised_amount: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

// Offer
interface Offer {
  id: string;
  shop_id: string;
  title: string;
  description: string | null;
  valid_from: string;
  valid_until: string | null;
  is_ongoing: boolean;
  terms: string | null;
  offer_type: 'discount' | 'freebie' | 'bundle' | 'loyalty' | 'event' | 'other';
  is_active: boolean;
  view_count: number;
  created_at: string;
}

// Question
interface Question {
  id: string;
  user_id: string;
  question: string;
  context: string | null;
  status: 'open' | 'answered' | 'closed';
  answer_count: number;
  view_count: number;
  created_at: string;
}

// Answer
interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  answer: string;
  upvotes: number;
  is_accepted: boolean;
  created_at: string;
}

// Photo
interface Photo {
  id: string;
  user_id: string;
  shop_id: string | null;
  image_url: string;
  caption: string | null;
  vote_count: number;
  is_winner: boolean;
  competition_month: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'winner';
  created_at: string;
}

// Nomination
interface Nomination {
  id: string;
  nominee_name: string;
  nominee_business: string | null;
  category: 'hospitality_star' | 'community_hero';
  reason: string;
  submitter_name: string | null;
  submitter_email: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'winner';
  award_month: string | null;
  created_at: string;
}

// ShopWeeklyStats
interface ShopWeeklyStats {
  id: string;
  shop_id: string;
  week_start: string;
  view_count: number;
  save_count: number;
  review_count: number;
  photo_count: number;
  click_count: number;
  engagement_score: number;
  rank: number | null;
  rank_change: number | null;
}

// ShopBadge
interface ShopBadge {
  id: string;
  shop_id: string;
  badge_type: string;
  awarded_at: string;
  expires_at: string | null;
}

// Badge types
const SHOP_BADGES = {
  trending_weekly: { label: 'Trending', description: 'Top 10 this week' },
  review_star: { label: 'Review Star', description: 'Excellent reviews' },
  most_saved: { label: 'Most Saved', description: 'Highly bookmarked' },
  new_favourite: { label: 'Rising Star', description: 'New & popular' },
  local_legend: { label: 'Local Legend', description: 'Community favourite' },
  photo_favourite: { label: 'Photogenic', description: 'Most photographed' },
  community_choice: { label: 'Community Choice', description: 'Voted by locals' },
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Browser   │  │   Mobile    │  │    PWA      │  │   Mapbox    │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │           │
└─────────┼────────────────┼────────────────┼────────────────┼───────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APP ROUTER                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         PAGES (app/)                             │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │  Home   │ │  Shops  │ │  Events │ │   Map   │ │  Admin  │   │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │   │
│  │       │           │           │           │           │        │   │
│  └───────┼───────────┼───────────┼───────────┼───────────┼────────┘   │
│          │           │           │           │           │            │
│  ┌───────┼───────────┼───────────┼───────────┼───────────┼────────┐   │
│  │       ▼           ▼           ▼           ▼           ▼        │   │
│  │                    COMPONENTS (components/)                     │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │   │
│  │  │   UI    │ │  Layout │ │  Shops  │ │ Features│              │   │
│  │  │ Button  │ │ Header  │ │ShopCard │ │CharityC │              │   │
│  │  │  Card   │ │BottomNav│ │ShopList │ │OfferC  │              │   │
│  │  │  Badge  │ │MobileWrp│ │ShopHero │ │PhotoC  │              │   │
│  │  │  Modal  │ │ Footer  │ │ShopMap  │ │ReviewC │              │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     API ROUTES (app/api/)                        │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │  shops  │ │ reviews │ │  views  │ │trending │ │nominat. │   │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │   │
│  └───────┼───────────┼───────────┼───────────┼───────────┼────────┘   │
│          │           │           │           │           │            │
└──────────┼───────────┼───────────┼───────────┼───────────┼────────────┘
           │           │           │           │           │
           ▼           ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            LIB LAYER (lib/)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   utils.ts  │  │ constants.ts│  │ analytics.ts│  │  supabase/  │    │
│  │  - cn()     │  │ - CATEGORIES│  │ - trackEvent│  │  - client   │    │
│  │  - format() │  │ - COLORS    │  │ - trackPage │  │  - server   │    │
│  │  - isOpen() │  │ - WEIGHTS   │  │             │  │  - midware  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────┬──────┘    │
│                                                            │           │
└────────────────────────────────────────────────────────────┼───────────┘
                                                             │
                                                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE LAYER                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        PostgreSQL Database                       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │  shops  │ │ reviews │ │profiles │ │ events  │ │ photos  │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │categori │ │charities│ │ offers  │ │questions│ │nominat. │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────┐  ┌───────────────────────────┐         │
│  │        Supabase Auth      │  │      Storage (images)     │         │
│  │   - Email/Password        │  │   - Shop images           │         │
│  │   - Google OAuth          │  │   - Profile avatars       │         │
│  │   - Session management    │  │   - Photo submissions     │         │
│  └───────────────────────────┘  └───────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   profiles   │       │    shops     │       │  categories  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ user_id (FK) │       │ owner_id(FK)─┼───────│ name         │
│ display_name │       │ name         │       │ slug         │
│ avatar_url   │       │ slug         │       │ icon         │
│ is_local     │       │ category_id──┼───────│ display_order│
│ points       │       │ status       │       └──────────────┘
└──────┬───────┘       │ is_featured  │
       │               │ view_count   │
       │               └──────┬───────┘
       │                      │
       │    ┌─────────────────┼─────────────────┐
       │    │                 │                 │
       │    ▼                 ▼                 ▼
       │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │ │   reviews    │ │   events     │ │   offers     │
       │ ├──────────────┤ ├──────────────┤ ├──────────────┤
       │ │ id (PK)      │ │ id (PK)      │ │ id (PK)      │
       └─│ user_id (FK) │ │ shop_id (FK) │ │ shop_id (FK) │
         │ shop_id (FK) │ │ title        │ │ title        │
         │ rating       │ │ date         │ │ offer_type   │
         │ comment      │ │ location     │ │ valid_until  │
         │ status       │ │ is_recurring │ │ is_ongoing   │
         └──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  questions   │       │   answers    │       │   photos     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ question_id  │       │ id (PK)      │
│ user_id (FK) │       │ user_id (FK) │       │ user_id (FK) │
│ question     │       │ answer       │       │ shop_id (FK) │
│ status       │       │ upvotes      │       │ image_url    │
│ answer_count │       │ is_accepted  │       │ vote_count   │
└──────────────┘       └──────────────┘       │ is_winner    │
                                              └──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  charities   │       │charity_events│       │ nominations  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ charity_id   │       │ id (PK)      │
│ name         │       │ title        │       │ nominee_name │
│ slug         │       │ date         │       │ category     │
│ description  │       │ location     │       │ reason       │
│ target_amount│       │ signup_url   │       │ status       │
│ raised_amount│       │ event_type   │       │ award_month  │
└──────────────┘       └──────────────┘       └──────────────┘

┌──────────────────┐   ┌──────────────────┐
│ shop_weekly_stats│   │   shop_badges    │
├──────────────────┤   ├──────────────────┤
│ id (PK)          │   │ id (PK)          │
│ shop_id (FK)     │   │ shop_id (FK)     │
│ week_start       │   │ badge_type       │
│ view_count       │   │ awarded_at       │
│ engagement_score │   │ expires_at       │
│ rank             │   └──────────────────┘
│ rank_change      │
└──────────────────┘
```

---

## API Reference

### Shops API

#### GET /api/shops
Retrieve shop listings.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `featured` | boolean | Filter to featured shops only |
| `category` | string | Filter by category slug |
| `status` | string | Filter by status (admin only) |
| `limit` | number | Max results (default: 50) |
| `offset` | number | Pagination offset |

**Response:**
```json
{
  "shops": [
    {
      "id": "uuid",
      "name": "Shop Name",
      "slug": "shop-name",
      "tagline": "Short tagline",
      "category": { "id": "uuid", "name": "Category" },
      "status": "approved",
      "is_featured": true
    }
  ],
  "total": 100
}
```

#### POST /api/shops
Create a new shop (requires authentication).

**Request Body:**
```json
{
  "name": "Shop Name",
  "tagline": "Short tagline",
  "description": "Full description",
  "category_id": "uuid",
  "phone": "01234567890",
  "address_line1": "123 High Street",
  "postcode": "CT5 1AB"
}
```

---

### Reviews API

#### GET /api/reviews
Get reviews for a shop.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `shop_id` | string | Yes | Shop UUID |
| `status` | string | No | Filter by status |

#### POST /api/reviews
Submit a review.

**Request Body:**
```json
{
  "shop_id": "uuid",
  "rating": 5,
  "comment": "Great shop!"
}
```

---

### Views API

#### POST /api/views
Track a page view.

**Request Body:**
```json
{
  "shop_id": "uuid"
}
```

---

### Trending API

#### GET /api/trending
Get trending shops.

**Response:**
```json
{
  "shops": [
    {
      "id": "uuid",
      "name": "Shop Name",
      "slug": "shop-name",
      "reason": "12 new reviews this week"
    }
  ]
}
```

---

### Nominations API

#### POST /api/nominations
Submit an award nomination.

**Request Body:**
```json
{
  "nominee_name": "John Smith",
  "category": "hospitality_star",
  "reason": "Always provides excellent service",
  "submitter_name": "Jane Doe",
  "submitter_email": "jane@example.com"
}
```

---

## Component Library

### UI Primitives

| Component | Description | Variants |
|-----------|-------------|----------|
| `Button` | Action button | primary, secondary, coral, ghost, outline |
| `Card` | Content container | default, info, success, warning, error, outlined |
| `Badge` | Status indicator | default, sky, coral, green, yellow, grey, success, warning, info, danger, outline |
| `Input` | Text input | With label, error, helper text |
| `Textarea` | Multi-line input | With label, error, helper text |
| `Select` | Dropdown select | With label, error, options |
| `Avatar` | User avatar | sm, md, lg, xl sizes |
| `Modal` | Dialog overlay | sm, md, lg, xl, full sizes |
| `Tabs` | Tab navigation | With TabsList, TabsTrigger, TabsContent |
| `ProgressBar` | Progress indicator | default, success, warning, danger |
| `Countdown` | Timer display | default, compact |
| `EmptyState` | Empty content | With icon, title, description, action |

### Layout Components

| Component | Description |
|-----------|-------------|
| `MobileWrapper` | Constrains to mobile width |
| `Header` | Top navigation with menu |
| `Footer` | Site footer |
| `BottomNav` | Fixed bottom navigation |

### Feature Components

| Component | Purpose |
|-----------|---------|
| `ShopCard` | Shop listing card |
| `ShopList` | Grid of shop cards |
| `ShopHero` | Shop detail header |
| `ReviewCard` | Single review display |
| `OfferCard` | Offer/deal display |
| `CharityCard` | Charity listing |
| `AnswerCard` | Q&A answer display |
| `LeaderboardTable` | Shop rankings table |
| `PhotoCard` | Photo gallery item |

---

## Third-Party Integrations

### Supabase

**Purpose:** Database, Authentication, Storage

**Configuration:**
```typescript
// lib/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Usage:**
- User authentication (email/password, Google OAuth)
- Database queries (shops, reviews, events, etc.)
- Real-time subscriptions (planned)
- File storage for images

---

### Mapbox

**Purpose:** Interactive maps

**Configuration:**
```typescript
// In map component
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
```

**Usage:**
- Main map page (`/map`)
- Shop location maps
- Custom markers with category colors

**Features Used:**
- `mapbox-gl` library
- Light v11 style
- Custom marker elements
- Fly-to animations
- Attribution control

---

### Google OAuth

**Purpose:** Social sign-in

**Flow:**
1. User clicks "Continue with Google"
2. Redirect to Google OAuth
3. Return to `/auth/callback`
4. Exchange code for session
5. Redirect to intended page

---

## Potential Issues

### Critical Issues

1. **Mock Data Throughout**
   - **Impact:** Application not functional with real data
   - **Location:** Most page components
   - **Fix:** Replace mock data with Supabase queries

2. **No Error Boundaries**
   - **Impact:** Unhandled errors crash entire app
   - **Location:** All components
   - **Fix:** Add React error boundaries at key points

3. **Missing Input Validation**
   - **Impact:** Potential XSS, SQL injection if Supabase RLS not configured
   - **Location:** API routes, forms
   - **Fix:** Add Zod/Yup validation schemas

### High Priority Issues

4. **No Loading States**
   - **Impact:** Poor UX during data fetching
   - **Location:** Pages with data fetching
   - **Fix:** Add Suspense boundaries and loading.tsx files

5. **Hardcoded Whitstable Coordinates**
   - **Impact:** Map always centered on Whitstable
   - **Location:** `app/map/page.tsx:30`
   - **Note:** This is likely intentional for this specific app

6. **No Image Optimization for External URLs**
   - **Impact:** Missing blur placeholders, slow loading
   - **Location:** `next.config.mjs`
   - **Fix:** Configure `remotePatterns` for image domains

### Medium Priority Issues

7. **Inconsistent Styling Approach**
   - **Impact:** Maintenance difficulty
   - **Some components use Tailwind classes directly, others use `cn()` utility
   - **Fix:** Standardize approach

8. **No Rate Limiting**
   - **Impact:** API abuse potential
   - **Location:** All API routes
   - **Fix:** Add rate limiting middleware

9. **Missing Accessibility**
   - **Impact:** Not usable by screen readers
   - **Location:** Various components
   - **Fix:** Add ARIA labels, keyboard navigation

10. **No Tests**
    - **Impact:** Regression risk
    - **Fix:** Add unit and integration tests

### Low Priority Issues

11. **Duplicate Code in Components**
    - **Impact:** Maintenance burden
    - **Example:** SVG icons repeated inline
    - **Fix:** Create icon component library

12. **No Internationalization**
    - **Impact:** English-only
    - **Fix:** Add i18n if multi-language needed

---

## Recommended Improvements

### Immediate (Before Launch)

1. **Connect Supabase**
   ```typescript
   // Replace mock data patterns like:
   const mockShops = [...]

   // With:
   const { data: shops } = await supabase
     .from('shops')
     .select('*, category:categories(*)')
     .eq('status', 'approved')
   ```

2. **Add Loading States**
   ```typescript
   // Create app/shops/loading.tsx
   export default function Loading() {
     return <ShopListSkeleton />
   }
   ```

3. **Environment Validation**
   ```typescript
   // lib/env.ts
   import { z } from 'zod'

   const envSchema = z.object({
     NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
     NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
     NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1),
   })

   export const env = envSchema.parse(process.env)
   ```

4. **Add Error Boundaries**
   ```typescript
   // app/error.tsx
   'use client'

   export default function Error({ error, reset }) {
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={() => reset()}>Try again</button>
       </div>
     )
   }
   ```

### Short-term (First Month)

5. **Implement Search**
   - Full-text search with Supabase
   - Debounced input
   - Category + text combined filtering

6. **Add Authentication Guards**
   ```typescript
   // middleware.ts
   export async function middleware(request: NextRequest) {
     const { pathname } = request.nextUrl

     const protectedRoutes = ['/dashboard', '/settings', '/admin']
     if (protectedRoutes.some(route => pathname.startsWith(route))) {
       const session = await getSession(request)
       if (!session) {
         return NextResponse.redirect(new URL('/auth/login', request.url))
       }
     }
   }
   ```

7. **Optimize Images**
   ```javascript
   // next.config.mjs
   const nextConfig = {
     images: {
       remotePatterns: [
         { hostname: '*.supabase.co' },
         { hostname: 'images.unsplash.com' },
       ],
     },
   }
   ```

8. **Add PWA Support**
   - Service worker
   - Manifest file
   - Offline support for saved shops

### Medium-term (First Quarter)

9. **Real-time Features**
   - Live review updates
   - Real-time leaderboard
   - Notification system

10. **Analytics Dashboard**
    - Shop owner insights
    - View/save/review trends
    - Competitor benchmarking

11. **Advanced Search**
    - Geo-based search ("near me")
    - Opening hours filter ("open now")
    - Sorting options

12. **Performance Optimization**
    - Implement ISR for shop pages
    - Add stale-while-revalidate caching
    - Lazy load below-fold content

### Long-term (Future)

13. **Native App**
    - React Native or Capacitor wrapper
    - Push notifications
    - Offline-first architecture

14. **Shop Owner Portal**
    - Self-service listing management
    - Analytics dashboard
    - Promotion tools

15. **Community Features**
    - User profiles
    - Following/followers
    - Activity feeds

---

## Appendix: Database Schema SQL

### Core Tables (from migration file)

```sql
-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shops
CREATE TABLE IF NOT EXISTS shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  phone TEXT,
  email TEXT,
  website TEXT,
  instagram TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  postcode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_name TEXT NOT NULL,
  author_postcode TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time_start TIME,
  time_end TIME,
  location TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  postcode TEXT,
  is_local BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

*This analysis was generated by Claude Code. For updates or corrections, please modify the source files and regenerate.*
