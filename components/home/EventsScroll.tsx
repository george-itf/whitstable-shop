import Link from 'next/link';
import { Event } from '@/types';
import { formatDateShort } from '@/lib/utils';

interface EventsScrollProps {
  events: Event[];
}

export default function EventsScroll({ events }: EventsScrollProps) {
  return (
    <div className="py-6">
      <div className="px-4 flex items-center justify-between mb-4">
        <h2 className="section-title">what&apos;s on</h2>
        <Link href="/events" className="text-sky text-sm font-medium">
          see all
        </Link>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events#${event.id}`}
              className="card card-hover p-3 w-48 flex-shrink-0"
            >
              {/* Date badge */}
              <div className="bg-coral-light text-coral px-2 py-1 rounded-lg text-xs font-semibold inline-block mb-2">
                {formatDateShort(event.date)}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-ink text-sm line-clamp-2 mb-1">
                {event.title}
              </h3>

              {/* Time & location */}
              {event.time_start && (
                <p className="text-xs text-grey">
                  {event.time_start}
                  {event.location && ` · ${event.location}`}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
