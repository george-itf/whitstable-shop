'use client';

import { Shop, Category } from '@/types';
import ShopCard from './ShopCard';

interface ShopListProps {
  shops: (Shop & { category?: Category | null })[];
  savedShopIds?: string[];
  onToggleSave?: (shopId: string) => void;
}

export default function ShopList({
  shops,
  savedShopIds = [],
  onToggleSave,
}: ShopListProps) {
  if (shops.length === 0) {
    return (
      <div className="text-center py-12">
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
          className="mx-auto text-grey-light mb-4"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <p className="text-grey">No shops found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          isSaved={savedShopIds.includes(shop.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
