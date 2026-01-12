/**
 * Privacy-first analytics library
 * Supports Plausible and Umami (no cookie banner needed)
 *
 * Setup:
 * 1. Choose either Plausible or Umami
 * 2. Set the appropriate environment variable:
 *    - NEXT_PUBLIC_PLAUSIBLE_DOMAIN for Plausible
 *    - NEXT_PUBLIC_UMAMI_WEBSITE_ID and NEXT_PUBLIC_UMAMI_URL for Umami
 */

// Analytics provider type
type AnalyticsProvider = 'plausible' | 'umami' | 'none';

// Determine which provider is configured
function getProvider(): AnalyticsProvider {
  if (typeof window === 'undefined') return 'none';

  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return 'plausible';
  }

  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    return 'umami';
  }

  return 'none';
}

// Event properties type
type EventProps = Record<string, string | number | boolean>;

/**
 * Track a custom event
 *
 * @param name - Event name (e.g., 'shop_view', 'search')
 * @param props - Optional event properties
 */
export function trackEvent(name: string, props?: EventProps): void {
  const provider = getProvider();

  if (provider === 'none') {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', name, props);
    }
    return;
  }

  if (provider === 'plausible') {
    // Plausible event tracking
    const plausible = (window as Window & { plausible?: (name: string, options?: { props?: EventProps }) => void }).plausible;
    if (plausible) {
      plausible(name, { props });
    }
  }

  if (provider === 'umami') {
    // Umami event tracking
    const umami = (window as Window & { umami?: { track: (name: string, props?: EventProps) => void } }).umami;
    if (umami) {
      umami.track(name, props);
    }
  }
}

// ============================================
// Pre-defined event tracking functions
// ============================================

/**
 * Track shop page view
 */
export function trackShopView(shopSlug: string, category: string): void {
  trackEvent('shop_view', { shop_slug: shopSlug, category });
}

/**
 * Track shop save action
 */
export function trackShopSave(shopSlug: string): void {
  trackEvent('shop_save', { shop_slug: shopSlug });
}

/**
 * Track shop unsave action
 */
export function trackShopUnsave(shopSlug: string): void {
  trackEvent('shop_unsave', { shop_slug: shopSlug });
}

/**
 * Track review submission
 */
export function trackReviewSubmit(shopSlug: string, rating: number): void {
  trackEvent('review_submit', { shop_slug: shopSlug, rating });
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent('search', { query, results_count: resultsCount });
}

/**
 * Track map open
 */
export function trackMapOpen(): void {
  trackEvent('map_open');
}

/**
 * Track map marker click
 */
export function trackMapMarkerClick(shopSlug: string): void {
  trackEvent('map_marker_click', { shop_slug: shopSlug });
}

/**
 * Track directions click (Google Maps/Apple Maps)
 */
export function trackDirectionsClick(shopSlug: string): void {
  trackEvent('directions_click', { shop_slug: shopSlug });
}

/**
 * Track call button click
 */
export function trackCallClick(shopSlug: string): void {
  trackEvent('call_click', { shop_slug: shopSlug });
}

/**
 * Track event page view
 */
export function trackEventView(eventId: string): void {
  trackEvent('event_view', { event_id: eventId });
}

/**
 * Track user signup
 */
export function trackSignup(source: string): void {
  trackEvent('signup', { source });
}

/**
 * Track user login
 */
export function trackLogin(): void {
  trackEvent('login');
}

/**
 * Track category view
 */
export function trackCategoryView(categorySlug: string): void {
  trackEvent('category_view', { category_slug: categorySlug });
}

/**
 * Track share action
 */
export function trackShare(contentType: string, contentId: string, platform: string): void {
  trackEvent('share', { content_type: contentType, content_id: contentId, platform });
}

/**
 * Track external link click
 */
export function trackExternalLink(shopSlug: string, linkType: 'website' | 'social' | 'booking'): void {
  trackEvent('external_link', { shop_slug: shopSlug, link_type: linkType });
}

/**
 * Track PWA install prompt shown
 */
export function trackPWAPromptShown(): void {
  trackEvent('pwa_prompt_shown');
}

/**
 * Track PWA install
 */
export function trackPWAInstall(): void {
  trackEvent('pwa_install');
}

// ============================================
// Analytics React Component
// ============================================

/**
 * Analytics script component
 * Add this to your root layout
 *
 * Usage in app/layout.tsx:
 * import { AnalyticsScript } from '@/lib/analytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <AnalyticsScript />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 */
export function getAnalyticsScript(): string | null {
  const provider = getProvider();

  if (provider === 'plausible') {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    return `<script defer data-domain="${domain}" src="https://plausible.io/js/script.js"></script>`;
  }

  if (provider === 'umami') {
    const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is';
    return `<script defer src="${umamiUrl}/script.js" data-website-id="${websiteId}"></script>`;
  }

  return null;
}

// ============================================
// Conversion Funnel Tracking Helpers
// ============================================

/**
 * Track funnel progress
 * Use this to track multi-step conversion funnels
 */
export function trackFunnelStep(
  funnelName: string,
  step: number,
  stepName: string
): void {
  trackEvent('funnel_step', {
    funnel: funnelName,
    step,
    step_name: stepName,
  });
}

/**
 * Pre-defined funnels:
 *
 * 1. Visitor → Engaged
 *    - Step 1: Homepage view
 *    - Step 2: Shop page view
 *    - Step 3: Second shop page view
 *
 * 2. Visitor → Saver
 *    - Step 1: Shop page view
 *    - Step 2: Save click
 *    - Step 3: Signup
 *    - Step 4: Save complete
 *
 * 3. Visitor → Reviewer
 *    - Step 1: Shop page view
 *    - Step 2: Write review click
 *    - Step 3: Review submit
 *    - Step 4: Review published
 *
 * 4. Shop Owner → Claimed
 *    - Step 1: Shop page view
 *    - Step 2: Claim button click
 *    - Step 3: Signup
 *    - Step 4: Claim request submit
 *    - Step 5: Claim approved
 */

export default {
  trackEvent,
  trackShopView,
  trackShopSave,
  trackShopUnsave,
  trackReviewSubmit,
  trackSearch,
  trackMapOpen,
  trackMapMarkerClick,
  trackDirectionsClick,
  trackCallClick,
  trackEventView,
  trackSignup,
  trackLogin,
  trackCategoryView,
  trackShare,
  trackExternalLink,
  trackPWAPromptShown,
  trackPWAInstall,
  trackFunnelStep,
};
