'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Offer, Shop } from '@/types/database';

type OfferWithShop = Offer & { shop: Pick<Shop, 'name' | 'slug'> };

export default function DealsPreview() {
  const [deals, setDeals] = useState<OfferWithShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch('/api/offers?active=true&limit=3');
        if (res.ok) {
          const data = await res.json();
          setDeals(data);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, []);

  // Don't render section if no deals and not loading
  if (!isLoading && deals.length === 0) {
    return null;
  }

  const formatValidity = (offer: OfferWithShop) => {
    if (offer.is_ongoing) return 'Ongoing';
    if (offer.valid_until) {
      const endDate = new Date(offer.valid_until);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) return 'Ending today';
      if (daysLeft === 1) return 'Ends tomorrow';
      if (daysLeft <= 7) return `Ends in ${daysLeft} days`;
      return `Until ${endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    }
    return 'Limited time';
  };

  return (
    <section className="py-6">
      <div className="px-4 flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-ink">Local Deals</h2>
        <Link
          href="/offers"
          className="text-sm text-sky font-medium hover:underline"
        >
          See all
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-48 p-3 bg-coral-light rounded-card border border-coral/20 animate-pulse"
              >
                <div className="h-4 bg-coral/20 rounded w-2/3 mb-2" />
                <div className="h-5 bg-coral/20 rounded w-full mb-1" />
                <div className="h-3 bg-coral/20 rounded w-1/2" />
              </div>
            ))
          ) : (
            deals.map((deal) => (
              <Link
                key={deal.id}
                href="/offers"
                className="flex-shrink-0 w-48 p-3 bg-coral-light rounded-card border border-coral/20 hover:border-coral transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-coral"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <span className="text-xs text-coral font-medium">
                    {formatValidity(deal)}
                  </span>
                </div>
                <p className="font-semibold text-ink text-sm mb-0.5">
                  {deal.title}
                </p>
                <p className="text-xs text-grey">{deal.shop?.name}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
