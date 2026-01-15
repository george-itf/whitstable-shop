import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Validates and sanitizes a redirect path to prevent open redirect vulnerabilities.
 * Only allows relative paths starting with / and rejects absolute URLs.
 */
function getSafeRedirectPath(redirect: string | null): string {
  // Default to home if no redirect specified
  if (!redirect) {
    return '/';
  }

  // Reject absolute URLs (containing protocol)
  if (redirect.includes('://') || redirect.includes('//')) {
    console.warn('[Auth Callback] Rejected absolute URL redirect:', redirect);
    return '/';
  }

  // Only allow paths starting with /
  if (!redirect.startsWith('/')) {
    console.warn('[Auth Callback] Rejected non-root redirect:', redirect);
    return '/';
  }

  // Prevent backslash-based bypasses
  if (redirect.includes('\\')) {
    console.warn('[Auth Callback] Rejected redirect with backslash:', redirect);
    return '/';
  }

  return redirect;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      // Create profile if it doesn't exist
      if (!existingProfile) {
        // Always create new users with 'user' role
        // Elevated roles (admin, moderator) must be granted through admin interface
        // Shop ownership is handled via shops.owner_id relationship, not role
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata.full_name || data.user.user_metadata.name || null,
          role: 'user', // Default role for all new users
        });
      }
    }
  }

  // Use safe redirect path
  const safeRedirect = getSafeRedirectPath(redirect);
  return NextResponse.redirect(new URL(safeRedirect, requestUrl.origin));
}
