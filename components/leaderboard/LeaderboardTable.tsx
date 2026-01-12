'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Minus, Trophy, Star, Heart, Camera } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn, getRankChangeIcon } from '@/lib/utils';
import type { Shop, ShopWeeklyStats, ShopBadge } from '@/types/database';
import { SHOP_BADGES } from '@/types/database';

interface LeaderboardEntry {
  shop: Pick<Shop, 'id' | 'name' | 'slug' | 'category' | 'image_url'>;
  stats: Pick<ShopWeeklyStats, 'engagement_score' | 'rank' | 'rank_change'>;
  badges: Pick<ShopBadge, 'badge_type'>[];
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  showRankChange?: boolean;
  period?: 'week' | 'month' | 'allTime';
}

export function LeaderboardTable({
  entries,
  showRankChange = true,
  period = 'week',
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-700" />;
    return null;
  };

  const getChangeIcon = (change: number | null) => {
    if (change === null || change === 0) {
      return <Minus className="h-4 w-4 text-oyster-400" />;
    }
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card padding="none">
      <div className="divide-y divide-oyster-100">
        {entries.map((entry, index) => {
          const rank = entry.stats.rank || index + 1;
          const isTopThree = rank <= 3;

          return (
            <Link
              key={entry.shop.id}
              href={`/shops/${entry.shop.slug}`}
              className={cn(
                'flex items-center gap-4 p-4 hover:bg-oyster-50 transition-colors',
                isTopThree && 'bg-gradient-to-r from-amber-50/50 to-transparent'
              )}
            >
              {/* Rank */}
              <div className="w-10 flex items-center justify-center">
                {getRankIcon(rank) || (
                  <span className="text-lg font-bold text-oyster-400">{rank}</span>
                )}
              </div>

              {/* Rank Change */}
              {showRankChange && (
                <div className="w-8 flex items-center gap-1">
                  {getChangeIcon(entry.stats.rank_change)}
                  {entry.stats.rank_change !== null && entry.stats.rank_change !== 0 && (
                    <span
                      className={cn(
                        'text-xs font-medium',
                        entry.stats.rank_change > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {Math.abs(entry.stats.rank_change)}
                    </span>
                  )}
                </div>
              )}

              {/* Shop Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-oyster-100 flex-shrink-0">
                {entry.shop.image_url ? (
                  <Image
                    src={entry.shop.image_url}
                    alt={entry.shop.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-oyster-400">
                    <Star className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Shop Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-oyster-900 truncate">{entry.shop.name}</p>
                <p className="text-sm text-oyster-500">{entry.shop.category}</p>
              </div>

              {/* Badges */}
              <div className="hidden sm:flex items-center gap-1">
                {entry.badges.slice(0, 3).map((badge) => {
                  const badgeInfo = SHOP_BADGES[badge.badge_type as keyof typeof SHOP_BADGES];
                  return (
                    <Badge
                      key={badge.badge_type}
                      variant="outline"
                      size="sm"
                      title={badgeInfo?.description}
                    >
                      {badgeInfo?.label || badge.badge_type}
                    </Badge>
                  );
                })}
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="font-bold text-oyster-900">
                  {entry.stats.engagement_score.toLocaleString()}
                </p>
                <p className="text-xs text-oyster-500">points</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
