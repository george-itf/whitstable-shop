'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import { createClient } from '@/lib/supabase/client';
import type { Shop } from '@/types';

export default function SavedPage() {
  const router = useRouter();
  const [savedShops, setSavedShops] = useState<Shop[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchSavedShops() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Check authentication
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Fetch saved shops from API
        const res = await fetch('/api/saved');
        if (res.ok) {
          const data = await res.json();
          setSavedShops(data);
          setSavedIds(data.map((s: Shop) => s.id));
        }
      } catch (error) {
        console.error('Error fetching saved shops:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedShops();
  }, []);

  const handleToggleSave = async (shopId: string) => {
    const isSaved = savedIds.includes(shopId);

    try {
      const res = await fetch('/api/saved', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop_id: shopId }),
      });

      if (res.ok) {
        if (isSaved) {
          setSavedIds((prev) => prev.filter((id) => id !== shopId));
          setSavedShops((prev) => prev.filter((s) => s.id !== shopId));
        } else {
          setSavedIds((prev) => [...prev, shopId]);
          // Re-fetch to get full shop data
          const fetchRes = await fetch('/api/saved');
          if (fetchRes.ok) {
            const data = await fetchRes.json();
            setSavedShops(data);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (isLoading) {
    return (
      <MobileWrapper>
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
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-grey-light rounded-lg mb-2" />
              <div className="h-4 bg-grey-light rounded w-3/4 mb-1" />
              <div className="h-3 bg-grey-light rounded w-1/2" />
            </div>
          ))}
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  if (isAuthenticated === false) {
    return (
      <MobileWrapper>
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
        <div className="px-4 py-6 text-center py-12">
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
          <h2 className="text-lg font-bold text-ink mb-2">Sign in to save shops</h2>
          <p className="text-grey text-sm mb-4">Create an account to keep track of your favourite Whitstable spots</p>
          <Link href="/login?redirect=/saved" className="inline-block px-6 py-2 bg-sky text-white rounded-button font-semibold">
            sign in
          </Link>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

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
            <p className="text-grey text-sm mb-4">Tap the heart icon on shops you love to save them here</p>
            <Link href="/shops" className="inline-block px-6 py-2 bg-sky text-white rounded-button font-semibold">
              browse shops
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-grey mb-4">
              {savedShops.length} saved shop{savedShops.length !== 1 ? 's' : ''}
            </p>
            <ShopList shops={savedShops} savedShopIds={savedIds} onToggleSave={handleToggleSave} />
          </>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
