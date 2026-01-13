import Link from 'next/link';
import { Event } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { Clock, MapPin } from 'lucide-react';

interface EventsScrollProps {
  events: Event[];
}

export default function EventsScroll({ events }: EventsScrollProps) {
  return (
    <div className="py-6">
      <div className="px-4 flex items-center justify-between mb-4">
        <h2 className="section-title">what&apos;s on</h2>
        <Link href="/events" className="text-sky text-sm font-semibold hover:text-sky-dark transition-colors">
          see all
        </Link>
      </div>

      {/* Scroll container with fade indicators */}
      <div className="relative">
        {/* Right fade indicator - shows more content available */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 px-4 pr-12" style={{ width: 'max-content' }}>
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events#${event.id}`}
                className="card card-hover p-4 w-52 flex-shrink-0 group"
              >
                {/* Date badge */}
                <div className="bg-coral text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-block mb-3">
                  {formatDateShort(event.date)}
                </div>

                {/* Title */}
                <h3 className="font-bold text-ink text-sm line-clamp-2 mb-2 group-hover:text-sky transition-colors">
                  {event.title}
                </h3>

                {/* Time & location */}
                <div className="space-y-1">
                  {event.time_start && (
                    <p className="text-xs text-grey flex items-center gap-1.5">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      {event.time_start}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-xs text-grey flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
