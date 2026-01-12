'use client';

import { Shop } from '@/types';

interface ShopActionsProps {
  shop: Shop;
}

export default function ShopActions({ shop }: ShopActionsProps) {
  const handleCall = () => {
    if (shop.phone) {
      window.location.href = `tel:${shop.phone}`;
    }
  };

  const handleDirections = () => {
    if (shop.latitude && shop.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
      window.open(url, '_blank');
    } else if (shop.postcode) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shop.postcode)}`;
      window.open(url, '_blank');
    }
  };

  const handleInstagram = () => {
    if (shop.instagram) {
      const handle = shop.instagram.replace('@', '');
      window.open(`https://instagram.com/${handle}`, '_blank');
    }
  };

  return (
    <div className="px-4 py-3 border-b border-grey-light">
      <div className="flex gap-3">
        {/* Call button */}
        {shop.phone && (
          <ActionButton onClick={handleCall} icon="phone" label="call" />
        )}

        {/* Directions button */}
        <ActionButton onClick={handleDirections} icon="directions" label="directions" />

        {/* Instagram button */}
        {shop.instagram && (
          <ActionButton onClick={handleInstagram} icon="instagram" label="instagram" />
        )}

        {/* Website button */}
        {shop.website && (
          <ActionButton
            onClick={() => window.open(shop.website!, '_blank')}
            icon="website"
            label="website"
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: 'phone' | 'directions' | 'instagram' | 'website';
  label: string;
}) {
  const icons = {
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    directions: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
    instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    website: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-3 px-2 bg-grey-light/50 rounded-button hover:bg-grey-light transition-colors"
    >
      <span className="text-sky">{icons[icon]}</span>
      <span className="text-xs font-medium text-ink">{label}</span>
    </button>
  );
}
