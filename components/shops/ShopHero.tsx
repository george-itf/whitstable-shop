'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Share2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Shop, Category } from '@/types';
import { isCurrentlyOpen } from '@/lib/utils';

interface ShopHeroProps {
  shop: Shop;
  category?: Category | null;
  primaryImage?: string;
}

export default function ShopHero({ shop, category, primaryImage }: ShopHeroProps) {
  const openStatus = isCurrentlyOpen(shop.opening_hours);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shop.name,
          text: shop.tagline || `Check out ${shop.name} in Whitstable`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="relative">
      {/* Image */}
      <div className="relative h-60 bg-oyster-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={shop.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-light to-ocean-100">
            <div className="text-sky/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </div>
        )}

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link
            href="/shops"
            className="p-2.5 bg-white/95 rounded-xl shadow-soft hover:bg-white transition-all tap-effect"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </Link>

          <button
            onClick={handleShare}
            className="p-2.5 bg-white/95 rounded-xl shadow-soft hover:bg-white transition-all tap-effect"
          >
            <Share2 className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Category pill */}
        {category && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="default" className="bg-white/95 text-ink shadow-soft">
              {category.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Shop info */}
      <div className="px-4 py-4 border-b border-grey-light">
        <div>
          <h1 className="text-2xl font-bold text-ink">{shop.name}</h1>
          {shop.tagline && (
            <p className="text-grey mt-1">{shop.tagline}</p>
          )}
        </div>

        {/* Open status */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`w-2 h-2 rounded-full ${
              openStatus.isOpen ? 'bg-green animate-pulse' : 'bg-grey'
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              openStatus.isOpen ? 'text-green' : 'text-grey'
            }`}
          >
            {openStatus.message}
          </span>
        </div>
      </div>
    </div>
  );
}
