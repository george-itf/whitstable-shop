import Link from 'next/link';
import { LocalInfo } from '@/types';

interface LocalInfoGridProps {
  items: LocalInfo[];
}

// Each item has its own color scheme to feel more vibrant
const infoConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  'bin-collection': {
    bg: 'bg-green-light',
    text: 'text-green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  'tide-times': {
    bg: 'bg-ocean-100',
    text: 'text-ocean-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2z" />
      </svg>
    ),
  },
  'oyster-festival': {
    bg: 'bg-coral-light',
    text: 'text-coral',
    icon: (
      // Oyster shell icon
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <path d="M12 6c-2 0-6 1-8 3" />
        <path d="M12 6c2 0 6 1 8 3" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  'parking': {
    bg: 'bg-sky-light',
    text: 'text-sky',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
  },
  'beach-info': {
    bg: 'bg-yellow-light',
    text: 'text-yellow',
    icon: (
      // Beach hut / sun icon
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
  },
  'emergency-contacts': {
    bg: 'bg-red-50',
    text: 'text-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
};

const defaultConfig = {
  bg: 'bg-sky-light',
  text: 'text-sky',
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export default function LocalInfoGrid({ items }: LocalInfoGridProps) {
  // Only show first 6 items
  const displayItems = items.slice(0, 6);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">local info</h2>
        <Link href="/info" className="text-sky text-sm font-semibold hover:text-sky-dark transition-colors">
          see all
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {displayItems.map((item) => {
          const config = infoConfig[item.slug] || defaultConfig;
          return (
            <Link
              key={item.id}
              href={`/info/${item.slug}`}
              className="card card-hover p-3 flex flex-col items-center text-center group"
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                {config.icon}
              </div>
              <span className="text-xs font-semibold text-ink leading-tight">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
