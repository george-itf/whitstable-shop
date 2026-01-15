import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Domains configuration
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'whitstable.shop';
const ADMIN_SUBDOMAIN = 'admin';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract subdomain
  const subdomain = getSubdomain(hostname);

  // Handle admin subdomain
  if (subdomain === ADMIN_SUBDOMAIN) {
    const pathname = url.pathname;

    // Don't rewrite API routes, auth routes, static files, etc.
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')
    ) {
      return updateSession(request);
    }

    // Rewrite to /admin/* path
    if (pathname === '/') {
      url.pathname = '/admin';
    } else if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname}`;
    }

    // Create rewrite response with session handling
    const sessionResponse = await updateSession(request);

    // If session middleware returned a redirect, honor it
    if (sessionResponse.status === 307 || sessionResponse.status === 308) {
      return sessionResponse;
    }

    // Otherwise do the rewrite
    const response = NextResponse.rewrite(url);

    // Copy cookies from session response
    sessionResponse.cookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value);
    });

    // Add admin subdomain header for client detection
    response.headers.set('x-admin-subdomain', 'true');

    return response;
  }

  // For main domain, redirect /admin to admin subdomain in production
  if (
    process.env.NODE_ENV === 'production' &&
    url.pathname.startsWith('/admin') &&
    subdomain !== ADMIN_SUBDOMAIN
  ) {
    const adminUrl = new URL(url);
    adminUrl.hostname = `${ADMIN_SUBDOMAIN}.${MAIN_DOMAIN}`;
    adminUrl.pathname = url.pathname.replace(/^\/admin/, '') || '/';
    return NextResponse.redirect(adminUrl);
  }

  // Handle session for all other requests
  return await updateSession(request);
}

function getSubdomain(hostname: string): string | null {
  const host = hostname.split(':')[0];

  // Handle localhost for development
  if (host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  // Check for admin subdomain patterns
  if (host.startsWith(`${ADMIN_SUBDOMAIN}.`)) {
    return ADMIN_SUBDOMAIN;
  }

  // Extract subdomain from hostname
  const parts = host.split('.');

  // admin.whitstable.shop -> admin
  // whitstable.shop -> null
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain !== 'www') {
      return subdomain;
    }
  }

  return null;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     *
     * Protected routes handled by updateSession:
     * - /saved/* - requires authentication
     * - /dashboard/* - requires authentication
     * - /admin/* - requires admin role
     * - /settings/* - requires authentication
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
