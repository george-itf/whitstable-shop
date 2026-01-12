'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Calendar, Users, Store, HandHeart } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { CharityCard, CharityEventCard } from '@/components/charity';
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-oyster-200 rounded-xl" />
            <div>
              <div className="h-8 w-48 bg-oyster-200 rounded mb-2" />
              <div className="h-4 w-64 bg-oyster-200 rounded" />
            </div>
          </div>
          <div className="h-64 bg-oyster-200 rounded-xl mb-12" />
          <div className="h-32 bg-oyster-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart className="h-6 w-6 text-rose-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Community Hub</h1>
          <p className="text-oyster-600">Support local causes and make a difference</p>
        </div>
      </div>

      {/* Featured Charity */}
      {featuredCharity && (
        <section className="mb-12">
          <CharityCard charity={featuredCharity} variant="featured" />
        </section>
      )}

      {/* Stats */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">{charities.length}</div>
              <div className="text-rose-100 text-sm">Local Charities</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{upcomingEvents.length}</div>
              <div className="text-rose-100 text-sm">Upcoming Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">15</div>
              <div className="text-rose-100 text-sm">Shops That Give Back</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">
                £{(totalRaised / 1000).toFixed(1)}k
              </div>
              <div className="text-rose-100 text-sm">Raised This Year</div>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-oyster-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ocean-600" />
                Upcoming Events
              </h2>
              <Link
                href="/community/events"
                className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
              >
                View all →
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <Card className="text-center py-8">
                <Calendar className="h-10 w-10 text-oyster-300 mx-auto mb-3" />
                <p className="text-oyster-600">No upcoming events</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <CharityEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Local Charities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-oyster-900">Local Charities</h2>
              <Link
                href="/community/charities"
                className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
              >
                All →
              </Link>
            </div>
            <div className="space-y-4">
              {otherCharities.slice(0, 3).map((charity) => (
                <CharityCard key={charity.id} charity={charity} />
              ))}
            </div>
          </section>

          {/* Shops That Give Back */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-ocean-600" />
              <h3 className="font-semibold text-oyster-900">Shops That Give Back</h3>
            </div>
            <p className="text-sm text-oyster-600 mb-4">
              These local businesses support community causes through donations,
              partnerships, or volunteer work.
            </p>
            <div className="space-y-3">
              {["Wheeler's Oyster Bar", 'The Cheese Box', 'Frank'].map((shop, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-oyster-100 last:border-0"
                >
                  <span className="text-oyster-900">{shop}</span>
                  <Badge variant="success" size="sm">
                    <HandHeart className="h-3 w-3 mr-1" />
                    Gives Back
                  </Badge>
                </div>
              ))}
            </div>
            <Link href="/shops?filter=gives-back" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All
              </Button>
            </Link>
          </Card>

          {/* CTA */}
          <Card className="bg-ocean-50 border-ocean-200">
            <h3 className="font-semibold text-oyster-900 mb-2">Know a local charity?</h3>
            <p className="text-sm text-oyster-600 mb-4">
              Help us expand our community hub by suggesting local causes and organisations.
            </p>
            <Link href="/report">
              <Button size="sm" className="w-full">
                Suggest a Charity
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
