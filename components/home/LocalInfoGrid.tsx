import Link from 'next/link';
import { LocalInfo } from '@/types';
import {
  Trash2,
  Waves,
  Shell,
  ParkingSquare,
  Sun,
  Phone,
  Info,
  LucideIcon,
} from 'lucide-react';

interface LocalInfoGridProps {
  items: LocalInfo[];
}

interface InfoConfig {
  Icon: LucideIcon;
  bg: string;
  text: string;
}

// Each item has its own color scheme to feel more vibrant
const infoConfig: Record<string, InfoConfig> = {
  'bin-collection': {
    Icon: Trash2,
    bg: 'bg-green-light',
    text: 'text-green',
  },
  'tide-times': {
    Icon: Waves,
    bg: 'bg-sky-light',
    text: 'text-sky',
  },
  'oyster-festival': {
    Icon: Shell,
    bg: 'bg-coral-light',
    text: 'text-coral',
  },
  'parking': {
    Icon: ParkingSquare,
    bg: 'bg-sky-light',
    text: 'text-sky',
  },
  'beach-info': {
    Icon: Sun,
    bg: 'bg-yellow-light',
    text: 'text-yellow-600',
  },
  'emergency-contacts': {
    Icon: Phone,
    bg: 'bg-red-50',
    text: 'text-red-500',
  },
};

const defaultConfig: InfoConfig = {
  Icon: Info,
  bg: 'bg-sky-light',
  text: 'text-sky',
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
          const { Icon } = config;
          return (
            <Link
              key={item.id}
              href={`/info/${item.slug}`}
              className="card card-hover p-3 flex flex-col items-center text-center group"
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" strokeWidth={2} />
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
