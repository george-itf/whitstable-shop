'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
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
          <h1 className="text-white font-bold text-xl">what&apos;s on</h1>
        </div>
      </div>

      {/* Events list */}
      <div className="px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-grey-light rounded w-32 mb-3" />
                <div className="card p-4 flex gap-4">
                  <div className="w-14 h-16 bg-grey-light rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-grey-light rounded w-3/4" />
                    <div className="h-3 bg-grey-light rounded w-1/2" />
                    <div className="h-3 bg-grey-light rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-grey">No upcoming events</p>
            <p className="text-sm text-grey-dark mt-1">Check back soon!</p>
          </div>
        ) : (
          Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <div key={month}>
              <h2 className="text-sm font-semibold text-grey uppercase tracking-wide mb-3">
                {month}
              </h2>
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
    <div id={event.id} className="card p-4 flex gap-4">
      {/* Date badge */}
      <div className="flex-shrink-0 w-14 text-center">
        <div className="bg-coral-light rounded-lg py-2">
          <div className="text-coral text-xs font-medium uppercase">{dayName}</div>
          <div className="text-coral text-xl font-bold">{dayNum}</div>
        </div>
        {event.is_recurring && (
          <div className="mt-1 text-xs text-grey">
            {event.recurrence_rule}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-ink">{event.title}</h3>

        {event.time_start && (
          <div className="flex items-center gap-1 mt-1 text-sm text-grey">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {event.time_start}
            {event.time_end && ` - ${event.time_end}`}
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-1 mt-1 text-sm text-grey">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </div>
        )}

        {event.description && (
          <p className="mt-2 text-sm text-grey-dark line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
