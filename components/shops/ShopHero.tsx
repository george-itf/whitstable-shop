'use client';

import Image from 'next/image';
import Link from 'next/link';
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
      <div className="relative h-56 bg-grey-light">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={shop.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-grey-light to-grey-light/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-grey"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link
            href="/shops"
            className="p-2 bg-white/90 rounded-full shadow-card hover:bg-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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

          <button
            onClick={handleShare}
            className="p-2 bg-white/90 rounded-full shadow-card hover:bg-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        {/* Category pill */}
        {category && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="default">{category.name}</Badge>
          </div>
        )}
      </div>

      {/* Shop info */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-ink">{shop.name}</h1>
        {shop.tagline && (
          <p className="text-grey mt-1">{shop.tagline}</p>
        )}

        {/* Open status */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              openStatus.isOpen ? 'bg-green' : 'bg-grey'
            }`}
          />
          <span
            className={`text-sm font-medium ${
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
