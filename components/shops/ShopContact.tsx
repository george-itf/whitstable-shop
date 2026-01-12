'use client';

import { Shop } from '@/types';

interface ShopContactProps {
  shop: Shop;
}

export default function ShopContact({ shop }: ShopContactProps) {
  const contactItems = [
    shop.phone && {
      icon: 'phone',
      label: shop.phone,
      action: () => (window.location.href = `tel:${shop.phone}`),
    },
    shop.email && {
      icon: 'email',
      label: shop.email,
      action: () => (window.location.href = `mailto:${shop.email}`),
    },
    shop.instagram && {
      icon: 'instagram',
      label: shop.instagram,
      action: () => {
        const handle = shop.instagram!.replace('@', '');
        window.open(`https://instagram.com/${handle}`, '_blank');
      },
    },
    shop.website && {
      icon: 'website',
      label: new URL(shop.website).hostname,
      action: () => window.open(shop.website!, '_blank'),
    },
  ].filter(Boolean) as { icon: string; label: string; action: () => void }[];

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-4 border-b border-grey-light">
      <h2 className="font-bold text-ink mb-3">contact</h2>

      <div className="space-y-2">
        {contactItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center gap-3 p-3 bg-grey-light/30 rounded-button hover:bg-grey-light/50 transition-colors text-left"
          >
            <ContactIcon type={item.icon} />
            <span className="text-sm text-ink">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-grey"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    email: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-grey"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-grey"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    website: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-grey"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  };

  return <span className="flex-shrink-0">{icons[type]}</span>;
}
