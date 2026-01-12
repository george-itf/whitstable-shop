'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, X } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import { EmptyState } from '@/components/ui';
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
      <div className="bg-gradient-to-br from-sky to-sky-dark px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-bold text-xl">search</h1>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-oyster-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Whitstable shops..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white text-ink placeholder:text-oyster-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-oyster-400 hover:text-ink rounded-full hover:bg-oyster-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-white sticky top-0 z-20 border-b border-oyster-100">
        <div className="px-4 py-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                !selectedCategory ? 'bg-sky text-white shadow-sm' : 'bg-oyster-100 text-oyster-700 hover:bg-oyster-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat.slug
                    ? 'bg-sky text-white shadow-sm'
                    : 'bg-oyster-100 text-oyster-700 hover:bg-oyster-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4 pb-24">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 skeleton w-24" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-36 skeleton" />
                <div className="p-3.5 space-y-2">
                  <div className="h-5 skeleton w-3/4" />
                  <div className="h-4 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No shops found"
            description={query ? `No results for "${query}". Try a different search term.` : 'Try searching for a shop name or category.'}
            variant="card"
          />
        ) : (
          <>
            <p className="text-sm font-medium text-oyster-600 mb-4">
              {filteredShops.length} result{filteredShops.length !== 1 ? 's' : ''}
              {query && <span className="text-ink"> for &quot;{query}&quot;</span>}
            </p>
            <ShopList shops={filteredShops} />
          </>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
