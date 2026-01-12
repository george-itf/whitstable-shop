'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Badge from '@/components/ui/Badge';
import { CATEGORY_COLORS } from '@/lib/constants';

// Mock shops data
const mockShops = [
  { id: '1', name: 'Wheelers Oyster Bar', slug: 'wheelers-oyster-bar', lat: 51.3607, lng: 1.0253, category: 'oysters-seafood' },
  { id: '2', name: 'The Forge', slug: 'the-forge', lat: 51.3610, lng: 1.0260, category: 'restaurant-pub' },
  { id: '3', name: 'Harbour Books', slug: 'harbour-books', lat: 51.3608, lng: 1.0255, category: 'books-records' },
  { id: '4', name: "JoJo's", slug: 'jojos', lat: 51.3612, lng: 1.0248, category: 'fish-chips-takeaway' },
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'oysters-seafood', name: 'Oysters' },
  { id: 'cafe-coffee', name: 'Café' },
  { id: 'restaurant-pub', name: 'Restaurant' },
  { id: 'fish-chips-takeaway', name: 'Takeaway' },
  { id: 'books-records', name: 'Books' },
];

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShop, setSelectedShop] = useState<typeof mockShops[0] | null>(null);

  const filteredShops = selectedCategory === 'all'
    ? mockShops
    : mockShops.filter(shop => shop.category === selectedCategory);

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-ink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <h1 className="font-bold text-xl text-ink">map</h1>
        </div>

        {/* Category filters */}
        <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-sky text-white'
                    : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="h-screen bg-sky-light relative">
        {/* Map placeholder with markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Grid pattern */}
            <svg
              viewBox="0 0 430 800"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <pattern
                  id="mapGridFull"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#5BB5E0"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGridFull)" />
              {/* Coastline */}
              <path
                d="M0 300 Q100 280 200 290 T400 275 L430 275 L430 0 L0 0 Z"
                fill="#a8d5e8"
                opacity="0.5"
              />
            </svg>

            {/* Shop markers */}
            {filteredShops.map((shop, index) => {
              // Convert lat/lng to approximate pixel positions
              const x = 100 + (index * 80);
              const y = 350 + (index % 2 === 0 ? 0 : 50);
              const color = CATEGORY_COLORS[shop.category] || '#5BB5E0';

              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="absolute transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
                  style={{ left: x, top: y }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill={color}
                    stroke={color}
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" fill="white" />
                  </svg>
                </button>
              );
            })}

            {/* Amenity markers */}
            <div className="absolute" style={{ left: 300, top: 400 }}>
              <div className="w-6 h-6 bg-grey-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
            </div>
            <div className="absolute" style={{ left: 150, top: 320 }}>
              <div className="w-6 h-6 bg-sky rounded-full flex items-center justify-center text-white text-xs font-bold">
                WC
              </div>
            </div>
          </div>
        </div>

        {/* Map notice */}
        <div className="absolute bottom-24 left-4 right-4 bg-white rounded-card p-3 shadow-card text-center">
          <p className="text-sm text-grey">
            Interactive Mapbox map will display here when configured with API key
          </p>
        </div>

        {/* Selected shop card */}
        {selectedShop && (
          <div className="absolute bottom-24 left-4 right-4 bg-white rounded-card shadow-card overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-ink">{selectedShop.name}</h3>
                  <Badge variant="default" size="sm" className="mt-1">
                    {selectedShop.category.replace(/-/g, ' ')}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedShop(null)}
                  className="p-1 text-grey hover:text-ink"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <Link
                href={`/shops/${selectedShop.slug}`}
                className="mt-3 block w-full py-2 bg-sky text-white text-center rounded-button font-semibold"
              >
                View shop
              </Link>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
