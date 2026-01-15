'use client';

import { useState, useEffect } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Notice from '@/components/home/Notice';
import HubButtons from '@/components/home/HubButtons';
import EventsScroll from '@/components/home/EventsScroll';
import TrendingList from '@/components/home/TrendingList';
import LocalInfoGrid from '@/components/home/LocalInfoGrid';
import CTABanner from '@/components/home/CTABanner';
import type { Event } from '@/types';

// Static local info - these don't change often
const localInfoItems = [
  { id: '1', title: 'Bin Days', slug: 'bin-collection', content: null, icon: null, display_order: 1, updated_at: new Date().toISOString() },
  { id: '2', title: 'Tide Times', slug: 'tide-times', content: null, icon: null, display_order: 2, updated_at: new Date().toISOString() },
  { id: '3', title: 'Oyster Festival', slug: 'oyster-festival', content: null, icon: null, display_order: 3, updated_at: new Date().toISOString() },
  { id: '4', title: 'Parking', slug: 'parking', content: null, icon: null, display_order: 5, updated_at: new Date().toISOString() },
  { id: '5', title: 'Beach Info', slug: 'beach-info', content: null, icon: null, display_order: 6, updated_at: new Date().toISOString() },
  { id: '6', title: 'Emergency', slug: 'emergency-contacts', content: null, icon: null, display_order: 7, updated_at: new Date().toISOString() },
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [notice, setNotice] = useState<{ message: string; link: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      setIsLoading(true);
      try {
        // Fetch upcoming events
        const eventsRes = await fetch('/api/events?upcoming=true&limit=5');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }

        // Check for active notice (could be from API in future)
        // For now, check if there's an upcoming big event
        const now = new Date();
        const oysterFestival = new Date('2025-07-26');
        const daysUntilFestival = Math.ceil((oysterFestival.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilFestival > 0 && daysUntilFestival <= 14) {
          setNotice({
            message: `Oyster Festival in ${daysUntilFestival} days! Check road closures.`,
            link: '/info/oyster-festival',
          });
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <MobileWrapper>
      {/* Hero section */}
      <Hero />

      {/* Notice bar */}
      {notice && <Notice message={notice.message} link={notice.link} />}

      {/* Hub buttons - primary navigation */}
      <HubButtons />

      {/* Events - what's happening now */}
      {isLoading ? (
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-grey-light rounded w-24 animate-pulse" />
            <div className="h-4 bg-grey-light rounded w-16 animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64">
                <div className="h-32 bg-grey-light rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : events.length > 0 ? (
        <EventsScroll events={events} />
      ) : null}

      {/* Trending - what's hot in the community */}
      <TrendingList limit={5} />

      {/* Local info grid - practical information */}
      <LocalInfoGrid items={localInfoItems} />

      {/* CTA banner - business signup */}
      <CTABanner />

      {/* Footer */}
      <Footer />

      {/* Bottom navigation */}
      <BottomNav />
    </MobileWrapper>
  );
}
