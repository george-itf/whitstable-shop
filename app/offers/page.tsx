'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Tag, Percent, Gift, Star, Store } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Card, EmptyState, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { OfferCard } from '@/components/offers';
import type { Offer, Shop } from '@/types/database';

type OfferWithShop = Offer & { shop: Pick<Shop, 'name' | 'slug'> };

const filterConfig = [
  { value: 'all', label: 'All', icon: Tag },
  { value: 'discount', label: 'Discounts', icon: Percent },
  { value: 'freebie', label: 'Freebies', icon: Gift },
  { value: 'loyalty', label: 'Loyalty', icon: Star },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferWithShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'discount' | 'freebie' | 'loyalty'>('all');

  useEffect(() => {
    async function fetchOffers() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/offers?active=true');
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffers();
  }, []);

  const filteredOffers =
    filter === 'all' ? offers : offers.filter((o) => o.offer_type === filter);

  const ongoingCount = offers.filter((o) => o.is_ongoing).length;
  const shopCount = new Set(offers.map((o) => o.shop_id)).size;

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-gradient-to-br from-green to-green/80 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">deals</h1>
              <p className="text-white/70 text-sm">offers from local shops</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-light rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green">{offers.length}</p>
            <p className="text-xs text-green/80">active</p>
          </div>
          <div className="bg-coral-light rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-coral">{ongoingCount}</p>
            <p className="text-xs text-coral/80">ongoing</p>
          </div>
          <div className="bg-sky-light rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-sky">{shopCount}</p>
            <p className="text-xs text-sky/80">shops</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pb-4">
        <Tabs defaultValue="all" onChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="w-full">
            {filterConfig.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="flex-1">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Offers list */}
          <div className="mt-4 pb-24">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 skeleton rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 skeleton w-3/4" />
                        <div className="h-4 skeleton w-full" />
                        <div className="h-3 skeleton w-1/2" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredOffers.length === 0 ? (
              <EmptyState
                icon={Tag}
                title={filter === 'all' ? 'No offers available' : `No ${filter} offers`}
                description="Check back soon for new deals!"
                variant="card"
              />
            ) : (
              <>
                {['all', 'discount', 'freebie', 'loyalty'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue}>
                    <div className="space-y-3">
                      {(tabValue === 'all' ? offers : offers.filter(o => o.offer_type === tabValue)).map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </>
            )}
          </div>
        </Tabs>
      </div>

      {/* CTA for shops */}
      {!isLoading && (
        <div className="px-4 pb-24">
          <Card className="bg-gradient-to-br from-ocean-50 to-sky-light border-sky/20 p-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-sky rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">own a local shop?</h3>
                <p className="text-sm text-grey mb-3">
                  Add your offers and reach locals in Whitstable
                </p>
                <Link
                  href="/auth/signup?role=shop_owner"
                  className="inline-flex items-center text-sm font-semibold text-sky hover:text-sky-dark transition-colors"
                >
                  Get started →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      <BottomNav />
    </MobileWrapper>
  );
}
