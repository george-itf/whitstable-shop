import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  // Mock data - would come from user's shops
  const mockStats = {
    views: 1250,
    saves: 89,
    reviews: 12,
  };

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
          <StatCard label="Views" value={mockStats.views} />
          <StatCard label="Saves" value={mockStats.saves} />
          <StatCard label="Reviews" value={mockStats.reviews} />
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink">quick actions</h2>

          <Link href="/dashboard/shop">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-sky-light text-sky flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Edit Shop Details</h3>
                <p className="text-sm text-grey">Update your listing information</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey-light">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Card>
          </Link>

          <Link href="/dashboard/events">
            <Card hoverable className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-coral-light text-coral flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Manage Events</h3>
                <p className="text-sm text-grey">Add or edit your events</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey-light">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Card>
          </Link>
        </div>

        {/* Recent activity placeholder */}
        <div className="space-y-3">
          <h2 className="font-bold text-ink">recent activity</h2>
          <Card>
            <div className="text-center py-6">
              <p className="text-grey text-sm">
                Activity feed will appear here when connected to Supabase
              </p>
            </div>
          </Card>
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
