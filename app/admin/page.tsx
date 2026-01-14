'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Store,
  Heart,
  Calendar,
  Tag,
  Camera,
  ClipboardCheck,
  TrendingUp,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingBag,
} from 'lucide-react';

interface AdminStats {
  pendingShops: number;
  pendingReviews: number;
  activeNotices: number;
  totalShops: number;
  totalEvents: number;
  totalCharities: number;
  activeOffers: number;
  totalCategories: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    pendingShops: 0,
    pendingReviews: 0,
    activeNotices: 0,
    totalShops: 0,
    totalEvents: 0,
    totalCharities: 0,
    activeOffers: 0,
    totalCategories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const supabase = createClient();

        // Fetch comprehensive stats
        const [
          shopsRes,
          reviewsRes,
          noticesRes,
          totalShopsRes,
          eventsRes,
          charitiesRes,
          offersRes,
          categoriesRes,
        ] = await Promise.all([
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
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase
            .from('charities')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true),
          supabase
            .from('offers')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          pendingShops: shopsRes.count || 0,
          pendingReviews: reviewsRes.count || 0,
          activeNotices: noticesRes.count || 0,
          totalShops: totalShopsRes.count || 0,
          totalEvents: eventsRes.count || 0,
          totalCharities: charitiesRes.count || 0,
          activeOffers: offersRes.count || 0,
          totalCategories: categoriesRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-72 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pendingTotal = stats.pendingShops + stats.pendingReviews;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the whitstable.shop admin center</p>
      </div>

      {/* Urgent Alert */}
      {pendingTotal > 0 && (
        <Link href="/admin/moderation">
          <div className="mb-8 bg-gradient-to-r from-coral to-coral/80 rounded-xl p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Moderation Queue</h2>
                  <p className="text-white/80">{pendingTotal} items need your attention</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Shops"
          value={stats.totalShops}
          icon={Store}
          trend={12}
          color="coral"
        />
        <StatCard
          title="Active Events"
          value={stats.totalEvents}
          icon={Calendar}
          trend={8}
          color="sky"
        />
        <StatCard
          title="Charities"
          value={stats.totalCharities}
          icon={Heart}
          trend={-2}
          color="green"
        />
        <StatCard
          title="Active Offers"
          value={stats.activeOffers}
          icon={Tag}
          trend={15}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-coral" />
            Needs Attention
          </h3>
          <div className="space-y-3">
            <QuickActionItem
              href="/admin/shops"
              label="Pending Shop Submissions"
              count={stats.pendingShops}
              urgent={stats.pendingShops > 0}
            />
            <QuickActionItem
              href="/admin/reviews"
              label="Reviews to Moderate"
              count={stats.pendingReviews}
              urgent={stats.pendingReviews > 0}
            />
            <QuickActionItem
              href="/admin/notices"
              label="Active Notices"
              count={stats.activeNotices}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky" />
            Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <MiniStat label="Categories" value={stats.totalCategories} icon={ShoppingBag} />
            <MiniStat label="Photo Contests" value={0} icon={Camera} />
            <MiniStat label="Total Users" value={0} icon={Users} />
            <MiniStat label="Page Views" value={0} icon={Eye} />
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Activity tracking coming soon</p>
          <Link href="/admin/activity" className="text-coral hover:underline mt-2 inline-block">
            View Activity Log →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend: number;
  color: 'coral' | 'sky' | 'green' | 'yellow';
}) {
  const colorClasses = {
    coral: 'bg-coral/10 text-coral',
    sky: 'bg-sky/10 text-sky',
    green: 'bg-green/10 text-green',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
}

// Quick Action Item Component
function QuickActionItem({
  href,
  label,
  count,
  urgent = false,
}: {
  href: string;
  label: string;
  count: number;
  urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className={`font-medium ${urgent ? 'text-coral' : 'text-gray-700'}`}>{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        urgent ? 'bg-coral text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    </Link>
  );
}

// Mini Stat Component
function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
