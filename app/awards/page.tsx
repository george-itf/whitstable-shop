import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import Link from 'next/link';

// Mock data - will be replaced with Supabase data
const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

const mockHospitalityStars = [
  {
    id: '1',
    winner_name: 'Sarah at The Forge',
    winner_business: 'The Forge',
    reason: 'Always remembers regular customers and goes above and beyond to make everyone feel welcome.',
    rank: 1,
  },
];

const mockCommunityHeroes = [
  {
    id: '1',
    winner_name: 'Mike Thompson',
    reason: 'Organised the beach clean-up that brought together over 50 volunteers.',
    rank: 1,
  },
];

const pastMonths = [
  { month: 'December 2025', hospitalityStars: 2, communityHeroes: 1 },
  { month: 'November 2025', hospitalityStars: 3, communityHeroes: 2 },
];

export default function AwardsPage() {
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
              {mockHospitalityStars.length > 0 ? (
                <div className="space-y-3">
                  {mockHospitalityStars.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-coral/5 border border-coral/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center text-lg">
                          {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-ink">{winner.winner_name}</div>
                          {winner.winner_business && (
                            <div className="text-sm text-ink/60">{winner.winner_business}</div>
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
              {mockCommunityHeroes.length > 0 ? (
                <div className="space-y-3">
                  {mockCommunityHeroes.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-sky/5 border border-sky/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center text-lg">
                          {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-ink">{winner.winner_name}</div>
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
          {pastMonths.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink mb-4">Past Winners</h2>
              <div className="space-y-3">
                {pastMonths.map((month) => (
                  <div
                    key={month.month}
                    className="bg-paper border border-ink/10 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-ink">{month.month}</div>
                      <div className="text-sm text-ink/60">
                        {month.hospitalityStars} star{month.hospitalityStars !== 1 && 's'} · {month.communityHeroes} hero{month.communityHeroes !== 1 && 'es'}
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
