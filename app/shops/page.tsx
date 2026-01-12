'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Store } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import { Category, Shop } from '@/types';

export default function ShopsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch categories and shops in parallel
        const [categoriesRes, shopsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/shops'),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (shopsRes.ok) {
          const shopsData = await shopsRes.json();
          setShops(shopsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter shops by category
  const filteredShops = activeCategory
    ? shops.filter((shop) => shop.category_id === activeCategory || shop.category?.slug === activeCategory)
    : shops;

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-gradient-to-br from-sky to-sky-dark px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">shops</h1>
              <p className="text-white/70 text-sm">discover local businesses</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-white sticky top-0 z-20 border-b border-oyster-100">
        <div className="px-4 py-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            <CategoryPill
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            >
              All
            </CategoryPill>
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                active={activeCategory === cat.id || activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.name}
              </CategoryPill>
            ))}
          </div>
        </div>
      </div>

      {/* Shop count */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-oyster-600">
          {isLoading ? 'Loading...' : `${filteredShops.length} shops`}
        </p>
      </div>

      {/* Shop list */}
      <div className="px-4 pb-24">
        {isLoading ? (
          <div className="space-y-4">
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
        ) : (
          <ShopList shops={filteredShops} />
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function CategoryPill({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
        active
          ? 'bg-sky text-white shadow-sm'
          : 'bg-oyster-100 text-oyster-700 hover:bg-oyster-200'
      }`}
    >
      {children}
    </button>
  );
}
