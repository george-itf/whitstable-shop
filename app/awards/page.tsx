'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Star, Users, ArrowLeft, ChevronRight } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Card } from '@/components/ui';

interface Winner {
  id: string;
  winner_name: string; // Field name in award_winners table
  winner_business: string | null; // Field name in award_winners table
  reason: string;
  rank: number;
  category: 'hospitality_star' | 'community_hero';
  award_month: string;
}

export default function AwardsPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    async function fetchWinners() {
      try {
        // Use the public winners endpoint (not status=winner which requires admin)
        const res = await fetch('/api/nominations?winners=true');
        if (res.ok) {
          const data = await res.json();
          setWinners(data.winners || []);
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWinners();
  }, []);

  const currentMonthWinners = winners.filter((w) => w.award_month === currentMonthKey);
  const pastWinners = winners.filter((w) => w.award_month !== currentMonthKey);

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

  return (
    <MobileWrapper>
      {/* Yellow gradient header */}
      <div className="bg-gradient-to-br from-yellow to-yellow-dark px-4 pt-4 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">back</span>
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Whitstable Awards</h1>
            <p className="text-white/80 text-sm">Celebrating local heroes</p>
          </div>
        </div>

        {/* Nominate CTA */}
        <Link
          href="/nominate"
          className="block bg-white/20 backdrop-blur-sm rounded-xl p-3 mt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium text-sm">Know someone special?</p>
              <p className="text-white/70 text-xs">Nominate them for this month</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70" />
          </div>
        </Link>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-8 w-32 rounded" />
            <div className="skeleton h-24 rounded-xl" />
            <div className="skeleton h-24 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Current Month */}
            <div className="mb-6">
              <h2 className="font-semibold text-ink text-sm mb-4 section-title">{currentMonth}</h2>

              {/* Hospitality Stars */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-coral" />
                  <h3 className="font-medium text-ink text-sm">Hospitality Stars</h3>
                </div>
                {hospitalityStars.length > 0 ? (
                  <div className="space-y-2">
                    {hospitalityStars.map((winner, index) => (
                      <Card
                        key={winner.id}
                        className="bg-coral-light/30 border-coral/20 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center text-sm">
                            {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-ink text-sm">{winner.winner_name}</p>
                            {winner.winner_business && (
                              <p className="text-xs text-oyster-500">{winner.winner_business}</p>
                            )}
                            <p className="text-xs text-oyster-600 mt-1 line-clamp-2">
                              &ldquo;{winner.reason}&rdquo;
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-4 bg-oyster-50">
                    <p className="text-xs text-oyster-500">Winners announced end of month</p>
                  </Card>
                )}
              </div>

              {/* Community Heroes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-sky" />
                  <h3 className="font-medium text-ink text-sm">Community Heroes</h3>
                </div>
                {communityHeroes.length > 0 ? (
                  <div className="space-y-2">
                    {communityHeroes.map((winner, index) => (
                      <Card
                        key={winner.id}
                        className="bg-sky-light/30 border-sky/20 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky/20 flex items-center justify-center text-sm">
                            {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-ink text-sm">{winner.winner_name}</p>
                            <p className="text-xs text-oyster-600 mt-1 line-clamp-2">
                              &ldquo;{winner.reason}&rdquo;
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-4 bg-oyster-50">
                    <p className="text-xs text-oyster-500">Winners announced end of month</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Past Winners */}
            {sortedPastMonths.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold text-ink text-sm mb-3 section-title">Past Winners</h2>
                <div className="space-y-2">
                  {sortedPastMonths.map((month, index) => (
                    <Card
                      key={month.month}
                      className="flex items-center justify-between animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div>
                        <p className="font-medium text-ink text-sm">{month.month}</p>
                        <p className="text-xs text-oyster-500">
                          {month.hospitality_stars} star{month.hospitality_stars !== 1 && 's'} · {month.community_heroes} hero{month.community_heroes !== 1 && 'es'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-oyster-400" />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* How it works */}
            <Card className="bg-sand-100">
              <h3 className="font-semibold text-ink text-sm mb-2">How it works</h3>
              <ul className="text-xs text-oyster-600 space-y-1.5">
                <li>• Anyone can nominate someone special</li>
                <li>• Up to 3 Hospitality Stars & 3 Community Heroes</li>
                <li>• Winners announced at month end</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </MobileWrapper>
  );
}
