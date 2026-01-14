/**
 * Audit Logging for Authentication and Authorization Events
 * Logs security-relevant events for monitoring and compliance
 */

export type AuditEventType =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.signup'
  | 'auth.password_reset'
  | 'auth.session_refresh'
  | 'access.denied'
  | 'access.granted'
  | 'admin.action'
  | 'moderation.action'
  | 'data.create'
  | 'data.update'
  | 'data.delete';

export interface AuditEvent {
  type: AuditEventType;
  userId?: string;
  userRole?: string;
  ip?: string;
  userAgent?: string;
  path: string;
  method: string;
  details?: Record<string, unknown>;
  timestamp: string;
  success: boolean;
}

/**
 * Log an audit event
 * In production, this would send to a logging service (e.g., DataDog, Splunk)
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  // Format the log entry
  const logEntry = {
    ...event,
    service: 'whitstable-shop',
    environment: process.env.NODE_ENV || 'development',
  };

  // In development, log to console with formatting
  if (process.env.NODE_ENV === 'development') {
    const emoji = event.success ? '✅' : '❌';
    console.log(`[AUDIT] ${emoji} ${event.type}`, JSON.stringify(logEntry, null, 2));
  }

  // In production, you would send to your logging service
  // Example: await sendToLoggingService(logEntry);

  // Store in database for admin review (if table exists)
  try {
    // This would write to an audit_logs table
    // await supabase.from('audit_logs').insert(logEntry);
  } catch {
    // Silently fail - don't break the request due to logging failure
  }
}

/**
 * Create an audit event for access denial
 */
export function createAccessDeniedEvent(
  path: string,
  method: string,
  reason: string,
  userId?: string,
  userRole?: string,
  ip?: string,
  userAgent?: string
): AuditEvent {
  return {
    type: 'access.denied',
    userId,
    userRole,
    ip,
    userAgent,
    path,
    method,
    details: { reason },
    timestamp: new Date().toISOString(),
    success: false,
  };
}

/**
 * Create an audit event for access granted
 */
export function createAccessGrantedEvent(
  path: string,
  method: string,
  userId: string,
  userRole: string,
  ip?: string,
  userAgent?: string
): AuditEvent {
  return {
    type: 'access.granted',
    userId,
    userRole,
    ip,
    userAgent,
    path,
    method,
    timestamp: new Date().toISOString(),
    success: true,
  };
}

/**
 * Create an audit event for admin actions
 */
export function createAdminActionEvent(
  path: string,
  method: string,
  action: string,
  targetId: string,
  userId: string,
  userRole: string,
  details?: Record<string, unknown>
): AuditEvent {
  return {
    type: 'admin.action',
    userId,
    userRole,
    path,
    method,
    details: { action, targetId, ...details },
    timestamp: new Date().toISOString(),
    success: true,
  };
}

/**
 * Create an audit event for moderation actions
 */
export function createModerationActionEvent(
  action: 'approve' | 'reject' | 'flag' | 'unflag',
  contentType: 'shop' | 'review' | 'user',
  contentId: string,
  moderatorId: string,
  moderatorRole: string,
  reason?: string
): AuditEvent {
  return {
    type: 'moderation.action',
    userId: moderatorId,
    userRole: moderatorRole,
    path: `/api/moderation/${contentType}s/${contentId}`,
    method: 'POST',
    details: { action, contentType, contentId, reason },
    timestamp: new Date().toISOString(),
    success: true,
  };
}

/**
 * Rate limiting tracker (in-memory, use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt < now) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/**
 * Clean up old rate limit records periodically
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60000);
}
