import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  findRouteConfig,
  hasRouteAccess,
  getUnauthorizedRedirect,
  type UserRole,
} from '@/lib/auth/config';
import {
  logAuditEvent,
  createAccessDeniedEvent,
  createAccessGrantedEvent,
  checkRateLimit,
} from '@/lib/auth/audit';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get request metadata for logging
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Skip auth check for static assets and public API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.includes('.')
  ) {
    return supabaseResponse;
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitKey = `${ip}:${pathname}`;
    const { allowed, remaining, resetAt } = checkRateLimit(rateLimitKey, 100, 60000);

    if (!allowed) {
      await logAuditEvent(
        createAccessDeniedEvent(pathname, method, 'Rate limit exceeded', undefined, undefined, ip, userAgent)
      );
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetAt.toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    supabaseResponse.headers.set('X-RateLimit-Limit', '100');
    supabaseResponse.headers.set('X-RateLimit-Remaining', remaining.toString());
    supabaseResponse.headers.set('X-RateLimit-Reset', resetAt.toString());
  }

  // Refresh session if it exists
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Find route configuration
  const routeConfig = findRouteConfig(pathname);

  // If no route config, it's a public route
  if (!routeConfig) {
    return supabaseResponse;
  }

  // Check if user is authenticated
  if (routeConfig.requireAuth && !user) {
    const redirectUrl = getUnauthorizedRedirect(pathname, false);

    await logAuditEvent(
      createAccessDeniedEvent(pathname, method, 'Not authenticated', undefined, undefined, ip, userAgent)
    );

    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated, check role
  if (user && routeConfig.requireAuth) {
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role as UserRole) || 'user';

    // Check if user has access to this route
    if (!hasRouteAccess(userRole, routeConfig)) {
      await logAuditEvent(
        createAccessDeniedEvent(pathname, method, `Insufficient permissions (role: ${userRole})`, user.id, userRole, ip, userAgent)
      );

      const url = request.nextUrl.clone();
      url.pathname = routeConfig.redirectTo || '/';
      return NextResponse.redirect(url);
    }

    // Log successful access to protected routes (for admin routes only to avoid log spam)
    if (pathname.startsWith('/admin')) {
      await logAuditEvent(
        createAccessGrantedEvent(pathname, method, user.id, userRole, ip, userAgent)
      );
    }

    // Add user info to headers for downstream use
    supabaseResponse.headers.set('x-user-id', user.id);
    supabaseResponse.headers.set('x-user-role', userRole);
  }

  return supabaseResponse;
}
