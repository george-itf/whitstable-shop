import Link from 'next/link';
import { Tag, Calendar, Clock, Store, ExternalLink } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Offer, Shop } from '@/types/database';

interface OfferCardProps {
  offer: Offer & { shop?: Pick<Shop, 'name' | 'slug'> };
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
  const typeInfo = offerTypeLabels[offer.offer_type || 'other'] || offerTypeLabels.other;
  const isOngoing = offer.is_ongoing;
  const isExpiringSoon = !isOngoing && offer.valid_until &&
    new Date(offer.valid_until).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  if (variant === 'compact') {
    return (
      <Card hoverable className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <Tag className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-oyster-900 truncate">{offer.title}</p>
          {offer.shop && (
            <p className="text-sm text-oyster-500 truncate">{offer.shop.name}</p>
          )}
        </div>
        <Badge variant={typeInfo.color} size="sm">
          {typeInfo.label}
        </Badge>
      </Card>
    );
  }

  return (
    <Card hoverable>
      <div className="flex items-start justify-between gap-3 mb-3">
        <Badge variant={typeInfo.color}>{typeInfo.label}</Badge>
        {isExpiringSoon && (
          <Badge variant="warning" size="sm">
            <Clock className="h-3 w-3 mr-1" />
            Ending soon
          </Badge>
        )}
      </div>

      <h3 className="text-lg font-semibold text-oyster-900 mb-2">{offer.title}</h3>

      {offer.shop && (
        <Link
          href={`/shops/${offer.shop.slug}`}
          className="flex items-center gap-1 text-ocean-600 hover:text-ocean-700 text-sm mb-3"
        >
          <Store className="h-4 w-4" />
          {offer.shop.name}
        </Link>
      )}

      {offer.description && (
        <p className="text-oyster-600 mb-4">{offer.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-oyster-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {isOngoing
            ? 'Ongoing offer'
            : offer.valid_until
            ? `Valid until ${formatDate(offer.valid_until, 'dd MMM yyyy')}`
            : `From ${formatDate(offer.valid_from, 'dd MMM yyyy')}`}
        </span>
      </div>

      {offer.terms && (
        <p className="text-xs text-oyster-400 mb-4 italic">{offer.terms}</p>
      )}

      {offer.shop && (
        <Link href={`/shops/${offer.shop.slug}`}>
          <Button size="sm" className="w-full">
            View Shop
          </Button>
        </Link>
      )}
    </Card>
  );
}
