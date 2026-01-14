'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

interface AdminStats {
  pendingShops: number;
  pendingReviews: number;
  activeNotices: number;
  totalShops: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    pendingShops: 0,
    pendingReviews: 0,
    activeNotices: 0,
    totalShops: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const supabase = createClient();

        // Check authentication and admin role
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login?redirect=/admin');
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

        // Fetch stats
        const [shopsRes, reviewsRes, noticesRes, totalRes] = await Promise.all([
          supabase
            .from('shops')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase
            .from('reviews')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase
            .from('notices')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true),
          supabase
            .from('shops')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'approved'),
        ]);

        setStats({
          pendingShops: shopsRes.count || 0,
          pendingReviews: reviewsRes.count || 0,
          activeNotices: noticesRes.count || 0,
          totalShops: totalRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();
  }, [router]);

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white">
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
            <h1 className="text-white font-bold text-xl">admin panel</h1>
          </div>
        </div>
        <div className="px-4 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-8 bg-grey-light rounded w-1/2 mx-auto mb-1" />
                <div className="h-3 bg-grey-light rounded w-2/3 mx-auto" />
              </Card>
            ))}
          </div>
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
            <Link href="/" className="text-white">
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
            <h1 className="text-white font-bold text-xl">admin panel</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-coral"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink mb-2">Access Denied</h2>
          <p className="text-grey text-sm mb-4">You don&apos;t have admin privileges</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-coral text-white rounded-button font-semibold"
          >
            go home
          </Link>
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
          <Link href="/" className="text-white">
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
          <h1 className="text-white font-bold text-xl">admin panel</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Pending Shops" value={stats.pendingShops} urgent />
          <StatCard label="Pending Reviews" value={stats.pendingReviews} urgent />
          <StatCard label="Active Notices" value={stats.activeNotices} />
          <StatCard label="Total Shops" value={stats.totalShops} />
        </div>

        {/* Admin sections */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink">moderation</h2>

          {/* Unified Moderation Queue */}
          <Link href="/admin/moderation">
            <Card hoverable className="flex items-center gap-4 border-2 border-coral">
              <div className="w-12 h-12 rounded-card bg-coral text-white flex items-center justify-center">
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
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="m9 14 2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Unified Queue</h3>
                <p className="text-sm text-grey">
                  {stats.pendingShops + stats.pendingReviews} items to review
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grey-light"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Card>
          </Link>

          <Link href="/admin/shops">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-coral-light text-coral flex items-center justify-center">
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
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Approve Shops</h3>
                <p className="text-sm text-grey">{stats.pendingShops} pending approval</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grey-light"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Card>
          </Link>

          <Link href="/admin/reviews">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-yellow/10 text-yellow flex items-center justify-center">
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
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Moderate Reviews</h3>
                <p className="text-sm text-grey">{stats.pendingReviews} pending moderation</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grey-light"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Card>
          </Link>

          <Link href="/admin/notices">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-sky-light text-sky flex items-center justify-center">
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
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Manage Notices</h3>
                <p className="text-sm text-grey">
                  {stats.activeNotices} active banner{stats.activeNotices !== 1 && 's'}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grey-light"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Card>
          </Link>

          <Link href="/admin/nominations">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-amber-100 text-amber-600 flex items-center justify-center">
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
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Award Nominations</h3>
                <p className="text-sm text-grey">Review and select winners</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grey-light"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Card>
          </Link>
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function StatCard({
  label,
  value,
  urgent = false,
}: {
  label: string;
  value: number;
  urgent?: boolean;
}) {
  return (
    <Card className="text-center">
      <div className={`text-2xl font-bold ${urgent && value > 0 ? 'text-coral' : 'text-ink'}`}>
        {value}
      </div>
      <div className="text-xs text-grey">{label}</div>
    </Card>
  );
}
