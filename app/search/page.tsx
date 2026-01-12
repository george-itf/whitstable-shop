'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import { Category } from '@/types';

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Oysters & Seafood', slug: 'oysters-seafood', icon: null, display_order: 1 },
  { id: '2', name: 'Café & Coffee', slug: 'cafe-coffee', icon: null, display_order: 2 },
  { id: '3', name: 'Restaurant & Pub', slug: 'restaurant-pub', icon: null, display_order: 3 },
  { id: '4', name: 'Fish & Chips', slug: 'fish-chips-takeaway', icon: null, display_order: 4 },
  { id: '8', name: 'Books & Records', slug: 'books-records', icon: null, display_order: 8 },
];

const mockShops = [
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
    opening_hours: null,
    status: 'approved' as const,
    is_featured: true,
    view_count: 1250,
    save_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: '2',
    owner_id: null,
    name: 'The Forge',
    slug: 'the-forge',
    tagline: 'Modern British dining',
    description: 'Contemporary restaurant',
    category_id: '3',
    phone: '01234 567891',
    email: null,
    website: null,
    instagram: '@theforge',
    address_line1: '4 Harbour Street',
    address_line2: null,
    postcode: 'CT5 1AQ',
    latitude: 51.3610,
    longitude: 1.0260,
    opening_hours: null,
    status: 'approved' as const,
    is_featured: false,
    view_count: 980,
    save_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
  {
    id: '3',
    owner_id: null,
    name: 'Harbour Books',
    slug: 'harbour-books',
    tagline: 'Independent bookshop',
    description: 'Curated selection of books',
    category_id: '8',
    phone: '01234 567892',
    email: null,
    website: null,
    instagram: '@harbourbooks',
    address_line1: '12 Harbour Street',
    address_line2: null,
    postcode: 'CT5 1AQ',
    latitude: 51.3608,
    longitude: 1.0255,
    opening_hours: null,
    status: 'approved' as const,
    is_featured: false,
    view_count: 450,
    save_count: 34,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[4],
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
    opening_hours: null,
    status: 'approved' as const,
    is_featured: false,
    view_count: 2100,
    save_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3],
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredShops = useMemo(() => {
    return mockShops.filter((shop) => {
      const matchesQuery = query === '' ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        shop.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = !selectedCategory || shop.category_id === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
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
          <h1 className="text-white font-bold text-xl">search</h1>
        </div>

        {/* Search input */}
        <div className="relative">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-grey"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shops..."
            className="w-full pl-10 pr-4 py-3 rounded-button bg-white text-ink placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-ink"
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
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-3 border-b border-grey-light overflow-x-auto hide-scrollbar">
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-sky text-white'
                : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
            }`}
          >
            All
          </button>
          {mockCategories.map((cat) => (
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

      {/* Results */}
      <div className="px-4 py-4">
        <p className="text-sm text-grey mb-4">
          {filteredShops.length} result{filteredShops.length !== 1 ? 's' : ''}
          {query && ` for "${query}"`}
        </p>

        <ShopList shops={filteredShops} />
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
