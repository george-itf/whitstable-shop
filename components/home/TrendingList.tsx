'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Store,
  Heart,
  HelpCircle,
  Info,
  Camera,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui';

// Trending item from API
interface TrendingItem {
  entity_type: string;
  entity_id: string;
  score: number;
  trend_direction: 'up' | 'down' | 'steady' | 'new';
  trend_change_pct: number;
  view_count: number;
  engagement_count: number;
  rank: number;
  name?: string;
  slug?: string;
  tagline?: string;
  image_url?: string;
  reason: string;
}

// Entity type configuration
const ENTITY_CONFIG: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  icon: typeof Store;
  baseUrl: string;
}> = {
  shop: {
    label: 'Shop',
    color: 'text-sky',
    bgColor: 'bg-sky-light',
    icon: Store,
    baseUrl: '/shops',
  },
  charity: {
    label: 'Charity',
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    icon: Heart,
    baseUrl: '/charities',
  },
  question: {
    label: 'Question',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    icon: HelpCircle,
    baseUrl: '/ask',
  },
  info_page: {
    label: 'Info',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: Info,
    baseUrl: '/info',
  },
  photo: {
    label: 'Photo',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: Camera,
    baseUrl: '/photos',
  },
  event: {
    label: 'Event',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    icon: Calendar,
    baseUrl: '/events',
  },
};

// Trend direction icons
const TrendIcon = ({ direction }: { direction: string }) => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    case 'new':
      return <Sparkles className="w-4 h-4 text-amber-500" />;
    default:
      return <Minus className="w-4 h-4 text-grey" />;
  }
};

// Get link for entity
function getEntityLink(item: TrendingItem): string {
  const config = ENTITY_CONFIG[item.entity_type];
  if (!config) return '#';

  // Info pages use slug directly
  if (item.entity_type === 'info_page') {
    return `${config.baseUrl}/${item.slug}`;
  }

  // Questions use ID
  if (item.entity_type === 'question') {
    return `${config.baseUrl}?question=${item.entity_id}`;
  }

  // Photos link to gallery with ID
  if (item.entity_type === 'photo') {
    return `${config.baseUrl}/${item.entity_id}`;
  }

  // Events link to detail page
  if (item.entity_type === 'event') {
    return `${config.baseUrl}/${item.entity_id}`;
  }

  // Shops and charities use slug
  return `${config.baseUrl}/${item.slug}`;
}

interface TrendingListProps {
  limit?: number;
  showHeader?: boolean;
}

export default function TrendingList({ limit = 5, showHeader = true }: TrendingListProps) {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/trending?limit=${limit}`);

        if (!res.ok) {
          throw new Error('Failed to fetch trending');
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Trending fetch error:', err);
        setError('Could not load trending items');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrending();
  }, [limit]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="px-4 py-6">
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-grey-light rounded w-32 animate-pulse" />
            <div className="h-4 bg-grey-light rounded w-16 animate-pulse" />
          </div>
        )}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-grey-light animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-grey-light rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-grey-light rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || items.length === 0) {
    return null; // Don't show section if no trending data
  }

  return (
    <div className="px-4 py-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-coral" />
            <h2 className="section-title">trending now</h2>
          </div>
          <Link
            href="/trending"
            className="text-sky text-sm font-medium hover:underline"
          >
            see all
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => {
          const config = ENTITY_CONFIG[item.entity_type] || ENTITY_CONFIG.shop;
          const EntityIcon = config.icon;

          return (
            <Link
              key={`${item.entity_type}-${item.entity_id}`}
              href={getEntityLink(item)}
              className="card card-hover p-3 flex items-center gap-3 group"
            >
              {/* Rank & Entity Icon */}
              <div className={`relative w-10 h-10 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center`}>
                <EntityIcon className="w-5 h-5" />
                {/* Rank badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-ink truncate group-hover:text-sky transition-colors">
                    {item.name || 'Untitled'}
                  </h3>
                  <TrendIcon direction={item.trend_direction} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="default" size="sm" className={`${config.bgColor} ${config.color} border-0`}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-grey truncate">{item.reason}</span>
                </div>
              </div>

              {/* Arrow */}
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
                className="text-grey-light group-hover:text-sky transition-colors flex-shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
