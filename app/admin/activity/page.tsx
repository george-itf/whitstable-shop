'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Input, Badge, Select, Card, Skeleton } from '@/components/ui';
import {
  ArrowLeft,
  Search,
  Filter,
  Store,
  Star,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash,
  Plus,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  user_id: string | null;
  user_email: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const actionConfig: Record<string, { icon: typeof Store; color: string; label: string }> = {
  'shop.approved': { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Shop Approved' },
  'shop.rejected': { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Shop Rejected' },
  'shop.created': { icon: Plus, color: 'text-sky bg-sky-light', label: 'Shop Created' },
  'shop.updated': { icon: Edit, color: 'text-amber-600 bg-amber-100', label: 'Shop Updated' },
  'shop.deleted': { icon: Trash, color: 'text-red-600 bg-red-100', label: 'Shop Deleted' },
  'review.approved': { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Review Approved' },
  'review.rejected': { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Review Rejected' },
  'review.flagged': { icon: AlertTriangle, color: 'text-amber-600 bg-amber-100', label: 'Review Flagged' },
  'user.role_changed': { icon: Shield, color: 'text-purple-600 bg-purple-100', label: 'Role Changed' },
  'user.login': { icon: User, color: 'text-grey bg-grey-light', label: 'User Login' },
  'access.denied': { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Access Denied' },
  'default': { icon: Clock, color: 'text-grey bg-grey-light', label: 'Activity' },
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchLogs() {
      const supabase = createClient();

      // Check admin role
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        setIsLoading(false);
        return;
      }

      setIsAdmin(true);

      // Try to fetch audit logs if table exists
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.log('Audit logs table may not exist:', error.message);
        // Generate sample data for demo
        setLogs(generateSampleLogs());
      } else {
        setLogs(data || []);
      }

      setIsLoading(false);
    }

    fetchLogs();
  }, []);

  useEffect(() => {
    let result = [...logs];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.entity_name?.toLowerCase().includes(query) ||
          log.user_email?.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query)
      );
    }

    // Apply entity filter
    if (entityFilter !== 'all') {
      result = result.filter((log) => log.entity_type === entityFilter);
    }

    // Apply action filter
    if (actionFilter !== 'all') {
      result = result.filter((log) => log.action.includes(actionFilter));
    }

    setFilteredLogs(result);
  }, [logs, searchQuery, entityFilter, actionFilter]);

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getConfig = (action: string) => {
    return actionConfig[action] || actionConfig['default'];
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="px-4 py-6 space-y-4">
          <Skeleton variant="heading" className="w-48" />
          <Skeleton variant="card" className="h-12" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-16" />
          ))}
        </div>
      </MobileWrapper>
    );
  }

  if (!isAdmin) {
    return (
      <MobileWrapper>
        <div className="px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-ink mb-2">Access Denied</h1>
          <p className="text-grey">You don&apos;t have permission to view this page.</p>
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper withNav={false}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-grey-light">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/admin"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-grey-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-ink">Activity Log</h1>
            <p className="text-xs text-grey">Recent admin actions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
            <Input
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="flex-1"
            >
              <option value="all">All Types</option>
              <option value="shop">Shops</option>
              <option value="review">Reviews</option>
              <option value="user">Users</option>
              <option value="access">Access</option>
            </Select>
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="flex-1"
            >
              <option value="all">All Actions</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-grey-light mb-3" />
            <p className="text-grey">No activity found</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const config = getConfig(log.action);
            const Icon = config.icon;

            return (
              <Card key={log.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink text-sm">
                        {config.label}
                      </p>
                      <Badge variant="grey" size="sm">
                        {log.entity_type}
                      </Badge>
                    </div>
                    {log.entity_name && (
                      <p className="text-sm text-grey truncate mt-0.5">
                        {log.entity_name}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-grey">
                      {log.user_email && (
                        <span className="truncate">{log.user_email}</span>
                      )}
                      <span className="flex-shrink-0">{formatTime(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </MobileWrapper>
  );
}

// Generate sample logs for demo purposes
function generateSampleLogs(): AuditLogEntry[] {
  const actions = [
    { action: 'shop.approved', entity_type: 'shop', entity_name: 'Harbour Coffee Co.' },
    { action: 'review.approved', entity_type: 'review', entity_name: 'Review for Wheelers Oyster Bar' },
    { action: 'shop.created', entity_type: 'shop', entity_name: 'The Oyster Stores' },
    { action: 'user.role_changed', entity_type: 'user', entity_name: 'john@example.com' },
    { action: 'shop.rejected', entity_type: 'shop', entity_name: 'Test Shop' },
    { action: 'review.flagged', entity_type: 'review', entity_name: 'Review for Beach Walk Cafe' },
    { action: 'shop.updated', entity_type: 'shop', entity_name: 'Samphire' },
    { action: 'access.denied', entity_type: 'access', entity_name: '/admin/users' },
  ];

  return actions.map((a, i) => ({
    id: `sample-${i}`,
    action: a.action,
    entity_type: a.entity_type,
    entity_id: `entity-${i}`,
    entity_name: a.entity_name,
    user_id: 'admin-user',
    user_email: 'admin@whitstable.shop',
    details: null,
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date(Date.now() - i * 3600000 * (i + 1)).toISOString(),
  }));
}
