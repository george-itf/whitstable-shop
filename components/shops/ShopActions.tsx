'use client';

import { Phone, Navigation, Instagram, Globe } from 'lucide-react';
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

  const actions = [
    { show: !!shop.phone, onClick: handleCall, icon: Phone, label: 'call', color: 'text-green' },
    { show: true, onClick: handleDirections, icon: Navigation, label: 'directions', color: 'text-sky' },
    { show: !!shop.instagram, onClick: handleInstagram, icon: Instagram, label: 'instagram', color: 'text-coral' },
    { show: !!shop.website, onClick: () => window.open(shop.website!, '_blank'), icon: Globe, label: 'website', color: 'text-ocean-600' },
  ].filter(a => a.show);

  return (
    <div className="px-4 py-3 border-b border-grey-light">
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 bg-oyster-50 rounded-xl hover:bg-oyster-100 transition-all tap-effect group"
          >
            <action.icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-semibold text-ink">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
