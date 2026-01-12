'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import type { Category, Shop } from '@/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [shopsRes, categoriesRes] = await Promise.all([
          fetch('/api/shops'),
          fetch('/api/categories'),
        ]);

        if (shopsRes.ok) {
          const shopsData = await shopsRes.json();
          setShops(shopsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesQuery =
        query === '' ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        shop.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        shop.category_id === selectedCategory ||
        shop.category?.slug === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory, shops]);

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
              !selectedCategory ? 'bg-sky text-white' : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
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
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-grey-light rounded w-24 animate-pulse" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-grey-light rounded-lg mb-2" />
                <div className="h-4 bg-grey-light rounded w-3/4 mb-1" />
                <div className="h-3 bg-grey-light rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-grey mb-4">
              {filteredShops.length} result{filteredShops.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
            </p>
            <ShopList shops={filteredShops} />
          </>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
