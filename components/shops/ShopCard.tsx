'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <Link href={`/shops/${shop.slug}`} className="block">
      <div className="card card-hover overflow-hidden">
        {/* Image */}
        <div className="relative h-32 bg-grey-light">
          {shop.images && shop.images[0] ? (
            <Image
              src={shop.images[0].url}
              alt={shop.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
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

          {/* Category badge */}
          {shop.category && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" size="sm">
                {shop.category.name}
              </Badge>
            </div>
          )}

          {/* Save button */}
          {showSaveButton && (
            <button
              onClick={handleSaveClick}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-card hover:shadow-card-hover transition-shadow"
              aria-label={isSaved ? 'Remove from saved' : 'Save shop'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isSaved ? '#f47b5c' : 'none'}
                stroke={isSaved ? '#f47b5c' : 'currentColor'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-ink truncate">{shop.name}</h3>
          {shop.tagline && (
            <p className="text-sm text-grey truncate mt-0.5">{shop.tagline}</p>
          )}

          {/* Open status */}
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                openStatus.isOpen ? 'bg-green' : 'bg-grey'
              }`}
            />
            <span className="text-xs text-grey">{openStatus.message}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
