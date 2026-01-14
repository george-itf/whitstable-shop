'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import {
  Store,
  Heart,
  Calendar,
  MapPin,
  Tag,
  Camera,
  Megaphone,
  Settings,
  ClipboardCheck,
  Bell,
  Medal,
  Star,
  Home,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  Users,
  FileText,
  Link as LinkIcon,
  BarChart3,
  Shield,
  Clock,
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
  const router = useRouter();
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
  }, [router]);

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">admin portal</h1>
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
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">admin portal</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-coral" />
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
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-xl">admin portal</h1>
            <p className="text-white/80 text-xs">Manage everything in one place</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Shops" value={stats.totalShops} icon={Store} />
          <StatCard label="Events" value={stats.totalEvents} icon={Calendar} />
          <StatCard label="Charities" value={stats.totalCharities} icon={Heart} />
          <StatCard label="Offers" value={stats.activeOffers} icon={Tag} />
        </div>

        {/* Urgent Actions */}
        {(stats.pendingShops > 0 || stats.pendingReviews > 0) && (
          <div className="space-y-2">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-coral" />
              needs attention
            </h2>
            <Link href="/admin/moderation">
              <Card hoverable className="flex items-center gap-4 border-2 border-coral bg-coral-light/20">
                <div className="w-12 h-12 rounded-card bg-coral text-white flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">Moderation Queue</h3>
                  <p className="text-sm text-coral font-medium">
                    {stats.pendingShops + stats.pendingReviews} items pending
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-grey-light" />
              </Card>
            </Link>
          </div>
        )}

        {/* Content Management */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky" />
            content management
          </h2>

          <AdminLink
            href="/admin/directory"
            icon={MapPin}
            title="Local Directory"
            subtitle={`${stats.totalShops} shops & businesses`}
            color="coral"
          />

          <AdminLink
            href="/admin/events"
            icon={Calendar}
            title="What's On"
            subtitle={`${stats.totalEvents} events`}
            color="sky"
          />

          <AdminLink
            href="/admin/charities"
            icon={Heart}
            title="Charities"
            subtitle={`${stats.totalCharities} charity partners`}
            color="green"
          />

          <AdminLink
            href="/admin/offers"
            icon={Tag}
            title="Offers & Deals"
            subtitle={`${stats.activeOffers} active offers`}
            color="yellow"
          />

          <AdminLink
            href="/admin/categories"
            icon={Tag}
            title="Categories"
            subtitle={`${stats.totalCategories} shop categories`}
            color="purple"
          />

          <AdminLink
            href="/admin/photos"
            icon={Camera}
            title="Photo Competitions"
            subtitle="Manage photo contests"
            color="pink"
          />
        </div>

        {/* Site Settings */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink flex items-center gap-2">
            <Settings className="w-4 h-4 text-grey" />
            site settings
          </h2>

          <AdminLink
            href="/admin/site-settings"
            icon={Store}
            title="Store Settings"
            subtitle="Name, contact, social links"
            color="ink"
          />

          <AdminLink
            href="/admin/notices"
            icon={Bell}
            title="Banner Notices"
            subtitle={`${stats.activeNotices} active`}
            color="sky"
          />

          <AdminLink
            href="/admin/campaigns"
            icon={Megaphone}
            title="Campaigns"
            subtitle="Marketing & promotions"
            color="coral"
          />

          <AdminLink
            href="/admin/nominations"
            icon={Medal}
            title="Award Nominations"
            subtitle="Review & select winners"
            color="yellow"
          />

          <AdminLink
            href="/admin/quick-links"
            icon={LinkIcon}
            title="Quick Links"
            subtitle="Customize menu navigation"
            color="sky"
          />
        </div>

        {/* Moderation Tools */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink flex items-center gap-2">
            <Users className="w-4 h-4 text-grey" />
            moderation
          </h2>

          <AdminLink
            href="/admin/shops"
            icon={Home}
            title="Approve Shops"
            subtitle={`${stats.pendingShops} pending`}
            color="coral"
            urgent={stats.pendingShops > 0}
          />

          <AdminLink
            href="/admin/reviews"
            icon={Star}
            title="Moderate Reviews"
            subtitle={`${stats.pendingReviews} pending`}
            color="yellow"
            urgent={stats.pendingReviews > 0}
          />
        </div>

        {/* Admin Tools */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            admin tools
          </h2>

          <AdminLink
            href="/admin/analytics"
            icon={BarChart3}
            title="Analytics Dashboard"
            subtitle="Site performance & stats"
            color="purple"
          />

          <AdminLink
            href="/admin/users"
            icon={Users}
            title="User Management"
            subtitle="Manage users & roles"
            color="sky"
          />

          <AdminLink
            href="/admin/activity"
            icon={Clock}
            title="Activity Log"
            subtitle="View recent actions"
            color="grey"
          />
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="text-center py-3 px-2">
      <Icon className="w-5 h-5 mx-auto mb-1 text-grey" />
      <div className="text-lg font-bold text-ink">{value}</div>
      <div className="text-[10px] text-grey leading-tight">{label}</div>
    </Card>
  );
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  coral: { bg: 'bg-coral-light', text: 'text-coral' },
  sky: { bg: 'bg-sky-light', text: 'text-sky' },
  green: { bg: 'bg-green/10', text: 'text-green' },
  yellow: { bg: 'bg-yellow/10', text: 'text-yellow' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
  ink: { bg: 'bg-grey-light', text: 'text-ink' },
};

function AdminLink({
  href,
  icon: Icon,
  title,
  subtitle,
  color,
  urgent = false,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  urgent?: boolean;
}) {
  const colors = colorClasses[color] || colorClasses.ink;

  return (
    <Link href={href}>
      <Card hoverable className={`flex items-center gap-4 ${urgent ? 'border border-coral' : ''}`}>
        <div className={`w-11 h-11 rounded-card ${colors.bg} ${colors.text} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink">{title}</h3>
          <p className={`text-sm ${urgent ? 'text-coral font-medium' : 'text-grey'}`}>{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-grey-light flex-shrink-0" />
      </Card>
    </Link>
  );
}
