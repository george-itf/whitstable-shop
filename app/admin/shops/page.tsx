'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

// Mock pending shops
const mockPendingShops = [
  {
    id: '10',
    name: 'The Cheese Box',
    tagline: 'Artisan cheese shop',
    category: 'Deli & Food',
    submittedAt: '2025-01-10',
    status: 'pending',
  },
  {
    id: '11',
    name: 'Seaside Pottery',
    tagline: 'Handmade ceramics',
    category: 'Gallery & Art',
    submittedAt: '2025-01-09',
    status: 'pending',
  },
  {
    id: '12',
    name: 'Neptune Coffee',
    tagline: 'Specialty coffee roasters',
    category: 'Café & Coffee',
    submittedAt: '2025-01-08',
    status: 'pending',
  },
];

export default function AdminShopsPage() {
  const [shops, setShops] = useState(mockPendingShops);

  const handleApprove = (id: string) => {
    setShops(shops.filter((s) => s.id !== id));
    // Would make API call to approve shop
  };

  const handleReject = (id: string) => {
    setShops(shops.filter((s) => s.id !== id));
    // Would make API call to reject shop
  };

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
          <Card className="text-center py-8">
            <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-grey">All caught up! No pending shops.</p>
          </Card>
        ) : (
          shops.map((shop) => (
            <Card key={shop.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-ink">{shop.name}</h3>
                  <p className="text-sm text-grey">{shop.tagline}</p>
                </div>
                <Badge variant="yellow" size="sm">pending</Badge>
              </div>

              <div className="text-sm text-grey mb-4">
                <p>Category: {shop.category}</p>
                <p>Submitted: {shop.submittedAt}</p>
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
