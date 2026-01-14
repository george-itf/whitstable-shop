'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
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
  Flame,
} from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

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
const TrendIcon = ({ direction, showLabel = false }: { direction: string; showLabel?: boolean }) => {
  const configs = {
    up: { icon: TrendingUp, color: 'text-emerald-500', label: 'Rising' },
    down: { icon: TrendingDown, color: 'text-red-400', label: 'Falling' },
    new: { icon: Sparkles, color: 'text-amber-500', label: 'New' },
    steady: { icon: Minus, color: 'text-grey', label: 'Steady' },
  };

  const config = configs[direction as keyof typeof configs] || configs.steady;
  const Icon = config.icon;

  if (showLabel) {
    return (
      <span className={`flex items-center gap-1 text-xs ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  }

  return <Icon className={`w-4 h-4 ${config.color}`} />;
};

// Get link for entity
function getEntityLink(item: TrendingItem): string {
  const config = ENTITY_CONFIG[item.entity_type];
  if (!config) return '#';

  if (item.entity_type === 'info_page') {
    return `${config.baseUrl}/${item.slug}`;
  }

  if (item.entity_type === 'question') {
    return `${config.baseUrl}?question=${item.entity_id}`;
  }

  if (item.entity_type === 'photo') {
    return `${config.baseUrl}/${item.entity_id}`;
  }

  if (item.entity_type === 'event') {
    return `${config.baseUrl}/${item.entity_id}`;
  }

  return `${config.baseUrl}/${item.slug}`;
}

// Time period options
const TIME_PERIODS = [
  { value: '24h', label: 'Today' },
  { value: '7d', label: 'This Week' },
  { value: '30d', label: 'This Month' },
];

// Entity type filter options
const TYPE_FILTERS = [
  { value: 'all', label: 'All', icon: Flame },
  { value: 'shop', label: 'Shops', icon: Store },
  { value: 'charity', label: 'Charities', icon: Heart },
  { value: 'question', label: 'Questions', icon: HelpCircle },
  { value: 'event', label: 'Events', icon: Calendar },
  { value: 'photo', label: 'Photos', icon: Camera },
  { value: 'info_page', label: 'Info', icon: Info },
];

export default function TrendingPage() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function fetchTrending() {
      try {
        setIsLoading(true);
        const typeParam = typeFilter !== 'all' ? `&type=${typeFilter}` : '';
        const res = await fetch(`/api/trending?limit=20&period=${period}${typeParam}`);

        if (!res.ok) {
          throw new Error('Failed to fetch trending');
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrending();
  }, [period, typeFilter]);

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-grey-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-ink hover:text-sky transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-coral" />
            <h1 className="font-bold text-lg text-ink">Trending</h1>
          </div>
        </div>

        {/* Time period tabs */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            {TIME_PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
                  period === p.value
                    ? 'bg-coral text-white'
                    : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter chips - scrollable */}
        <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {TYPE_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setTypeFilter(filter.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
                    typeFilter === filter.value
                      ? 'bg-ink text-white'
                      : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-grey-light animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 bg-grey-light rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-grey-light rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-grey" />
            </div>
            <h3 className="font-bold text-ink mb-2">No Trending Content</h3>
            <p className="text-grey text-sm">
              {typeFilter !== 'all'
                ? `No ${ENTITY_CONFIG[typeFilter]?.label.toLowerCase() || typeFilter}s are trending right now.`
                : 'Nothing is trending yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item, index) => {
              const config = ENTITY_CONFIG[item.entity_type] || ENTITY_CONFIG.shop;
              const EntityIcon = config.icon;

              return (
                <Link
                  key={`${item.entity_type}-${item.entity_id}`}
                  href={getEntityLink(item)}
                  className="card card-hover p-4 flex items-start gap-3 group"
                >
                  {/* Rank & Entity Icon */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center`}>
                      <EntityIcon className="w-6 h-6" />
                    </div>
                    {/* Rank badge */}
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-coral text-white text-sm font-bold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-ink group-hover:text-sky transition-colors line-clamp-2">
                        {item.name || 'Untitled'}
                      </h3>
                      <TrendIcon direction={item.trend_direction} showLabel />
                    </div>

                    {item.tagline && (
                      <p className="text-sm text-grey mt-1 line-clamp-1">{item.tagline}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default" size="sm" className={`${config.bgColor} ${config.color} border-0`}>
                        {config.label}
                      </Badge>
                      <span className="text-xs text-grey">{item.reason}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-grey">
                      <span>{item.view_count} views</span>
                      {item.engagement_count > 0 && (
                        <span>{item.engagement_count} engagements</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
