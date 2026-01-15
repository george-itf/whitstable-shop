'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Calendar, Store, HandHeart, Users, PoundSterling } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { CharityCard, CharityEventCard } from '@/components/charity';
import MobileWrapper from '@/components/layout/MobileWrapper';
import type { Charity, CharityEvent } from '@/types/database';

type CharityWithEvents = Charity & {
  upcoming_events?: CharityEvent[];
};

export default function CommunityPage() {
  const [charities, setCharities] = useState<CharityWithEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/charities?with_events=true');
        if (res.ok) {
          const data = await res.json();
          setCharities(data);
        }
      } catch (error) {
        console.error('Error fetching charities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get featured charity and other charities
  const featuredCharity = charities.find((c) => c.is_featured);
  const otherCharities = charities.filter((c) => !c.is_featured);

  // Get all upcoming events
  const upcomingEvents = charities.flatMap((c) =>
    (c.upcoming_events || []).map((e) => ({
      ...e,
      charity_name: c.name,
    }))
  );

  // Calculate stats
  const totalRaised = charities.reduce((sum, c) => sum + (c.raised_amount || 0), 0);

  return (
    <MobileWrapper>
      {/* Coral gradient header */}
      <div className="bg-gradient-to-br from-coral to-coral-dark px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Community</h1>
            <p className="text-white/80 text-sm mt-1">
              Support local Whitstable causes
            </p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-center">
            <Heart className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-base font-bold text-white">{charities.length}</p>
            <p className="text-[10px] text-white/70">charities</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-center">
            <Calendar className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-base font-bold text-white">{upcomingEvents.length}</p>
            <p className="text-[10px] text-white/70">events</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-center">
            <PoundSterling className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-base font-bold text-white">{totalRaised > 0 ? `${(totalRaised / 1000).toFixed(0)}k` : '0'}</p>
            <p className="text-[10px] text-white/70">raised</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-40 rounded-xl" />
            <div className="skeleton h-32 rounded-xl" />
            <div className="skeleton h-32 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Featured Charity */}
            {featuredCharity && (
              <div className="mb-6">
                <h2 className="font-semibold text-ink text-sm mb-3 section-title">Featured</h2>
                <CharityCard charity={featuredCharity} variant="featured" />
              </div>
            )}

            {/* Upcoming Events */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-ink text-sm section-title">Upcoming Events</h2>
                <Link
                  href="/events"
                  className="text-xs text-sky font-medium"
                >
                  View all
                </Link>
              </div>
              {upcomingEvents.length === 0 ? (
                <Card className="text-center py-6">
                  <Calendar className="h-8 w-8 text-oyster-300 mx-auto mb-2" />
                  <p className="text-sm text-oyster-500">No upcoming events</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CharityEventCard event={event} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Local Charities */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-ink text-sm section-title">Local Charities</h2>
                <Link
                  href="/community/charities"
                  className="text-xs text-sky font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {otherCharities.slice(0, 3).map((charity, index) => (
                  <div
                    key={charity.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CharityCard charity={charity} />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="bg-sky-light/50 border-sky/20">
              <h3 className="font-semibold text-ink text-sm mb-1">Know a local charity?</h3>
              <p className="text-xs text-oyster-600 mb-3">
                Help us support more Whitstable causes
              </p>
              <Link href="/report">
                <Button size="sm" className="w-full">
                  Suggest a Charity
                </Button>
              </Link>
            </Card>
          </>
        )}
      </div>
    </MobileWrapper>
  );
}
