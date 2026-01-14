'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Repeat } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import PageHeader from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui';
import { Event } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
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
  const eventsByMonth: Record<string, Event[]> = {};
  events.forEach((event) => {
    const date = new Date(event.date);
    const monthKey = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = [];
    }
    eventsByMonth[monthKey].push(event);
  });

  return (
    <MobileWrapper>
      <PageHeader
        title="what's on"
        subtitle="things happening around town"
        icon={Calendar}
      />

      {/* Events list */}
      <div className="px-4 py-6 pb-24 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                {i === 0 && <div className="h-4 skeleton w-32 mb-3" />}
                <div className="card p-4 flex gap-4">
                  <div className="w-14 h-16 skeleton rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 skeleton w-3/4" />
                    <div className="h-3 skeleton w-1/2" />
                    <div className="h-3 skeleton w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            illustration="boat"
            title="Nothing on right now"
            description="Whitstable's taking a breather. Check back soon — something's always brewing."
            hint="The oyster festival is usually in July..."
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

function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date);
  const dayNum = date.getDate();
  const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });

  return (
    <div id={event.id} className="card card-hover p-4 flex gap-4">
      {/* Date badge */}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-ink">{event.title}</h3>

        <div className="mt-2 space-y-1">
          {event.time_start && (
            <div className="flex items-center gap-1.5 text-sm text-grey">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {event.time_start}
                {event.time_end && ` - ${event.time_end}`}
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

        {event.description && (
          <p className="mt-2 text-sm text-grey-dark line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
