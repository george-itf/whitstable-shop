'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { StatCard, BarChart, LineChart, DonutChart, Card, Badge, Skeleton } from '@/components/ui';
import {
  ArrowLeft,
  Store,
  Star,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Camera,
  Gift,
  Trophy,
} from 'lucide-react';

interface Analytics {
  overview: {
    totalShops: number;
    totalReviews: number;
    totalEvents: number;
    totalUsers: number;
    pendingShops: number;
    pendingReviews: number;
  };
  shopsByCategory: Array<{ name: string; count: number; color: string }>;
  reviewsByRating: Array<{ rating: number; count: number }>;
  activityByDay: Array<{ day: string; views: number; signups: number }>;
  recentActivity: Array<{
    type: string;
    title: string;
    time: string;
    user?: string;
  }>;
  topShops: Array<{
    name: string;
    views: number;
    saves: number;
    reviews: number;
  }>;
}

const categoryColors: Record<string, string> = {
  'Food & Drink': '#F97316',
  'Shopping': '#0EA5E9',
  'Services': '#8B5CF6',
  'Health & Beauty': '#EC4899',
  'Art & Crafts': '#14B8A6',
  'Entertainment': '#F59E0B',
  'Other': '#6B7280',
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
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

      // Fetch analytics data
      const [
        shopsRes,
        reviewsRes,
        eventsRes,
        usersRes,
        pendingShopsRes,
        pendingReviewsRes,
        categoriesRes,
        ratingsRes,
        topShopsRes,
      ] = await Promise.all([
        supabase.from('shops').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('shops').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('shops')
          .select('category:categories(name)')
          .eq('status', 'approved'),
        supabase.from('reviews')
          .select('rating')
          .eq('status', 'approved'),
        supabase.from('shops')
          .select('name, view_count, save_count')
          .eq('status', 'approved')
          .order('view_count', { ascending: false, nullsFirst: false })
          .limit(5),
      ]);

      // Process category data
      const categoryCount: Record<string, number> = {};
      (categoriesRes.data || []).forEach((shop: { category: { name: string } | { name: string }[] | null }) => {
        const cat = Array.isArray(shop.category) ? shop.category[0] : shop.category;
        const name = cat?.name || 'Other';
        categoryCount[name] = (categoryCount[name] || 0) + 1;
      });

      const shopsByCategory = Object.entries(categoryCount)
        .map(([name, count]) => ({
          name,
          count,
          color: categoryColors[name] || categoryColors['Other'],
        }))
        .sort((a, b) => b.count - a.count);

      // Process ratings data
      const ratingCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      (ratingsRes.data || []).forEach((review: { rating: number }) => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCount[review.rating]++;
        }
      });

      const reviewsByRating = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: ratingCount[rating],
      }));

      // Generate mock activity data (replace with real data when available)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const activityByDay = days.map((day) => ({
        day,
        views: Math.floor(Math.random() * 500) + 100,
        signups: Math.floor(Math.random() * 20) + 5,
      }));

      // Process top shops
      const topShops = (topShopsRes.data || []).map((shop: { name: string; view_count: number | null; save_count: number | null }) => ({
        name: shop.name,
        views: shop.view_count || 0,
        saves: shop.save_count || 0,
        reviews: 0,
      }));

      setAnalytics({
        overview: {
          totalShops: shopsRes.count || 0,
          totalReviews: reviewsRes.count || 0,
          totalEvents: eventsRes.count || 0,
          totalUsers: usersRes.count || 0,
          pendingShops: pendingShopsRes.count || 0,
          pendingReviews: pendingReviewsRes.count || 0,
        },
        shopsByCategory,
        reviewsByRating,
        activityByDay,
        recentActivity: [],
        topShops,
      });

      setIsLoading(false);
    }

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="px-4 py-6 space-y-6">
          <Skeleton variant="heading" className="w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="card" className="h-24" />
            ))}
          </div>
          <Skeleton variant="card" className="h-64" />
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
          <div>
            <h1 className="text-lg font-bold text-ink">Analytics Dashboard</h1>
            <p className="text-xs text-grey">Site performance overview</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24 space-y-6">
        {/* Overview Stats */}
        <section>
          <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              title="Total Shops"
              value={analytics?.overview.totalShops || 0}
              icon={Store}
              color="sky"
              trend={{ value: 12, label: 'this month' }}
            />
            <StatCard
              title="Reviews"
              value={analytics?.overview.totalReviews || 0}
              icon={Star}
              color="yellow"
              trend={{ value: 8, label: 'this month' }}
            />
            <StatCard
              title="Events"
              value={analytics?.overview.totalEvents || 0}
              icon={Calendar}
              color="coral"
            />
            <StatCard
              title="Users"
              value={analytics?.overview.totalUsers || 0}
              icon={Users}
              color="purple"
              trend={{ value: 15, label: 'this month' }}
            />
          </div>
        </section>

        {/* Pending Items Alert */}
        {((analytics?.overview.pendingShops || 0) > 0 || (analytics?.overview.pendingReviews || 0) > 0) && (
          <Card variant="warning" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink">Items Awaiting Review</p>
              <p className="text-sm text-grey">
                {analytics?.overview.pendingShops || 0} shops, {analytics?.overview.pendingReviews || 0} reviews pending
              </p>
            </div>
            <Link href="/admin/moderation">
              <Badge variant="warning">Review</Badge>
            </Link>
          </Card>
        )}

        {/* Weekly Activity Chart */}
        <section>
          <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3">
            Weekly Activity
          </h2>
          <Card>
            <h3 className="font-semibold text-ink mb-4">Page Views</h3>
            <LineChart
              data={analytics?.activityByDay.map((d) => ({ label: d.day, value: d.views })) || []}
              height={150}
              color="#0EA5E9"
            />
          </Card>
        </section>

        {/* Shops by Category */}
        <section>
          <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3">
            Shops by Category
          </h2>
          <Card>
            <DonutChart
              data={analytics?.shopsByCategory.map((cat) => ({
                label: cat.name,
                value: cat.count,
                color: cat.color,
              })) || []}
              centerValue={analytics?.overview.totalShops || 0}
              centerLabel="Total"
            />
          </Card>
        </section>

        {/* Reviews by Rating */}
        <section>
          <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3">
            Review Distribution
          </h2>
          <Card>
            <BarChart
              data={analytics?.reviewsByRating.map((r) => ({
                label: `${r.rating} Star${r.rating !== 1 ? 's' : ''}`,
                value: r.count,
                color: r.rating >= 4 ? 'bg-green-500' : r.rating === 3 ? 'bg-amber-500' : 'bg-red-500',
              })) || []}
            />
          </Card>
        </section>

        {/* Top Shops */}
        <section>
          <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3">
            Top Performing Shops
          </h2>
          <Card>
            <div className="space-y-3">
              {analytics?.topShops.map((shop, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-grey-light/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-sky-light flex items-center justify-center">
                    <span className="font-bold text-sky">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{shop.name}</p>
                    <div className="flex items-center gap-3 text-xs text-grey">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {shop.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {shop.saves}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick Stats Grid */}
        <section>
          <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3">
            Feature Usage
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center py-4">
              <Camera className="w-6 h-6 mx-auto text-purple-500 mb-2" />
              <p className="text-lg font-bold text-ink">24</p>
              <p className="text-xs text-grey">Photo Entries</p>
            </Card>
            <Card className="text-center py-4">
              <Gift className="w-6 h-6 mx-auto text-coral mb-2" />
              <p className="text-lg font-bold text-ink">8</p>
              <p className="text-xs text-grey">Active Offers</p>
            </Card>
            <Card className="text-center py-4">
              <Trophy className="w-6 h-6 mx-auto text-amber-500 mb-2" />
              <p className="text-lg font-bold text-ink">12</p>
              <p className="text-xs text-grey">Nominations</p>
            </Card>
          </div>
        </section>
      </div>
    </MobileWrapper>
  );
}
