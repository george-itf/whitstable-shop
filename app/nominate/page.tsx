'use client';

import { useState } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

type Category = 'hospitality_star' | 'community_hero';

export default function NominatePage() {
  const [category, setCategory] = useState<Category>('hospitality_star');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeBusiness, setNomineeBusiness] = useState('');
  const [reason, setReason] = useState('');
  const [nominatorName, setNominatorName] = useState('');
  const [nominatorEmail, setNominatorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get current month in YYYY-MM format
    const now = new Date();
    const awardMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    try {
      const response = await fetch('/api/nominations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          nominee_name: nomineeName,
          nominee_business: nomineeBusiness || null,
          reason,
          nominator_name: nominatorName,
          nominator_email: nominatorEmail || null,
          award_month: awardMonth,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting nomination:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <MobileWrapper>
        <Header />
        <main className="px-4 py-8 pb-24">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-ink mb-4">Thank You!</h1>
            <p className="text-ink/70 mb-6">
              Your nomination has been submitted. George will review all nominations
              and announce the winners at the end of the month.
            </p>
            <a
              href="/awards"
              className="inline-block bg-sky text-white px-6 py-3 rounded-full font-semibold"
            >
              View Past Winners
            </a>
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
          <h1 className="text-2xl font-bold text-ink mb-2">Nominate Someone Special</h1>
          <p className="text-ink/70 mb-6">
            Know someone who deserves recognition? Nominate them for our monthly awards!
          </p>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-3">
              Award Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('hospitality_star')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  category === 'hospitality_star'
                    ? 'border-coral bg-coral/10'
                    : 'border-ink/10 hover:border-ink/30'
                }`}
              >
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-semibold text-ink">Hospitality Star</div>
                <div className="text-sm text-ink/60">
                  Outstanding service in local businesses
                </div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('community_hero')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  category === 'community_hero'
                    ? 'border-sky bg-sky/10'
                    : 'border-ink/10 hover:border-ink/30'
                }`}
              >
                <div className="text-2xl mb-2">🦸</div>
                <div className="font-semibold text-ink">Community Hero</div>
                <div className="text-sm text-ink/60">
                  Making Whitstable a better place
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nominee Details */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Who are you nominating? *
              </label>
              <input
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder="Their name"
                required
                className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-sky focus:ring-1 focus:ring-sky outline-none"
              />
            </div>

            {category === 'hospitality_star' && (
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Where do they work?
                </label>
                <input
                  type="text"
                  value={nomineeBusiness}
                  onChange={(e) => setNomineeBusiness(e.target.value)}
                  placeholder="Business name"
                  className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-sky focus:ring-1 focus:ring-sky outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Why should they win? *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  category === 'hospitality_star'
                    ? "Tell us about the exceptional service they provided..."
                    : "Tell us how they've helped the Whitstable community..."
                }
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-sky focus:ring-1 focus:ring-sky outline-none resize-none"
              />
            </div>

            {/* Nominator Details */}
            <div className="pt-4 border-t border-ink/10">
              <h3 className="text-sm font-semibold text-ink mb-3">Your Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink/70 mb-1">
                    Your name *
                  </label>
                  <input
                    type="text"
                    value={nominatorName}
                    onChange={(e) => setNominatorName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-sky focus:ring-1 focus:ring-sky outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-ink/70 mb-1">
                    Your email (optional)
                  </label>
                  <input
                    type="email"
                    value={nominatorEmail}
                    onChange={(e) => setNominatorEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-sky focus:ring-1 focus:ring-sky outline-none"
                  />
                  <p className="text-xs text-ink/50 mt-1">
                    We&apos;ll only use this to notify you if your nominee wins
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral text-white py-4 rounded-full font-semibold hover:bg-coral/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Nomination'}
            </button>
          </form>
        </div>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}
