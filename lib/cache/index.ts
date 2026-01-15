/**
 * Caching Strategies for Whitstable.shop
 *
 * This module provides server-side caching utilities for API routes
 * and data fetching functions.
 */

// In-memory cache for server-side caching
// Note: This is reset on each deployment/restart
// For production, consider using Redis or Vercel KV
const memoryCache = new Map<string, { data: unknown; expiry: number }>();

/**
 * Cache durations in seconds
 */
export const CACHE_DURATION = {
  SHORT: 60,           // 1 minute - for frequently changing data
  MEDIUM: 300,         // 5 minutes - for semi-static data
  LONG: 3600,          // 1 hour - for static data
  DAY: 86400,          // 24 hours - for very static data
} as const;

/**
 * Cache tags for grouped invalidation
 */
export const CACHE_TAGS = {
  SHOPS: 'shops',
  EVENTS: 'events',
  TRENDING: 'trending',
  PHOTOS: 'photos',
  QUESTIONS: 'questions',
  REVIEWS: 'reviews',
  CATEGORIES: 'categories',
} as const;

/**
 * Get data from cache or fetch fresh
 *
 * @param key - Unique cache key
 * @param fetcher - Function to fetch fresh data
 * @param ttl - Time to live in seconds
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_DURATION.MEDIUM
): Promise<T> {
  const cached = memoryCache.get(key);
  const now = Date.now();

  // Return cached data if valid
  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  memoryCache.set(key, {
    data,
    expiry: now + ttl * 1000,
  });

  return data;
}

/**
 * Invalidate cache entries by key prefix
 */
export function invalidateCache(prefix: string): void {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  memoryCache.clear();
}

/**
 * Get cache key for API routes
 */
export function getCacheKey(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): string {
  const sortedParams = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    : '';

  return sortedParams ? `${endpoint}?${sortedParams}` : endpoint;
}

/**
 * Next.js fetch cache options for different scenarios
 */
export const fetchCache = {
  // Revalidate on ISR (Incremental Static Regeneration)
  static: (revalidate: number = 3600) => ({
    next: { revalidate },
  }),

  // No caching - always fresh
  noCache: () => ({
    cache: 'no-store' as const,
  }),

  // Force cache
  forceCache: () => ({
    cache: 'force-cache' as const,
  }),

  // With tags for on-demand revalidation
  withTags: (tags: string[], revalidate?: number) => ({
    next: {
      tags,
      ...(revalidate && { revalidate }),
    },
  }),
};

/**
 * SWR configuration presets
 */
export const swrConfig = {
  // For mostly static data
  static: {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 60000, // 1 minute
  },

  // For real-time data
  realtime: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds
    dedupingInterval: 2000,
  },

  // For user-specific data
  user: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 5000,
  },

  // Default balanced config
  default: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 10000,
  },
};

/**
 * Create a cached fetcher for use with SWR
 */
export function createCachedFetcher<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  ttl: number = CACHE_DURATION.MEDIUM
) {
  return async (): Promise<T> => {
    return getCached(cacheKey, fetcher, ttl);
  };
}

/**
 * HTTP cache headers for API responses
 */
export function getCacheHeaders(
  maxAge: number,
  options?: {
    staleWhileRevalidate?: number;
    isPrivate?: boolean;
  }
): Record<string, string> {
  const { staleWhileRevalidate = 60, isPrivate = false } = options || {};

  return {
    'Cache-Control': [
      isPrivate ? 'private' : 'public',
      `max-age=${maxAge}`,
      `s-maxage=${maxAge}`,
      `stale-while-revalidate=${staleWhileRevalidate}`,
    ].join(', '),
  };
}

/**
 * Edge caching headers for CDN
 */
export function getEdgeCacheHeaders(ttl: number): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=0, s-maxage=${ttl}`,
    'CDN-Cache-Control': `max-age=${ttl}`,
    'Vercel-CDN-Cache-Control': `max-age=${ttl}`,
  };
}
