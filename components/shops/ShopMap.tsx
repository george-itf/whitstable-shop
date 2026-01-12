'use client';

import { Shop } from '@/types';

interface ShopMapProps {
  shop: Shop;
}

export default function ShopMap({ shop }: ShopMapProps) {
  const hasLocation = shop.latitude && shop.longitude;
  const address = [shop.address_line1, shop.address_line2, shop.postcode]
    .filter(Boolean)
    .join(', ');

  const handleOpenMap = () => {
    if (hasLocation) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`,
        '_blank'
      );
    } else if (shop.postcode) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.postcode)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="px-4 py-4 border-b border-grey-light">
      <h2 className="font-bold text-ink mb-3">location</h2>

      {/* Static map preview */}
      <button
        onClick={handleOpenMap}
        className="w-full relative h-32 bg-grey-light rounded-card overflow-hidden mb-3"
      >
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="#f47b5c"
              stroke="#f47b5c"
              className="mx-auto mb-2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
            <span className="text-xs text-grey">Tap to open in maps</span>
          </div>
        </div>

        {/* Grid pattern */}
        <svg
          viewBox="0 0 400 120"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full opacity-20"
        >
          <defs>
            <pattern
              id="mapGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#5BB5E0"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>
      </button>

      {/* Address */}
      {address && (
        <button
          onClick={handleOpenMap}
          className="w-full flex items-start gap-3 text-left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-grey flex-shrink-0 mt-0.5"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm text-ink">{address}</span>
        </button>
      )}
    </div>
  );
}
