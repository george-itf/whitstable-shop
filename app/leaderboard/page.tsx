'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Info, Star, Calendar, ArrowLeft, TrendingUp } from 'lucide-react';
import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { LeaderboardTable } from '@/components/leaderboard';
import MobileWrapper from '@/components/layout/MobileWrapper';

interface LeaderboardEntry {
  shop: {
    id: string;
    name: string;
    slug: string;
    category: string;
    image_url: string | null;
  };
  stats: {
    engagement_score: number;
    rank: number;
    rank_change: number;
  };
  badges: { badge_type: string }[];
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'allTime'>('week');

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?period=${period}`);
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period]);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekLabel = weekStart.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <MobileWrapper>
      {/* Yellow/amber gradient header */}
      <div className="bg-gradient-to-br from-yellow to-yellow-dark px-4 pt-4 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">back</span>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Leaderboard</h1>
            <p className="text-white/80 text-sm">Top Whitstable shops</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-center">
            <Trophy className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-base font-bold text-white">{entries.length}</p>
            <p className="text-[10px] text-white/70">ranked</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-center">
            <TrendingUp className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-base font-bold text-white">
              {entries.filter(e => e.stats.rank_change > 0).length}
            </p>
            <p className="text-[10px] text-white/70">rising</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-center">
            <Calendar className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-base font-bold text-white">{weekLabel}</p>
            <p className="text-[10px] text-white/70">week of</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* How It Works */}
        <div className="bg-sky-light/50 border border-sky/20 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-sky mt-0.5 flex-shrink-0" />
            <p className="text-xs text-oyster-600">
              Shops earn points from saves, reviews, and engagement. Support your favourites!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="week" onChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="mb-4">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-oyster-200 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-oyster-200 rounded w-2/3" />
                      <div className="h-2.5 bg-oyster-200 rounded w-1/3" />
                    </div>
                    <div className="h-5 w-12 bg-oyster-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <Card className="text-center py-8">
              <Trophy className="h-10 w-10 text-oyster-300 mx-auto mb-3" />
              <p className="text-sm text-oyster-500">No rankings yet</p>
            </Card>
          ) : (
            <>
              <TabsContent value="week">
                <LeaderboardTable entries={entries} period="week" />
              </TabsContent>
              <TabsContent value="month">
                <LeaderboardTable entries={entries} period="month" showRankChange={false} />
              </TabsContent>
              <TabsContent value="allTime">
                <LeaderboardTable entries={entries} period="allTime" showRankChange={false} />
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Scoring Breakdown */}
        <div className="mt-6">
          <h2 className="font-semibold text-ink text-sm mb-3 section-title flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow" />
            How Points Work
          </h2>
          <Card className="bg-sand-50">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-oyster-500">Page view</span>
                <span className="font-medium text-ink">+1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oyster-500">Save</span>
                <span className="font-medium text-ink">+10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oyster-500">Review</span>
                <span className="font-medium text-ink">+25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oyster-500">Photo tag</span>
                <span className="font-medium text-ink">+15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oyster-500">Directions</span>
                <span className="font-medium text-ink">+5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oyster-500">Call click</span>
                <span className="font-medium text-ink">+5</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileWrapper>
  );
}
