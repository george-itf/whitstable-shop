import Link from 'next/link';
import { LocalInfo } from '@/types';

interface LocalInfoGridProps {
  items: LocalInfo[];
}

// Charming hand-drawn coastal icons for each info type
const infoConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  'bin-collection': {
    bg: 'bg-green-light',
    text: 'text-green',
    icon: (
      // Wheelie bin with seagull perched on top
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="6" y="10" width="12" height="10" rx="1" />
        <path d="M8 10V8a2 2 0 012-2h4a2 2 0 012 2v2" />
        <path d="M7 20l-1 2h12l-1-2" />
        {/* Little seagull on top */}
        <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        <path d="M9 3.5c1.5.5 2.5.5 3 0" strokeWidth="1.5" />
        <path d="M12 3.5c.5.5 1.5.5 3 0" strokeWidth="1.5" />
      </svg>
    ),
  },
  'tide-times': {
    bg: 'bg-ocean-100',
    text: 'text-ocean-600',
    icon: (
      // Wave with moon
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 15c3-3 6 2 9-1s6 2 9-1" />
        <path d="M3 19c3-2 6 1 9-1s6 1 9-1" strokeWidth="1.5" opacity="0.6" />
        <circle cx="18" cy="6" r="3" />
        <path d="M18 3c-1 0-2 1-2 3s1 3 2 3" fill="currentColor" />
      </svg>
    ),
  },
  'oyster-festival': {
    bg: 'bg-coral-light',
    text: 'text-coral',
    icon: (
      // Happy oyster with pearl
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <ellipse cx="12" cy="14" rx="9" ry="5" />
        <path d="M4 12c3-1 6-1.5 8-1.5s5 .5 8 1.5" />
        <ellipse cx="12" cy="13" rx="3" ry="2" fill="none" />
        <circle cx="12" cy="13" r="1" fill="currentColor" />
        {/* Little smile */}
        <path d="M9 16c1.5 1 4.5 1 6 0" strokeWidth="1.5" />
      </svg>
    ),
  },
  'parking': {
    bg: 'bg-sky-light',
    text: 'text-sky',
    icon: (
      // Crab holding P sign
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        {/* Crab body */}
        <ellipse cx="12" cy="16" rx="6" ry="4" />
        {/* Claws */}
        <path d="M4 14c-1-2 0-4 2-4" />
        <path d="M20 14c1-2 0-4-2-4" />
        {/* Eyes */}
        <circle cx="10" cy="14" r="1" fill="currentColor" />
        <circle cx="14" cy="14" r="1" fill="currentColor" />
        {/* P sign held up */}
        <rect x="9" y="4" width="6" height="7" rx="1" />
        <path d="M11 7h2a1 1 0 010 2h-2" />
      </svg>
    ),
  },
  'beach-info': {
    bg: 'bg-yellow-light',
    text: 'text-yellow',
    icon: (
      // Beach hut with sun
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        {/* Sun */}
        <circle cx="18" cy="6" r="3" />
        <path d="M18 1v1M18 10v1M13 6h1M22 6h1M14.5 3.5l.7.7M20.8 9.8l.7.7M14.5 8.5l.7-.7M20.8 2.2l.7-.7" strokeWidth="1.5" />
        {/* Beach hut */}
        <path d="M4 12l6-5 6 5" />
        <rect x="5" y="12" width="10" height="8" />
        <rect x="8" y="15" width="4" height="5" />
      </svg>
    ),
  },
  'emergency-contacts': {
    bg: 'bg-red-50',
    text: 'text-red-500',
    icon: (
      // Lighthouse
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        {/* Light beams */}
        <path d="M6 6l2 2M18 6l-2 2" strokeWidth="1.5" />
        <path d="M4 9h3M17 9h3" strokeWidth="1.5" />
        {/* Tower */}
        <path d="M9 21l1-12h4l1 12" />
        <rect x="10" y="7" width="4" height="2" />
        {/* Light */}
        <circle cx="12" cy="5" r="2" />
        {/* Stripes */}
        <path d="M9.5 15h5M9.2 18h5.6" />
      </svg>
    ),
  },
};

const defaultConfig = {
  bg: 'bg-sky-light',
  text: 'text-sky',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16v.01" />
    </svg>
  ),
};

export default function LocalInfoGrid({ items }: LocalInfoGridProps) {
  // Only show first 6 items
  const displayItems = items.slice(0, 6);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title font-display">local info</h2>
        <Link href="/info" className="text-sky text-sm font-medium hover:text-sky-dark transition-colors font-handwritten text-base">
          explore more →
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
