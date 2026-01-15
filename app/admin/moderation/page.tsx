'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { EmptyState, AdminSkeleton } from '@/components/admin';
import { createClient } from '@/lib/supabase/client';

interface ModerationItem {
  id: string;
  type: 'shop' | 'review';
  status: string;
  created_at: string;
  // Shop fields
  name?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  category?: { name: string } | null;
  owner?: { id: string; email: string; full_name: string } | null;
  // Review fields
  rating?: number;
  comment?: string;
  author_name?: string;
  author_postcode?: string;
  flagged_reason?: string | null;
  shop?: { id: string; name: string; slug: string } | null;
  user?: { id: string; email: string; full_name: string } | null;
}

interface ModerationCounts {
  pendingShops: number;
  pendingReviews: number;
  flaggedReviews: number;
}

export default function UnifiedModerationPage() {
  const router = useRouter();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [counts, setCounts] = useState<ModerationCounts>({
    pendingShops: 0,
    pendingReviews: 0,
    flaggedReviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isBulkActioning, setIsBulkActioning] = useState(false);

  const fetchModerationQueue = useCallback(async (type: string = 'all') => {
    try {
      const res = await fetch(`/api/admin/moderation?type=${type}&status=pending`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();

      // Combine shops and reviews into single list
      const allItems: ModerationItem[] = [
        ...data.shops,
        ...data.reviews,
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setItems(allItems);
      setCounts(data.counts);
    } catch (error) {
      console.error('Error fetching moderation queue:', error);
    }
  }, []);

  useEffect(() => {
    async function checkAccess() {
      try {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login?redirect=/admin/moderation');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || !['admin', 'moderator'].includes(profile.role)) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAdmin(true);
        await fetchModerationQueue();
      } catch (error) {
        console.error('Error checking access:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [router, fetchModerationQueue]);

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    setSelectedItems(new Set());
    setIsLoading(true);
    await fetchModerationQueue(tab);
    setIsLoading(false);
  };

  const handleAction = async (item: ModerationItem, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          contentType: item.type,
          contentId: item.id,
        }),
      });

      if (res.ok) {
        setItems(items.filter(i => i.id !== item.id));
        setCounts(prev => ({
          ...prev,
          [item.type === 'shop' ? 'pendingShops' : 'pendingReviews']:
            prev[item.type === 'shop' ? 'pendingShops' : 'pendingReviews'] - 1,
        }));
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.id)));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.size === 0) return;

    setIsBulkActioning(true);
    try {
      const selectedItemsList = items
        .filter(i => selectedItems.has(i.id))
        .map(i => ({ id: i.id, type: i.type }));

      const res = await fetch('/api/admin/moderation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          items: selectedItemsList,
        }),
      });

      if (res.ok) {
        setItems(items.filter(i => !selectedItems.has(i.id)));
        setSelectedItems(new Set());
        await fetchModerationQueue(activeTab);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setIsBulkActioning(false);
    }
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">moderation queue</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <AdminSkeleton count={3} variant="list" />
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  if (isAdmin === false) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">moderation queue</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <p className="text-grey">You don&apos;t have permission to view this page.</p>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  const totalPending = counts.pendingShops + counts.pendingReviews;

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-coral px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">moderation queue</h1>
          {totalPending > 0 && (
            <span className="ml-auto bg-white text-coral text-sm font-bold px-2 py-0.5 rounded-full">
              {totalPending}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 bg-sand border-b border-grey-light">
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <span className="font-bold text-coral">{counts.pendingShops}</span>
            <span className="text-grey ml-1">shops</span>
          </div>
          <div className="text-center">
            <span className="font-bold text-yellow">{counts.pendingReviews}</span>
            <span className="text-grey ml-1">reviews</span>
          </div>
          {counts.flaggedReviews > 0 && (
            <div className="text-center">
              <span className="font-bold text-red-500">{counts.flaggedReviews}</span>
              <span className="text-grey ml-1">flagged</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <Tabs defaultValue={activeTab} onChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All ({totalPending})</TabsTrigger>
            <TabsTrigger value="shops">Shops ({counts.pendingShops})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({counts.pendingReviews})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk Actions */}
      {items.length > 0 && (
        <div className="px-4 py-3 border-b border-grey-light flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-grey">
            <input
              type="checkbox"
              checked={selectedItems.size === items.length && items.length > 0}
              onChange={selectAll}
              className="w-4 h-4 rounded border-grey-light"
            />
            Select all
          </label>
          {selectedItems.size > 0 && (
            <>
              <span className="text-sm text-grey">({selectedItems.size} selected)</span>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  disabled={isBulkActioning}
                >
                  {isBulkActioning ? 'Processing...' : 'Approve All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                  disabled={isBulkActioning}
                >
                  Reject All
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-4 space-y-4 pb-24">
        {items.length === 0 ? (
          <Card>
            <EmptyState
              icon={CheckCircle}
              title="All caught up!"
              description="No pending items to review"
              variant="success"
            />
          </Card>
        ) : (
          items.map((item) => (
            <ModerationCard
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={() => toggleSelectItem(item.id)}
              onApprove={() => handleAction(item, 'approve')}
              onReject={() => handleAction(item, 'reject')}
            />
          ))
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function ModerationCard({
  item,
  isSelected,
  onSelect,
  onApprove,
  onReject,
}: {
  item: ModerationItem;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isShop = item.type === 'shop';

  return (
    <Card className={`relative ${isSelected ? 'ring-2 ring-coral' : ''}`}>
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-grey-light"
        />
      </div>

      {/* Type badge */}
      <div className="absolute top-3 right-3">
        <Badge variant={isShop ? 'coral' : 'yellow'} size="sm">
          {item.type}
        </Badge>
      </div>

      <div className="pl-8 pt-2">
        {isShop ? (
          // Shop content
          <>
            <h3 className="font-bold text-ink pr-16">{item.name}</h3>
            {item.tagline && (
              <p className="text-sm text-grey mt-1">{item.tagline}</p>
            )}
            <div className="text-xs text-grey mt-2 space-y-1">
              <p>Category: {item.category?.name || 'Uncategorized'}</p>
              {item.owner && (
                <p>Owner: {item.owner.full_name || item.owner.email}</p>
              )}
              <p>
                Submitted:{' '}
                {new Date(item.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {item.description && (
              <p className="text-sm text-grey-dark mt-3 line-clamp-2">
                {item.description}
              </p>
            )}
          </>
        ) : (
          // Review content
          <>
            <div className="flex items-start justify-between pr-16">
              <div>
                <h3 className="font-bold text-ink">{item.shop?.name || 'Unknown Shop'}</h3>
                <p className="text-xs text-grey">
                  By {item.author_name} ({item.author_postcode})
                </p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={(item.rating || 0) >= star ? '#f5a623' : 'none'}
                    stroke={(item.rating || 0) >= star ? '#f5a623' : '#e5e7eb'}
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>

            <p className="text-sm text-grey-dark mt-3">
              &ldquo;{item.comment}&rdquo;
            </p>

            {item.flagged_reason && (
              <div className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded inline-block mt-2">
                ⚠️ {item.flagged_reason}
              </div>
            )}

            <p className="text-xs text-grey mt-2">
              Submitted:{' '}
              {new Date(item.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={onApprove}
          >
            approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onReject}
          >
            reject
          </Button>
          {isShop && item.slug && (
            <Link
              href={`/shops/${item.slug}`}
              target="_blank"
              className="flex items-center justify-center px-3 text-grey hover:text-ink"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
