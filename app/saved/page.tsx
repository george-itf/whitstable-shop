'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Store } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import ShopList from '@/components/shops/ShopList';
import { Button, EmptyState } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { Shop } from '@/types';

export default function SavedPage() {
  const [savedShops, setSavedShops] = useState<Shop[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchSavedShops() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

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

  return (
    <MobileWrapper>
      {/* Coral gradient header */}
      <div className="bg-gradient-to-br from-coral to-coral-dark px-4 pt-4 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">back</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Saved</h1>
            <p className="text-white/80 text-sm">
              {isAuthenticated && savedShops.length > 0
                ? `${savedShops.length} favourite${savedShops.length !== 1 ? 's' : ''}`
                : 'Your favourite spots'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-oyster-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-oyster-200 rounded w-3/4" />
                    <div className="h-3 bg-oyster-200 rounded w-1/2" />
                    <div className="h-3 bg-oyster-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isAuthenticated === false ? (
          <EmptyState
            icon={Heart}
            title="Sign in to save shops"
            description="Keep track of your favourite Whitstable spots"
            action={{
              label: 'Sign in',
              href: '/auth/login?redirect=/saved',
            }}
            variant="card"
          />
        ) : savedShops.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved shops yet"
            description="Tap the heart on shops you love"
            action={{
              label: 'Browse shops',
              href: '/shops',
            }}
            variant="card"
          />
        ) : (
          <div className="space-y-3">
            {savedShops.map((shop, index) => (
              <div
                key={shop.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ShopList
                  shops={[shop]}
                  savedShopIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileWrapper>
  );
}
