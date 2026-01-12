'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Lightbulb } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { ReportForm } from '@/components/reports';
import { Card } from '@/components/ui';
import type { Shop } from '@/types/database';

export default function ReportPage() {
  const [shops, setShops] = useState<Pick<Shop, 'id' | 'name'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShops() {
      try {
        const res = await fetch('/api/shops?status=approved');
        if (res.ok) {
          const data = await res.json();
          setShops(data.map((s: Shop) => ({ id: s.id, name: s.name })));
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShops();
  }, []);

  return (
    <MobileWrapper>
      {/* Header */}
      <header className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Submit a Report</h1>
            <p className="text-white/80 text-sm">Help keep Whitstable up-to-date</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {/* How it helps */}
        <Card className="mb-6 bg-coral-light border-coral/20">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-coral rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-oyster-900 mb-1">Your input matters!</h3>
              <p className="text-sm text-oyster-600">
                Help us keep the directory accurate. Report closed shops, wrong hours,
                or suggest new places. Earn badges for helpful contributions!
              </p>
            </div>
          </div>
        </Card>

        {/* Report Form */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-oyster-200 rounded w-1/3" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 bg-oyster-200 rounded-xl" />
              ))}
            </div>
            <div className="h-12 bg-oyster-200 rounded-lg" />
            <div className="h-32 bg-oyster-200 rounded-lg" />
          </div>
        ) : (
          <ReportForm shops={shops} />
        )}
      </main>

      <BottomNav />
    </MobileWrapper>
  );
}
