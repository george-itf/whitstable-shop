'use client';

import { useState, useEffect } from 'react';
import { Trophy, Info, Star, Calendar } from 'lucide-react';
import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { LeaderboardTable } from '@/components/leaderboard';

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

  // Get the current week's date range
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekLabel = weekStart.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <Trophy className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Shop Leaderboard</h1>
          <p className="text-oyster-600">Top shops by community engagement</p>
        </div>
      </div>

      {/* How It Works */}
      <Card className="mb-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border-ocean-200">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-ocean-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-ocean-900 mb-1">How rankings work</p>
            <p className="text-sm text-ocean-700">
              Shops earn points from saves, reviews, photo tags, and clicks. Rankings update weekly.
              Support your favourite shops by saving them, leaving reviews, and tagging them in photos!
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="thisWeek" onChange={(v) => setPeriod(v as typeof period)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-sm text-oyster-500">
            <Calendar className="h-4 w-4" />
            Week of {weekLabel}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-oyster-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-oyster-200 rounded w-1/3" />
                    <div className="h-3 bg-oyster-200 rounded w-1/4" />
                  </div>
                  <div className="h-6 w-16 bg-oyster-200 rounded" />
                </Card>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <Card className="text-center py-12">
            <Trophy className="h-12 w-12 text-oyster-300 mx-auto mb-4" />
            <p className="text-oyster-600">No rankings available yet</p>
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
      <Card className="mt-8">
        <h2 className="font-semibold text-oyster-900 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          How Points Are Earned
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between py-2 border-b border-oyster-100">
            <span className="text-oyster-600">Page view</span>
            <span className="font-medium text-oyster-900">+1 pt</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-oyster-100">
            <span className="text-oyster-600">Shop saved</span>
            <span className="font-medium text-oyster-900">+10 pts</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-oyster-100">
            <span className="text-oyster-600">Review written</span>
            <span className="font-medium text-oyster-900">+25 pts</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-oyster-100">
            <span className="text-oyster-600">Photo tagged</span>
            <span className="font-medium text-oyster-900">+15 pts</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-oyster-100">
            <span className="text-oyster-600">Direction click</span>
            <span className="font-medium text-oyster-900">+5 pts</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-oyster-100">
            <span className="text-oyster-600">Phone call click</span>
            <span className="font-medium text-oyster-900">+5 pts</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
