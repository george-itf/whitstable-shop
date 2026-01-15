/**
 * Authentication and Route Protection Configuration
 * Centralized configuration for protected routes, roles, and permissions
 */

// Canonical role model matching types/database.ts and the database schema
// Note: 'shop_owner' is not a role - shop ownership is determined by shops.owner_id relationship
export type UserRole = 'user' | 'admin' | 'moderator';

export interface RouteConfig {
  path: string;
  roles: UserRole[];
  requireAuth: boolean;
  redirectTo?: string;
}

/**
 * Protected routes configuration
 * Define which routes require authentication and specific roles
 */
export const protectedRoutes: RouteConfig[] = [
  // User-level protected routes (any authenticated user)
  { path: '/saved', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/settings', roles: ['user', 'admin', 'moderator'], requireAuth: true },

  // Dashboard routes - require auth, ownership checked in page
  // Shop ownership is determined by shops.owner_id, not by role
  { path: '/dashboard', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/dashboard/edit', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/dashboard/reviews', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/dashboard/analytics', roles: ['user', 'admin', 'moderator'], requireAuth: true },

  // Moderator routes
  { path: '/moderate', roles: ['moderator', 'admin'], requireAuth: true },

  // Admin routes
  { path: '/admin', roles: ['admin'], requireAuth: true },
  { path: '/admin/shops', roles: ['admin'], requireAuth: true },
  { path: '/admin/reviews', roles: ['admin'], requireAuth: true },
  { path: '/admin/notices', roles: ['admin'], requireAuth: true },
  { path: '/admin/nominations', roles: ['admin'], requireAuth: true },
  { path: '/admin/users', roles: ['admin'], requireAuth: true },
  { path: '/admin/moderation', roles: ['admin', 'moderator'], requireAuth: true },
];

/**
 * Public routes that don't require authentication
 */
export const publicRoutes = [
  '/',
  '/shops',
  '/shops/[slug]',
  '/map',
  '/search',
  '/categories',
  '/categories/[slug]',
  '/dog-walks',
  '/dog-walks/[slug]',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/awards',
  '/trending',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/auth/callback',
];

/**
 * API routes that require authentication
 */
export const protectedApiRoutes: RouteConfig[] = [
  { path: '/api/saved', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/api/reviews', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/api/notifications', roles: ['user', 'admin', 'moderator'], requireAuth: true },
  { path: '/api/admin', roles: ['admin'], requireAuth: true },
  { path: '/api/moderation', roles: ['admin', 'moderator'], requireAuth: true },
];

/**
 * Check if a path matches a route pattern
 */
export function matchesRoute(pathname: string, routePath: string): boolean {
  // Direct match
  if (pathname === routePath) return true;

  // Check if pathname starts with route (for nested routes)
  if (pathname.startsWith(routePath + '/')) return true;

  // Handle dynamic routes [param]
  const routeParts = routePath.split('/');
  const pathParts = pathname.split('/');

  if (routeParts.length !== pathParts.length) return false;

  return routeParts.every((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) return true;
    return part === pathParts[index];
  });
}

/**
 * Find the route configuration for a given path
 */
export function findRouteConfig(pathname: string): RouteConfig | undefined {
  return protectedRoutes.find(route => matchesRoute(pathname, route.path));
}

/**
 * Check if a user role has access to a route
 */
export function hasRouteAccess(userRole: UserRole | null, routeConfig: RouteConfig): boolean {
  if (!routeConfig.requireAuth) return true;
  if (!userRole) return false;
  return routeConfig.roles.includes(userRole);
}

/**
 * Get the appropriate redirect URL for unauthorized access
 */
export function getUnauthorizedRedirect(pathname: string, isAuthenticated: boolean): string {
  if (!isAuthenticated) {
    return `/auth/login?redirect=${encodeURIComponent(pathname)}`;
  }
  // Authenticated but wrong role - redirect to home
  return '/';
}

/**
 * Permission levels for granular access control
 */
export const permissions = {
  // Shop permissions
  // Note: 'shop:edit' requires ownership check (shops.owner_id === user.id) OR admin role
  'shop:create': ['user', 'admin'],
  'shop:edit': ['user', 'admin'], // Plus ownership check in implementation
  'shop:delete': ['admin'],
  'shop:approve': ['admin', 'moderator'],

  // Review permissions
  'review:create': ['user', 'admin'],
  'review:edit': ['admin'],
  'review:delete': ['admin', 'moderator'],
  'review:approve': ['admin', 'moderator'],

  // User permissions
  'user:view': ['admin'],
  'user:edit': ['admin'],
  'user:delete': ['admin'],
  'user:ban': ['admin'],

  // Notice permissions
  'notice:create': ['admin'],
  'notice:edit': ['admin'],
  'notice:delete': ['admin'],

  // Award permissions
  'award:nominate': ['user', 'admin'],
  'award:vote': ['user', 'admin'],
  'award:manage': ['admin'],
} as const;

export type Permission = keyof typeof permissions;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole | null, permission: Permission): boolean {
  if (!role) return false;
  const allowedRoles = permissions[permission];
  return (allowedRoles as readonly string[]).includes(role);
}
