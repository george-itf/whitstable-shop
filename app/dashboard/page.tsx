'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

interface DashboardStats {
  views: number;
  saves: number;
  reviews: number;
  has_shop: boolean;
  recent_reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    shops: { name: string };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const supabase = createClient();

        // Check authentication
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Fetch dashboard stats
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-sky px-4 py-4">
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
            <h1 className="text-white font-bold text-xl">dashboard</h1>
          </div>
        </div>
        <div className="px-4 py-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
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

  if (isAuthenticated === false) {
    return (
      <MobileWrapper>
        <div className="bg-sky px-4 py-4">
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
            <h1 className="text-white font-bold text-xl">dashboard</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <div className="w-16 h-16 bg-sky-light rounded-full flex items-center justify-center mx-auto mb-4">
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
              className="text-sky"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink mb-2">Sign in to access dashboard</h2>
          <p className="text-grey text-sm mb-4">
            Manage your shop listings and view performance stats
          </p>
          <Link
            href="/login?redirect=/dashboard"
            className="inline-block px-6 py-2 bg-sky text-white rounded-button font-semibold"
          >
            sign in
          </Link>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  if (!stats?.has_shop) {
    return (
      <MobileWrapper>
        <div className="bg-sky px-4 py-4">
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
            <h1 className="text-white font-bold text-xl">dashboard</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <div className="w-16 h-16 bg-sky-light rounded-full flex items-center justify-center mx-auto mb-4">
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
              className="text-sky"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink mb-2">No shop listing yet</h2>
          <p className="text-grey text-sm mb-4">
            Submit your shop to whitstable.shop to access the dashboard
          </p>
          <Link
            href="/submit-shop"
            className="inline-block px-6 py-2 bg-sky text-white rounded-button font-semibold"
          >
            submit a shop
          </Link>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
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
          <h1 className="text-white font-bold text-xl">dashboard</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Views" value={stats.views} />
          <StatCard label="Saves" value={stats.saves} />
          <StatCard label="Reviews" value={stats.reviews} />
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink">quick actions</h2>

          <Link href="/dashboard/shop">
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
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Edit Shop Details</h3>
                <p className="text-sm text-grey">Update your listing information</p>
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

          <Link href="/dashboard/events">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Manage Events</h3>
                <p className="text-sm text-grey">Add or edit your events</p>
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

        {/* Recent activity */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink">recent activity</h2>
          {stats.recent_reviews && stats.recent_reviews.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_reviews.map((review) => (
                <Card key={review.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={star <= review.rating ? '#f5a623' : 'none'}
                            stroke={star <= review.rating ? '#f5a623' : '#e5e7eb'}
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-grey line-clamp-2">{review.comment}</p>
                    </div>
                    <span className="text-xs text-grey-light ml-2">
                      {new Date(review.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-6">
                <p className="text-grey text-sm">No recent activity yet</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <div className="text-2xl font-bold text-ink">{value.toLocaleString()}</div>
      <div className="text-xs text-grey">{label}</div>
    </Card>
  );
}
