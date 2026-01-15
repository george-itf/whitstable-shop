'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Repeat } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import PageHeader from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui';
import { Event, ShopImage } from '@/types';

// Type helper to handle schema drift between canonical and legacy field names
type EventWithSchemaFallback = Event & {
  // Legacy field names (for backwards compatibility during schema migration)
  date?: string;
  time_start?: string;
  time_end?: string;
};

type EventWithShopImage = EventWithSchemaFallback & {
  shop?: {
    id: string;
    name: string;
    slug: string;
    images?: Pick<ShopImage, 'url' | 'is_primary'>[];
  };
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithShopImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/events?upcoming=true');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Group events by month
  // Normalize date field: support both `start_date` (canonical) and legacy `date`
  const eventsByMonth: Record<string, EventWithShopImage[]> = {};
  events.forEach((event) => {
    // Accept start_date (preferred), fall back to date if present, otherwise produce Invalid Date
    const raw = event.start_date ?? event.date ?? '';
    const date = raw ? new Date(raw) : new Date('');
    const monthKey = isNaN(date.getTime())
      ? 'Unknown'
      : date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = [];
    }
    eventsByMonth[monthKey].push(event);
  });

  return (
    <MobileWrapper>
      <PageHeader
        title="what's on"
        subtitle="events around town"
        icon={Calendar}
      />

      {/* Events list */}
      <div className="px-4 py-6 pb-24 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                {i === 0 && <div className="h-4 skeleton w-32 mb-3" />}
                <div className="card overflow-hidden">
                  <div className="h-32 skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 skeleton w-3/4" />
                    <div className="h-3 skeleton w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            illustration="boat"
            title="Nothing scheduled"
            description="No upcoming events right now. Check back soon."
            variant="card"
          />
        ) : (
          Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <div key={month}>
              <h2 className="section-title mb-4">{month.toLowerCase()}</h2>
              <div className="space-y-3">
                {monthEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function EventCard({ event }: { event: EventWithShopImage }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Normalize date field: support both start_date (canonical) and legacy date
  const rawDate = event.start_date ?? event.date ?? '';
  const date = rawDate ? new Date(rawDate) : new Date('');
  const dayNum = date.getDate();
  const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const monthName = date.toLocaleDateString('en-GB', { month: 'short' });

  // Get shop image if available
  const shopImage = event.shop?.images?.find(img => img.is_primary)?.url
    || event.shop?.images?.[0]?.url;

  const content = (
    <div className="card card-hover overflow-hidden">
      {/* Image header if shop has image */}
      {shopImage && (
        <div className="relative h-36 bg-oyster-100">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <Image
            src={shopImage}
            alt={event.shop?.name || event.title}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          {/* Date badge overlay */}
          <div className="absolute top-3 left-3">
            <div className="bg-coral text-white rounded-xl px-3 py-2 shadow-lg text-center min-w-[52px]">
              <div className="text-[10px] font-semibold uppercase opacity-80">{dayName}</div>
              <div className="text-xl font-bold leading-none">{dayNum}</div>
              <div className="text-[10px] uppercase opacity-70">{monthName}</div>
            </div>
          </div>
          {event.is_recurring && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs text-grey">
              <Repeat className="w-3 h-3" />
              <span>{event.recurrence_rule}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex gap-4">
        {/* Date badge - only show if no image */}
        {!shopImage && (
          <div className="flex-shrink-0 w-14 text-center">
            <div className="bg-coral text-white rounded-xl py-2.5 shadow-sm">
              <div className="text-xs font-semibold uppercase opacity-80">{dayName}</div>
              <div className="text-2xl font-bold">{dayNum}</div>
            </div>
            {event.is_recurring && (
              <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-grey">
                <Repeat className="w-3 h-3" />
                <span>{event.recurrence_rule}</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-ink">{event.title}</h3>

          {event.shop && (
            <p className="text-sm text-sky mt-0.5">{event.shop.name}</p>
          )}

          <div className="mt-2 space-y-1">
            {/* Normalize time fields: support both start_time (canonical) and legacy time_start */}
            {(event.start_time ?? event.time_start) && (
              <div className="flex items-center gap-1.5 text-sm text-grey">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {event.start_time ?? event.time_start}
                  {(event.end_time ?? event.time_end) &&
                    ` – ${event.end_time ?? event.time_end}`}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-1.5 text-sm text-grey">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {event.description && !shopImage && (
            <p className="mt-2 text-sm text-grey-dark line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Wrap in link if shop exists
  if (event.shop) {
    return <Link href={`/shops/${event.shop.slug}`}>{content}</Link>;
  }

  return <div id={event.id}>{content}</div>;
}
