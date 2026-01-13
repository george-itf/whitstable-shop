'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Shop, Category } from '@/types';
import { isCurrentlyOpen } from '@/lib/utils';

interface ShopCardProps {
  shop: Shop & { category?: Category | null };
  showSaveButton?: boolean;
  isSaved?: boolean;
  onToggleSave?: (shopId: string) => void;
}

export default function ShopCard({
  shop,
  showSaveButton = true,
  isSaved = false,
  onToggleSave,
}: ShopCardProps) {
  const openStatus = isCurrentlyOpen(shop.opening_hours);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(shop.id);
  };

  return (
    <Link href={`/shops/${shop.slug}`} className="block group">
      <div className="card card-hover overflow-hidden">
        {/* Image */}
        <div className="relative h-36 bg-oyster-100">
          {shop.images && shop.images[0] ? (
            <Image
              src={shop.images[0].url}
              alt={shop.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-light to-ocean-100">
              <div className="text-sky/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
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

          {/* Category badge */}
          {shop.category && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="default" size="sm" className="bg-white/95 text-ink shadow-sm">
                {shop.category.name}
              </Badge>
            </div>
          )}

          {/* Save button */}
          {showSaveButton && (
            <button
              onClick={handleSaveClick}
              className="absolute top-2.5 right-2.5 p-2 bg-white/95 rounded-xl shadow-sm hover:bg-white transition-all active:scale-95"
              aria-label={isSaved ? 'Remove from saved' : 'Save shop'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isSaved ? 'text-coral fill-coral' : 'text-oyster-400'
                }`}
              />
            </button>
          )}

          {/* Open/Closed indicator */}
          <div className="absolute bottom-2.5 right-2.5">
            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
              openStatus.isOpen
                ? 'bg-green/90 text-white'
                : 'bg-oyster-600/90 text-white'
            }`}>
              {openStatus.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          <h3 className="font-bold text-ink truncate group-hover:text-sky transition-colors">
            {shop.name}
          </h3>
          {shop.tagline && (
            <p className="text-sm text-grey truncate mt-0.5">{shop.tagline}</p>
          )}

          {/* Location hint */}
          {shop.address_line1 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-oyster-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{shop.address_line1}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
