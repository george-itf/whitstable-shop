'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Calendar, Clock, Store } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Offer, Shop } from '@/types/database';
import type { ShopImage } from '@/types';

type ShopWithImage = Pick<Shop, 'id' | 'name' | 'slug'> & {
  images?: Pick<ShopImage, 'url' | 'is_primary'>[];
};

interface OfferCardProps {
  offer: Offer & { shop?: ShopWithImage };
  variant?: 'default' | 'compact';
}

const offerTypeLabels: Record<string, { label: string; color: 'success' | 'info' | 'warning' | 'danger' | 'default' }> = {
  discount: { label: 'Discount', color: 'success' },
  freebie: { label: 'Freebie', color: 'danger' },
  bundle: { label: 'Bundle', color: 'info' },
  loyalty: { label: 'Loyalty', color: 'warning' },
  event: { label: 'Event', color: 'default' },
  other: { label: 'Special', color: 'default' },
};

export function OfferCard({ offer, variant = 'default' }: OfferCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const typeInfo = offerTypeLabels[offer.offer_type || 'other'] || offerTypeLabels.other;
  const isOngoing = offer.is_ongoing;
  const isExpiringSoon = !isOngoing && offer.valid_until &&
    new Date(offer.valid_until).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  // Get primary shop image or first available
  const shopImage = offer.shop?.images?.find(img => img.is_primary)?.url
    || offer.shop?.images?.[0]?.url;

  if (variant === 'compact') {
    return (
      <Link href={offer.shop ? `/shops/${offer.shop.slug}` : '#'}>
        <Card hoverable className="flex items-center gap-3 p-3">
          {/* Shop image or icon */}
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-oyster-100">
            {shopImage ? (
              <Image
                src={shopImage}
                alt={offer.shop?.name || ''}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="w-6 h-6 text-oyster-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{offer.title}</p>
            {offer.shop && (
              <p className="text-xs text-grey truncate">{offer.shop.name}</p>
            )}
          </div>
          <Badge variant={typeInfo.color} size="sm">
            {typeInfo.label}
          </Badge>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={offer.shop ? `/shops/${offer.shop.slug}` : '#'}>
      <Card hoverable className="overflow-hidden p-0">
        {/* Shop image header */}
        <div className="relative h-32 bg-oyster-100">
          {shopImage ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 skeleton" />}
              <Image
                src={shopImage}
                alt={offer.shop?.name || ''}
                fill
                className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-10 h-10 text-oyster-300" />
            </div>
          )}
          {/* Badge overlay */}
          <div className="absolute top-3 left-3">
            <Badge variant={typeInfo.color}>{typeInfo.label}</Badge>
          </div>
          {isExpiringSoon && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" size="sm">
                <Clock className="h-3 w-3 mr-1" />
                Ends soon
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-bold text-ink mb-1">{offer.title}</h3>

          {offer.shop && (
            <p className="text-sm text-sky mb-2">{offer.shop.name}</p>
          )}

          {offer.description && (
            <p className="text-sm text-grey line-clamp-2 mb-3">{offer.description}</p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-grey">
            <Calendar className="h-3.5 w-3.5" />
            {isOngoing
              ? 'Ongoing'
              : offer.valid_until
              ? `Until ${formatDate(offer.valid_until, 'dd MMM')}`
              : `From ${formatDate(offer.valid_from, 'dd MMM')}`}
          </div>
        </div>
      </Card>
    </Link>
  );
}
