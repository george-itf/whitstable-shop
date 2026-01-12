'use client';

import { useState, useEffect } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import Link from 'next/link';

interface Winner {
  id: string;
  nominee_name: string;
  nominee_business: string | null;
  reason: string;
  rank: number;
  category: 'hospitality_star' | 'community_hero';
  award_month: string;
}

export default function AwardsPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const currentMonthKey = new Date().toISOString().slice(0, 7); // YYYY-MM format

  useEffect(() => {
    async function fetchWinners() {
      try {
        const res = await fetch('/api/nominations?status=winner');
        if (res.ok) {
          const data = await res.json();
          setWinners(data);
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWinners();
  }, []);

  // Separate current month winners from past
  const currentMonthWinners = winners.filter((w) => w.award_month === currentMonthKey);
  const pastWinners = winners.filter((w) => w.award_month !== currentMonthKey);

  // Group past winners by month
  const pastMonths = pastWinners.reduce((acc, winner) => {
    const month = winner.award_month;
    if (!acc[month]) {
      acc[month] = { hospitality_stars: 0, community_heroes: 0 };
    }
    if (winner.category === 'hospitality_star') {
      acc[month].hospitality_stars++;
    } else {
      acc[month].community_heroes++;
    }
    return acc;
  }, {} as Record<string, { hospitality_stars: number; community_heroes: number }>);

  const sortedPastMonths = Object.entries(pastMonths)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, counts]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      ...counts,
    }));

  const hospitalityStars = currentMonthWinners
    .filter((w) => w.category === 'hospitality_star')
    .sort((a, b) => a.rank - b.rank);

  const communityHeroes = currentMonthWinners
    .filter((w) => w.category === 'community_hero')
    .sort((a, b) => a.rank - b.rank);

  if (isLoading) {
    return (
      <MobileWrapper>
        <Header />
        <main className="px-4 py-6 pb-24">
          <div className="max-w-lg mx-auto animate-pulse">
            <div className="text-center mb-8">
              <div className="h-8 bg-ink/10 rounded w-48 mx-auto mb-2" />
              <div className="h-4 bg-ink/10 rounded w-64 mx-auto" />
            </div>
            <div className="h-24 bg-coral/20 rounded-2xl mb-8" />
            <div className="h-6 bg-ink/10 rounded w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-28 bg-ink/5 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      <Header />
      <main className="px-4 py-6 pb-24">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-ink mb-2">Whitstable Awards</h1>
            <p className="text-ink/70">
              Celebrating the people who make Whitstable special
            </p>
          </div>

          {/* Nominate CTA */}
          <Link
            href="/nominate"
            className="block bg-gradient-to-r from-coral to-coral/80 text-white p-5 rounded-2xl mb-8 text-center"
          >
            <div className="text-lg font-semibold mb-1">Know someone special?</div>
            <div className="text-white/80 text-sm">Nominate them for this month&apos;s awards →</div>
          </Link>

          {/* Current Month */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-ink mb-4">{currentMonth}</h2>

            {/* Hospitality Stars */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⭐</span>
                <h3 className="font-semibold text-ink">Hospitality Stars</h3>
              </div>
              {hospitalityStars.length > 0 ? (
                <div className="space-y-3">
                  {hospitalityStars.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-coral/5 border border-coral/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center text-lg">
                          {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-ink">{winner.nominee_name}</div>
                          {winner.nominee_business && (
                            <div className="text-sm text-ink/60">{winner.nominee_business}</div>
                          )}
                          <p className="text-sm text-ink/70 mt-2">&ldquo;{winner.reason}&rdquo;</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-ink/5 rounded-xl p-4 text-center text-ink/60">
                  Winners will be announced at the end of the month
                </div>
              )}
            </div>

            {/* Community Heroes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🦸</span>
                <h3 className="font-semibold text-ink">Community Heroes</h3>
              </div>
              {communityHeroes.length > 0 ? (
                <div className="space-y-3">
                  {communityHeroes.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-sky/5 border border-sky/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center text-lg">
                          {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-ink">{winner.nominee_name}</div>
                          <p className="text-sm text-ink/70 mt-2">&ldquo;{winner.reason}&rdquo;</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-ink/5 rounded-xl p-4 text-center text-ink/60">
                  Winners will be announced at the end of the month
                </div>
              )}
            </div>
          </div>

          {/* Past Winners */}
          {sortedPastMonths.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink mb-4">Past Winners</h2>
              <div className="space-y-3">
                {sortedPastMonths.map((month) => (
                  <div
                    key={month.month}
                    className="bg-paper border border-ink/10 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-ink">{month.month}</div>
                      <div className="text-sm text-ink/60">
                        {month.hospitality_stars} star{month.hospitality_stars !== 1 && 's'} · {month.community_heroes} hero{month.community_heroes !== 1 && 'es'}
                      </div>
                    </div>
                    <span className="text-ink/40">→</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-ink/5 rounded-xl p-4">
            <h3 className="font-semibold text-ink mb-2">How it works</h3>
            <ul className="text-sm text-ink/70 space-y-2">
              <li>• Anyone can nominate someone special</li>
              <li>• Up to 3 Hospitality Stars per month</li>
              <li>• Up to 3 Community Heroes per month</li>
              <li>• Winners announced at the end of each month</li>
              <li>• George reviews all nominations personally</li>
            </ul>
          </div>
        </div>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}
