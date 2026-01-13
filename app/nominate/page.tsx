'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, Star, Users, Check } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Button, Input, Card } from '@/components/ui';

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
        <div className="bg-gradient-to-br from-green to-green-dark px-4 pt-4 pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">back</span>
          </Link>
        </div>

        <div className="px-4 py-6 -mt-8">
          <Card className="text-center py-8">
            <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green" />
            </div>
            <h1 className="text-xl font-bold text-ink mb-2">Thank You!</h1>
            <p className="text-sm text-oyster-600 mb-6">
              Your nomination has been submitted. Winners will be announced at the end of the month.
            </p>
            <Link href="/awards">
              <Button>View Past Winners</Button>
            </Link>
          </Card>
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Coral gradient header */}
      <div className="bg-gradient-to-br from-coral to-coral-dark px-4 pt-4 pb-6">
        <Link
          href="/awards"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">awards</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Nominate</h1>
            <p className="text-white/80 text-sm">Recognise someone special</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-ink mb-3">
            Award Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCategory('hospitality_star')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                category === 'hospitality_star'
                  ? 'border-coral bg-coral-light/30'
                  : 'border-oyster-200 hover:border-oyster-300'
              }`}
            >
              <Star className={`w-5 h-5 mb-2 ${category === 'hospitality_star' ? 'text-coral' : 'text-oyster-400'}`} />
              <div className="font-medium text-ink text-sm">Hospitality Star</div>
              <div className="text-xs text-oyster-500 mt-0.5">Outstanding service</div>
            </button>
            <button
              type="button"
              onClick={() => setCategory('community_hero')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                category === 'community_hero'
                  ? 'border-sky bg-sky-light/30'
                  : 'border-oyster-200 hover:border-oyster-300'
              }`}
            >
              <Users className={`w-5 h-5 mb-2 ${category === 'community_hero' ? 'text-sky' : 'text-oyster-400'}`} />
              <div className="font-medium text-ink text-sm">Community Hero</div>
              <div className="text-xs text-oyster-500 mt-0.5">Making a difference</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nominee Details */}
          <Input
            label="Who are you nominating?"
            value={nomineeName}
            onChange={(e) => setNomineeName(e.target.value)}
            placeholder="Their name"
            required
          />

          {category === 'hospitality_star' && (
            <Input
              label="Where do they work?"
              value={nomineeBusiness}
              onChange={(e) => setNomineeBusiness(e.target.value)}
              placeholder="Business name"
            />
          )}

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
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
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-oyster-200 focus:border-sky focus:ring-1 focus:ring-sky outline-none resize-none text-sm"
            />
          </div>

          {/* Nominator Details */}
          <div className="pt-4 border-t border-oyster-100">
            <h3 className="text-sm font-semibold text-ink mb-3">Your Details</h3>
            <div className="space-y-3">
              <Input
                label="Your name"
                value={nominatorName}
                onChange={(e) => setNominatorName(e.target.value)}
                placeholder="Your name"
                required
              />
              <div>
                <Input
                  label="Your email (optional)"
                  type="email"
                  value={nominatorEmail}
                  onChange={(e) => setNominatorEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                <p className="text-xs text-oyster-400 mt-1">
                  We&apos;ll notify you if your nominee wins
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            className="mt-6"
          >
            Submit Nomination
          </Button>
        </form>
      </div>
    </MobileWrapper>
  );
}
