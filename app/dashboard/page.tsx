'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Eye, Heart, MessageSquare, Store, Calendar, ChevronRight, Star } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Card, Button, EmptyState } from '@/components/ui';
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
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

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
        <div className="bg-gradient-to-br from-sky to-sky-dark px-4 pt-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="skeleton w-5 h-5 rounded" />
            <div className="skeleton h-6 w-24 rounded" />
          </div>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-16 rounded-xl" />
        </div>
      </MobileWrapper>
    );
  }

  if (isAuthenticated === false) {
    return (
      <MobileWrapper>
        <div className="bg-gradient-to-br from-sky to-sky-dark px-4 pt-4 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <EmptyState
            icon={LayoutDashboard}
            title="Sign in to access dashboard"
            description="Manage your shop listing and view stats"
            action={{ label: 'Sign in', href: '/auth/login?redirect=/dashboard' }}
            variant="card"
          />
        </div>
      </MobileWrapper>
    );
  }

  if (!stats?.has_shop) {
    return (
      <MobileWrapper>
        <div className="bg-gradient-to-br from-sky to-sky-dark px-4 pt-4 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <EmptyState
            icon={Store}
            title="No shop listing yet"
            description="Submit your shop to whitstable.shop"
            action={{ label: 'Submit a shop', href: '/submit-shop' }}
            variant="card"
          />
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Sky gradient header */}
      <div className="bg-gradient-to-br from-sky to-sky-dark px-4 pt-4 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">back</span>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-white/80 text-sm">Your shop performance</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Eye className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{stats.views}</p>
            <p className="text-xs text-white/70">views</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Heart className="w-4 h-4 text-coral mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{stats.saves}</p>
            <p className="text-xs text-white/70">saves</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <MessageSquare className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{stats.reviews}</p>
            <p className="text-xs text-white/70">reviews</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Quick actions */}
        <div className="mb-6">
          <h2 className="font-semibold text-ink text-sm mb-3 section-title">Quick Actions</h2>

          <div className="space-y-2">
            <Link href="/dashboard/shop">
              <Card className="flex items-center gap-3 hover:bg-oyster-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-light text-sky flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ink text-sm">Edit Shop Details</h3>
                  <p className="text-xs text-oyster-500">Update your listing</p>
                </div>
                <ChevronRight className="w-4 h-4 text-oyster-400" />
              </Card>
            </Link>

            <Link href="/dashboard/events">
              <Card className="flex items-center gap-3 hover:bg-oyster-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-coral-light text-coral flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ink text-sm">Manage Events</h3>
                  <p className="text-xs text-oyster-500">Add or edit events</p>
                </div>
                <ChevronRight className="w-4 h-4 text-oyster-400" />
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="font-semibold text-ink text-sm mb-3 section-title">Recent Reviews</h2>
          {stats.recent_reviews && stats.recent_reviews.length > 0 ? (
            <div className="space-y-2">
              {stats.recent_reviews.map((review, index) => (
                <Card
                  key={review.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'text-yellow fill-yellow'
                                : 'text-oyster-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-oyster-600 line-clamp-2">{review.comment}</p>
                    </div>
                    <span className="text-[10px] text-oyster-400 ml-2">
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
            <Card className="text-center py-6 bg-oyster-50">
              <MessageSquare className="w-8 h-8 text-oyster-300 mx-auto mb-2" />
              <p className="text-xs text-oyster-500">No reviews yet</p>
            </Card>
          )}
        </div>
      </div>
    </MobileWrapper>
  );
}
