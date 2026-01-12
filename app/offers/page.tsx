'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Button, Card, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { OfferCard } from '@/components/offers';
import type { Offer, Shop } from '@/types/database';

type OfferWithShop = Offer & { shop: Pick<Shop, 'name' | 'slug'> };

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Tag className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Deals & Offers</h1>
          <p className="text-oyster-600">Special offers from local shops</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-oyster-900">{offers.length}</p>
          <p className="text-sm text-oyster-500">Active Offers</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-oyster-900">{ongoingCount}</p>
          <p className="text-sm text-oyster-500">Ongoing Deals</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-oyster-900">{shopCount}</p>
          <p className="text-sm text-oyster-500">Participating Shops</p>
        </Card>
      </div>

      {/* Filters & Tabs */}
      <Tabs defaultValue="all" onChange={(v) => setFilter(v as typeof filter)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Offers</TabsTrigger>
            <TabsTrigger value="discount">Discounts</TabsTrigger>
            <TabsTrigger value="freebie">Freebies</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-5 bg-oyster-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-oyster-200 rounded w-full mb-2" />
                <div className="h-4 bg-oyster-200 rounded w-2/3 mb-4" />
                <div className="h-8 bg-oyster-200 rounded w-1/3" />
              </Card>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <Card className="text-center py-12">
            <Tag className="h-12 w-12 text-oyster-300 mx-auto mb-4" />
            <p className="text-oyster-600">No offers available right now</p>
            <p className="text-sm text-oyster-500 mt-1">Check back soon!</p>
          </Card>
        ) : (
          <>
            <TabsContent value="all">
              <div className="grid sm:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discount">
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="freebie">
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="loyalty">
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* CTA for shops */}
      <Card className="mt-8 bg-ocean-50 border-ocean-200 text-center">
        <Tag className="h-10 w-10 text-ocean-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-oyster-900 mb-2">Are you a local shop owner?</h2>
        <p className="text-oyster-600 mb-4 max-w-md mx-auto">
          Add your offers to reach thousands of locals and visitors looking for great deals in Whitstable.
        </p>
        <Button>Add Your Offer</Button>
      </Card>
    </div>
  );
}
