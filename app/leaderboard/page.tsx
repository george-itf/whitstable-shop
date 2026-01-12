import { Trophy, Info, TrendingUp, Star, Calendar } from "lucide-react";
import { Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { LeaderboardTable } from "@/components/leaderboard";

// Mock leaderboard data
const mockLeaderboardEntries = [
  {
    shop: { id: "1", name: "Whitstable Oyster Company", slug: "whitstable-oyster-company", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 2450, rank: 1, rank_change: 2 },
    badges: [{ badge_type: "trending_weekly" }, { badge_type: "review_star" }],
  },
  {
    shop: { id: "2", name: "The Cheese Box", slug: "the-cheese-box", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 2180, rank: 2, rank_change: -1 },
    badges: [{ badge_type: "most_saved" }],
  },
  {
    shop: { id: "3", name: "Frank", slug: "frank", category: "Retail", image_url: null },
    stats: { engagement_score: 1920, rank: 3, rank_change: 3 },
    badges: [{ badge_type: "new_favourite" }],
  },
  {
    shop: { id: "4", name: "Wheeler's Oyster Bar", slug: "wheelers-oyster-bar", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 1750, rank: 4, rank_change: 0 },
    badges: [{ badge_type: "local_legend" }],
  },
  {
    shop: { id: "5", name: "JoJo's", slug: "jojos", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 1680, rank: 5, rank_change: -2 },
    badges: [],
  },
  {
    shop: { id: "6", name: "Samphire", slug: "samphire", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 1520, rank: 6, rank_change: 1 },
    badges: [],
  },
  {
    shop: { id: "7", name: "Windy Corner Stores", slug: "windy-corner-stores", category: "Retail", image_url: null },
    stats: { engagement_score: 1380, rank: 7, rank_change: 4 },
    badges: [{ badge_type: "community_choice" }],
  },
  {
    shop: { id: "8", name: "The Sportsman", slug: "the-sportsman", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 1290, rank: 8, rank_change: -1 },
    badges: [{ badge_type: "review_star" }],
  },
  {
    shop: { id: "9", name: "Harbour Street Books", slug: "harbour-street-books", category: "Retail", image_url: null },
    stats: { engagement_score: 1150, rank: 9, rank_change: 0 },
    badges: [],
  },
  {
    shop: { id: "10", name: "The Old Neptune", slug: "the-old-neptune", category: "Food & Drink", image_url: null },
    stats: { engagement_score: 1080, rank: 10, rank_change: 2 },
    badges: [{ badge_type: "photo_favourite" }],
  },
];

export const metadata = {
  title: "Shop Leaderboard",
  description: "See the most popular shops in Whitstable this week",
};

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <Trophy className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Shop Leaderboard</h1>
          <p className="text-oyster-600">
            Top shops by community engagement
          </p>
        </div>
      </div>

      {/* How It Works */}
      <Card className="mb-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border-ocean-200">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-ocean-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-ocean-900 mb-1">How rankings work</p>
            <p className="text-sm text-ocean-700">
              Shops earn points from saves, reviews, photo tags, and clicks.
              Rankings update weekly. Support your favourite shops by saving them,
              leaving reviews, and tagging them in photos!
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="thisWeek">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="thisWeek">This Week</TabsTrigger>
            <TabsTrigger value="thisMonth">This Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-sm text-oyster-500">
            <Calendar className="h-4 w-4" />
            Week of Jan 6, 2025
          </div>
        </div>

        <TabsContent value="thisWeek">
          <LeaderboardTable entries={mockLeaderboardEntries} period="week" />
        </TabsContent>

        <TabsContent value="thisMonth">
          <LeaderboardTable
            entries={mockLeaderboardEntries}
            period="month"
            showRankChange={false}
          />
        </TabsContent>

        <TabsContent value="allTime">
          <LeaderboardTable
            entries={mockLeaderboardEntries}
            period="allTime"
            showRankChange={false}
          />
        </TabsContent>
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
