'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
          <h1 className="text-white font-bold text-xl">shops</h1>
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-3 border-b border-grey-light overflow-x-auto hide-scrollbar">
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

      {/* Shop count */}
      <div className="px-4 py-3">
        <p className="text-sm text-grey">
          {isLoading ? 'Loading...' : `${filteredShops.length} shops`}
        </p>
      </div>

      {/* Shop list */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-grey-light rounded-lg mb-2" />
                <div className="h-4 bg-grey-light rounded w-3/4 mb-1" />
                <div className="h-3 bg-grey-light rounded w-1/2" />
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
      className={`px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-sky text-white'
          : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
      }`}
    >
      {children}
    </button>
  );
}
