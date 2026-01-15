'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Button, Input, Badge, Avatar, Modal, Select, Card, ConfirmDialog, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Search,
  Users,
  Shield,
  ShieldCheck,
  Store,
  MoreVertical,
  Mail,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin';
  created_at: string;
  shop_count: number;
  review_count: number;
}

const roleConfig = {
  admin: { label: 'Admin', variant: 'danger' as const, icon: ShieldCheck },
  moderator: { label: 'Moderator', variant: 'warning' as const, icon: Shield },
  user: { label: 'User', variant: 'default' as const, icon: Users },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editRole, setEditRole] = useState<string>('user');
  const [isSaving, setIsSaving] = useState(false);
  const { success, error: showError } = useToast();

  const fetchUsers = async () => {
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

    // Fetch users with counts
    const { data: usersData, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, display_name, avatar_url, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      showError('Failed to load users');
      setIsLoading(false);
      return;
    }

    // Get shop and review counts for each user
    const userIds = (usersData || []).map((u: { id: string }) => u.id);

    const [shopCounts, reviewCounts] = await Promise.all([
      supabase
        .from('shops')
        .select('owner_id')
        .in('owner_id', userIds),
      supabase
        .from('reviews')
        .select('user_id')
        .in('user_id', userIds),
    ]);

    // Count shops per user
    const shopCountMap: Record<string, number> = {};
    (shopCounts.data || []).forEach((s: { owner_id: string }) => {
      shopCountMap[s.owner_id] = (shopCountMap[s.owner_id] || 0) + 1;
    });

    // Count reviews per user
    const reviewCountMap: Record<string, number> = {};
    (reviewCounts.data || []).forEach((r: { user_id: string }) => {
      reviewCountMap[r.user_id] = (reviewCountMap[r.user_id] || 0) + 1;
    });

    const enrichedUsers: User[] = (usersData || []).map((u: {
      id: string;
      email: string;
      full_name: string | null;
      display_name: string | null;
      avatar_url: string | null;
      role: 'user' | 'moderator' | 'admin';
      created_at: string;
    }) => ({
      ...u,
      shop_count: shopCountMap[u.id] || 0,
      review_count: reviewCountMap[u.id] || 0,
    }));

    setUsers(enrichedUsers);
    setFilteredUsers(enrichedUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          u.full_name?.toLowerCase().includes(query) ||
          u.display_name?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setIsEditModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('profiles')
      .update({ role: editRole })
      .eq('id', selectedUser.id);

    if (error) {
      showError('Failed to update user role');
      setIsSaving(false);
      return;
    }

    success(`Updated ${selectedUser.display_name || selectedUser.email}'s role to ${editRole}`);
    setIsEditModalOpen(false);
    setIsSaving(false);
    fetchUsers();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="px-4 py-6 space-y-4">
          <Skeleton variant="heading" className="w-48" />
          <Skeleton variant="card" className="h-12" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-20" />
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
            <h1 className="text-lg font-bold text-ink">User Management</h1>
            <p className="text-xs text-grey">{users.length} registered users</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-32"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </Select>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="text-center py-3">
            <Users className="w-5 h-5 mx-auto text-grey mb-1" />
            <p className="text-lg font-bold text-ink">{users.filter((u) => u.role === 'user').length}</p>
            <p className="text-xs text-grey">Users</p>
          </Card>
          <Card className="text-center py-3">
            <Shield className="w-5 h-5 mx-auto text-amber-500 mb-1" />
            <p className="text-lg font-bold text-ink">{users.filter((u) => u.role === 'moderator').length}</p>
            <p className="text-xs text-grey">Moderators</p>
          </Card>
          <Card className="text-center py-3">
            <ShieldCheck className="w-5 h-5 mx-auto text-red-500 mb-1" />
            <p className="text-lg font-bold text-ink">{users.filter((u) => u.role === 'admin').length}</p>
            <p className="text-xs text-grey">Admins</p>
          </Card>
        </div>

        {/* User List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-grey-light mb-3" />
            <p className="text-grey">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const config = roleConfig[user.role];
            const RoleIcon = config.icon;

            return (
              <Card key={user.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={user.avatar_url || undefined}
                    alt={user.display_name || user.email}
                    fallback={user.display_name || user.email}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink truncate">
                        {user.display_name || user.full_name || 'Unknown'}
                      </h3>
                      <Badge variant={config.variant} size="sm">
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-grey truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-grey">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {formatDate(user.created_at)}
                      </span>
                      {user.shop_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          {user.shop_count} shop{user.shop_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 rounded-lg hover:bg-grey-light transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-grey" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-grey-light/30 rounded-xl">
              <Avatar
                src={selectedUser.avatar_url || undefined}
                alt={selectedUser.display_name || selectedUser.email}
                fallback={selectedUser.display_name || selectedUser.email}
                size="md"
              />
              <div>
                <p className="font-semibold text-ink">
                  {selectedUser.display_name || selectedUser.full_name || 'Unknown'}
                </p>
                <p className="text-sm text-grey">{selectedUser.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Role</label>
              <Select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </Select>
              {editRole === 'admin' && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Admin users have full system access
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSaveRole}
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </MobileWrapper>
  );
}
