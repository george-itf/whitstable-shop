import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Event } from '@/types';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    shop_id: null,
    title: 'Oyster Festival Opening',
    description: 'The annual celebration of Whitstable oysters returns! Join us for live music, oyster shucking competitions, and the freshest seafood from local suppliers.',
    date: '2025-07-26',
    time_start: '10:00',
    time_end: '18:00',
    location: 'Whitstable Harbour',
    is_recurring: false,
    recurrence_rule: null,
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    shop_id: null,
    title: 'Oyster Festival Day 2',
    description: 'The festivities continue with more music, food, and fun for the whole family.',
    date: '2025-07-27',
    time_start: '10:00',
    time_end: '20:00',
    location: 'Whitstable Harbour',
    is_recurring: false,
    recurrence_rule: null,
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    shop_id: null,
    title: 'Live Music at The Old Neptune',
    description: 'Weekly live music night featuring local bands and artists. Free entry, great atmosphere.',
    date: '2025-07-28',
    time_start: '19:00',
    time_end: '22:00',
    location: 'The Old Neptune',
    is_recurring: true,
    recurrence_rule: 'weekly',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    shop_id: null,
    title: 'Art Walk',
    description: 'Monthly gallery trail through Whitstable. Visit local galleries and meet the artists.',
    date: '2025-08-02',
    time_start: '14:00',
    time_end: '17:00',
    location: 'Town Centre',
    is_recurring: true,
    recurrence_rule: 'monthly',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    shop_id: null,
    title: 'Beach Clean',
    description: 'Join the community beach clean. Equipment provided. Refreshments afterwards.',
    date: '2025-08-09',
    time_start: '09:00',
    time_end: '11:00',
    location: 'West Beach',
    is_recurring: true,
    recurrence_rule: 'monthly',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    shop_id: null,
    title: 'Farmers Market',
    description: 'Weekly farmers market with local produce, artisan foods, and handmade crafts.',
    date: '2025-08-10',
    time_start: '09:00',
    time_end: '14:00',
    location: 'Oxford Street',
    is_recurring: true,
    recurrence_rule: 'weekly',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
];

export default function EventsPage() {
  // Group events by month
  const eventsByMonth: Record<string, Event[]> = {};
  mockEvents.forEach((event) => {
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
        {Object.entries(eventsByMonth).map(([month, events]) => (
          <div key={month}>
            <h2 className="text-sm font-semibold text-grey uppercase tracking-wide mb-3">
              {month}
            </h2>
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
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
