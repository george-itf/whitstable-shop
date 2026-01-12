import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';

export default function AdminPage() {
  // Mock stats
  const stats = {
    pendingShops: 3,
    pendingReviews: 5,
    activeNotices: 1,
    totalShops: 47,
  };

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

          <Link href="/admin/shops">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-coral-light text-coral flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Approve Shops</h3>
                <p className="text-sm text-grey">{stats.pendingShops} pending approval</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey-light">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Card>
          </Link>

          <Link href="/admin/reviews">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-yellow/10 text-yellow flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Moderate Reviews</h3>
                <p className="text-sm text-grey">{stats.pendingReviews} flagged for review</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey-light">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Card>
          </Link>

          <Link href="/admin/notices">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-sky-light text-sky flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Manage Notices</h3>
                <p className="text-sm text-grey">{stats.activeNotices} active banner</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey-light">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Card>
          </Link>
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function StatCard({ label, value, urgent = false }: { label: string; value: number; urgent?: boolean }) {
  return (
    <Card className="text-center">
      <div className={`text-2xl font-bold ${urgent && value > 0 ? 'text-coral' : 'text-ink'}`}>
        {value}
      </div>
      <div className="text-xs text-grey">{label}</div>
    </Card>
  );
}
