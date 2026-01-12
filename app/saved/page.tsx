'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import { Category } from '@/types';

// Mock saved shops (in real app, would fetch user's saves)
const mockCategories: Category[] = [
  { id: '1', name: 'Oysters & Seafood', slug: 'oysters-seafood', icon: null, display_order: 1 },
  { id: '4', name: 'Fish & Chips', slug: 'fish-chips-takeaway', icon: null, display_order: 4 },
];

const mockSavedShops = [
  {
    id: '1',
    owner_id: null,
    name: 'Wheelers Oyster Bar',
    slug: 'wheelers-oyster-bar',
    tagline: 'Whitstable\'s oldest oyster bar',
    description: 'Family-run since 1856',
    category_id: '1',
    phone: '01234 567890',
    email: null,
    website: null,
    instagram: '@wheelers',
    address_line1: '8 High Street',
    address_line2: null,
    postcode: 'CT5 1BQ',
    latitude: 51.3607,
    longitude: 1.0253,
    opening_hours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '09:00', close: '20:00' },
      sunday: { open: '10:00', close: '17:00' },
    },
    status: 'approved' as const,
    is_featured: true,
    view_count: 1250,
    save_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: '4',
    owner_id: null,
    name: 'JoJo\'s',
    slug: 'jojos',
    tagline: 'Famous fish & chips',
    description: 'Award-winning fish and chips',
    category_id: '4',
    phone: '01234 567893',
    email: null,
    website: null,
    instagram: '@jojosfishandchips',
    address_line1: '2 Tankerton Road',
    address_line2: null,
    postcode: 'CT5 1AB',
    latitude: 51.3612,
    longitude: 1.0248,
    opening_hours: {
      monday: { open: '11:30', close: '20:00' },
      tuesday: { open: '11:30', close: '20:00' },
      wednesday: { open: '11:30', close: '20:00' },
      thursday: { open: '11:30', close: '20:00' },
      friday: { open: '11:30', close: '21:00' },
      saturday: { open: '11:00', close: '21:00' },
      sunday: { open: '12:00', close: '19:00' },
    },
    status: 'approved' as const,
    is_featured: false,
    view_count: 2100,
    save_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1],
  },
];

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState(['1', '4']);

  const handleToggleSave = (shopId: string) => {
    setSavedIds((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  const savedShops = mockSavedShops.filter((shop) => savedIds.includes(shop.id));

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white">
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
          <h1 className="text-white font-bold text-xl">saved</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {savedShops.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-coral"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-ink mb-2">No saved shops yet</h2>
            <p className="text-grey text-sm mb-4">
              Tap the heart icon on shops you love to save them here
            </p>
            <Link
              href="/shops"
              className="inline-block px-6 py-2 bg-sky text-white rounded-button font-semibold"
            >
              browse shops
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-grey mb-4">
              {savedShops.length} saved shop{savedShops.length !== 1 ? 's' : ''}
            </p>
            <ShopList
              shops={savedShops}
              savedShopIds={savedIds}
              onToggleSave={handleToggleSave}
            />
          </>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
