'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event, ShopImage } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { Clock, MapPin } from 'lucide-react';

type EventWithShopImage = Event & {
  shop?: {
    id: string;
    name: string;
    slug: string;
    images?: Pick<ShopImage, 'url' | 'is_primary'>[];
  };
};

interface EventsScrollProps {
  events: EventWithShopImage[];
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
              <EventScrollCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventScrollCard({ event }: { event: EventWithShopImage }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get shop image if available
  const shopImage = event.shop?.images?.find(img => img.is_primary)?.url
    || event.shop?.images?.[0]?.url;

  const href = event.shop ? `/shops/${event.shop.slug}` : `/events#${event.id}`;

  return (
    <Link href={href} className="card card-hover w-56 flex-shrink-0 group overflow-hidden">
      {/* Image header if shop has image */}
      {shopImage ? (
        <div className="relative h-28 bg-oyster-100">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <Image
            src={shopImage}
            alt={event.shop?.name || event.title}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            sizes="224px"
          />
          {/* Date badge overlay */}
          <div className="absolute top-2 left-2">
            <div className="bg-coral text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
              {formatDateShort(event.date)}
            </div>
          </div>
        </div>
      ) : null}

      <div className="p-3.5">
        {/* Date badge - only show if no image */}
        {!shopImage && (
          <div className="bg-coral text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-block mb-2">
            {formatDateShort(event.date)}
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-ink text-sm line-clamp-2 mb-1.5 group-hover:text-sky transition-colors">
          {event.title}
        </h3>

        {event.shop && (
          <p className="text-xs text-sky mb-1.5">{event.shop.name}</p>
        )}

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
      </div>
    </Link>
  );
}
