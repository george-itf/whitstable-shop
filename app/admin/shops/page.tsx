'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { EmptyState, AdminSkeleton } from '@/components/admin';
import { createClient } from '@/lib/supabase/client';

interface PendingShop {
  id: string;
  name: string;
  tagline: string | null;
  category: { name: string } | null;
  created_at: string;
  status: string;
}

export default function AdminShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState<PendingShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchPendingShops() {
      try {
        const supabase = createClient();

        // Check authentication and admin role
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login?redirect=/admin/shops');
          return;
        }

        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAdmin(true);

        // Fetch pending shops
        const { data: pendingShops } = await supabase
          .from('shops')
          .select('id, name, tagline, created_at, status, category:categories(name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        // Transform data to handle Supabase's join return type
        const transformedShops = (pendingShops || []).map((shop: PendingShop & { category: { name: string } | { name: string }[] | null }) => ({
          ...shop,
          category: Array.isArray(shop.category) ? shop.category[0] : shop.category,
        }));

        setShops(transformedShops);
      } catch (error) {
        console.error('Error fetching pending shops:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPendingShops();
  }, [router]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/shops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (res.ok) {
        setShops(shops.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/shops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (res.ok) {
        setShops(shops.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error('Error rejecting shop:', error);
    }
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">approve shops</h1>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">approve shops</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <p className="text-grey">You don&apos;t have permission to view this page.</p>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-coral px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">approve shops</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {shops.length === 0 ? (
          <Card>
            <EmptyState
              icon={CheckCircle}
              title="All caught up!"
              description="No pending shops to review"
              variant="success"
            />
          </Card>
        ) : (
          shops.map((shop) => (
            <Card key={shop.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-ink">{shop.name}</h3>
                  <p className="text-sm text-grey">{shop.tagline}</p>
                </div>
                <Badge variant="yellow" size="sm">
                  pending
                </Badge>
              </div>

              <div className="text-sm text-grey mb-4">
                <p>Category: {shop.category?.name || 'Uncategorized'}</p>
                <p>
                  Submitted:{' '}
                  {new Date(shop.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleApprove(shop.id)}
                >
                  approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleReject(shop.id)}
                >
                  reject
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
