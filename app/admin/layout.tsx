'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Heart,
  Tag,
  Camera,
  Settings,
  Bell,
  Megaphone,
  Medal,
  Link as LinkIcon,
  BarChart3,
  Users,
  Clock,
  Shield,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Home,
  Star,
  MapPin,
  ClipboardCheck,
  Info,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard', 'content', 'moderation']);
  const [stats, setStats] = useState({
    pendingShops: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    async function checkAdmin() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login?redirect=/admin');
          return;
        }

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

        // Fetch pending counts
        const [shopsRes, reviewsRes] = await Promise.all([
          supabase
            .from('shops')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase
            .from('reviews')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
        ]);

        setStats({
          pendingShops: shopsRes.count || 0,
          pendingReviews: reviewsRes.count || 0,
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navSections: NavSection[] = [
    {
      title: 'Dashboard',
      items: [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/admin/activity', label: 'Activity Log', icon: Clock },
      ],
    },
    {
      title: 'Content',
      items: [
        { href: '/admin/directory', label: 'Local Directory', icon: MapPin },
        { href: '/admin/events', label: "What's On", icon: Calendar },
        { href: '/admin/charities', label: 'Charities', icon: Heart },
        { href: '/admin/offers', label: 'Offers & Deals', icon: Tag },
        { href: '/admin/local-info', label: 'Local Info Pages', icon: Info },
        { href: '/admin/categories', label: 'Categories', icon: FileText },
        { href: '/admin/photos', label: 'Photo Competitions', icon: Camera },
      ],
    },
    {
      title: 'Moderation',
      items: [
        { href: '/admin/moderation', label: 'Moderation Queue', icon: ClipboardCheck, badge: stats.pendingShops + stats.pendingReviews },
        { href: '/admin/shops', label: 'Approve Shops', icon: Store, badge: stats.pendingShops },
        { href: '/admin/reviews', label: 'Moderate Reviews', icon: Star, badge: stats.pendingReviews },
      ],
    },
    {
      title: 'Settings',
      items: [
        { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
        { href: '/admin/notices', label: 'Banner Notices', icon: Bell },
        { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
        { href: '/admin/nominations', label: 'Award Nominations', icon: Medal },
        { href: '/admin/quick-links', label: 'Quick Links', icon: LinkIcon },
      ],
    },
    {
      title: 'Admin',
      items: [
        { href: '/admin/users', label: 'User Management', icon: Users },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access the admin area.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white rounded-lg font-semibold hover:bg-coral/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-coral rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">Admin</span>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300',
          'lg:translate-x-0',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <span className="font-bold text-gray-900 text-lg">Admin</span>
                <p className="text-xs text-gray-500">whitstable.shop</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-8rem)]">
          {navSections.map((section, idx) => (
            <div key={section.title} className={cn('mb-2', idx > 0 && 'mt-4')}>
              {isSidebarOpen ? (
                <button
                  onClick={() => toggleSection(section.title.toLowerCase())}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-900"
                >
                  {section.title}
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      expandedSections.includes(section.title.toLowerCase()) && 'rotate-180'
                    )}
                  />
                </button>
              ) : (
                <div className="h-8" />
              )}

              {(expandedSections.includes(section.title.toLowerCase()) || !isSidebarOpen) && (
                <ul className="space-y-1">
                  {section.items.map(item => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                            isActive
                              ? 'bg-coral text-white'
                              : 'text-gray-700 hover:bg-gray-100',
                            !isSidebarOpen && 'justify-center'
                          )}
                          title={!isSidebarOpen ? item.label : undefined}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {isSidebarOpen && (
                            <>
                              <span className="flex-1 font-medium">{item.label}</span>
                              {item.badge && item.badge > 0 && (
                                <span className={cn(
                                  'px-2 py-0.5 text-xs font-semibold rounded-full',
                                  isActive ? 'bg-white/20 text-white' : 'bg-coral text-white'
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {!isSidebarOpen && item.badge && item.badge > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronRight className={cn('w-5 h-5 transition-transform', !isSidebarOpen && 'rotate-180')} />
            </button>
            {isSidebarOpen && (
              <>
                <Link
                  href="/"
                  className="flex-1 flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <Home className="w-4 h-4" />
                  View Site
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 pt-16 lg:pt-0',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {children}
      </main>
    </div>
  );
}
