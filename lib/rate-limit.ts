/**
 * Simple in-memory rate limiter for API endpoints
 * For production at scale, consider using Redis or Upstash
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  limit?: number;
  /** Time window in seconds */
  windowSeconds?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier (usually IP address)
 * @param identifier - Unique identifier for the client (IP, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns Rate limit result with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 10, windowSeconds = 60 } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const key = identifier;
  const entry = rateLimitMap.get(key);

  // If no entry or expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(entry.resetTime / 1000),
    };
  }

  return {
    success: true,
    remaining: limit - entry.count,
    reset: Math.ceil(entry.resetTime / 1000),
  };
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and direct connections
 */
export function getClientIP(request: Request): string {
  // Check various headers that proxies/CDNs use
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Vercel specific
  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }

  // Cloudflare specific
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }

  // Fallback for development
  return '127.0.0.1';
}

/**
 * Create a rate-limited response with proper headers
 */
export function rateLimitResponse(reset: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: reset - Math.floor(Date.now() / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(reset - Math.floor(Date.now() / 1000)),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(reset),
      },
    }
  );
}

/**
 * Helper to add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult,
  limit: number
): Response {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', String(limit));
  headers.set('X-RateLimit-Remaining', String(result.remaining));
  headers.set('X-RateLimit-Reset', String(result.reset));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
