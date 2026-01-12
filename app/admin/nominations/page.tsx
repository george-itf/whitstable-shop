'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock nominations - will be replaced with Supabase data
const mockNominations = [
  {
    id: '1',
    category: 'hospitality_star',
    nominee_name: 'Sarah',
    nominee_business: 'The Forge',
    reason: 'Always goes above and beyond. Remembered my coffee order after just one visit!',
    nominator_name: 'John D.',
    award_month: '2026-01',
    status: 'pending',
    created_at: '2026-01-10T10:30:00Z',
  },
  {
    id: '2',
    category: 'community_hero',
    nominee_name: 'Mike Thompson',
    nominee_business: null,
    reason: 'Organised the beach clean-up last weekend. Over 50 people showed up!',
    nominator_name: 'Lisa M.',
    award_month: '2026-01',
    status: 'pending',
    created_at: '2026-01-09T14:20:00Z',
  },
  {
    id: '3',
    category: 'hospitality_star',
    nominee_name: 'Tom at Wheelers',
    nominee_business: 'Wheelers Oyster Bar',
    reason: 'Made our anniversary dinner so special. Truly exceptional service.',
    nominator_name: 'Emma R.',
    award_month: '2026-01',
    status: 'pending',
    created_at: '2026-01-08T09:15:00Z',
  },
];

type Nomination = typeof mockNominations[0];

export default function AdminNominationsPage() {
  const [nominations] = useState<Nomination[]>(mockNominations);
  const [filter, setFilter] = useState<'all' | 'hospitality_star' | 'community_hero'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'winner'>('pending');

  const filteredNominations = nominations.filter((nom) => {
    if (filter !== 'all' && nom.category !== filter) return false;
    if (statusFilter !== 'all' && nom.status !== statusFilter) return false;
    return true;
  });

  const handleMakeWinner = (id: string, rank: number) => {
    // TODO: Implement with Supabase
    console.log('Make winner:', id, 'rank:', rank);
    alert(`Made nomination ${id} a winner with rank ${rank}. (Demo mode)`);
  };

  const handleReject = (id: string) => {
    // TODO: Implement with Supabase
    console.log('Reject:', id);
    alert(`Rejected nomination ${id}. (Demo mode)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sky text-sm">← Back to Admin</Link>
            <h1 className="text-xl font-bold text-ink">Nominations</h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-ink/60">January 2026</div>
            <div className="text-sm font-medium">{nominations.length} nominations</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 bg-white border rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="hospitality_star">⭐ Hospitality Stars</option>
            <option value="community_hero">🦸 Community Heroes</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 bg-white border rounded-lg text-sm"
          >
            <option value="pending">Pending Review</option>
            <option value="winner">Winners</option>
            <option value="all">All Status</option>
          </select>
        </div>

        {/* Nominations List */}
        <div className="space-y-4">
          {filteredNominations.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-ink/60">
              No nominations found
            </div>
          ) : (
            filteredNominations.map((nom) => (
              <div key={nom.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      nom.category === 'hospitality_star'
                        ? 'bg-coral/10 text-coral'
                        : 'bg-sky/10 text-sky'
                    }`}>
                      {nom.category === 'hospitality_star' ? '⭐ Hospitality Star' : '🦸 Community Hero'}
                    </span>
                    <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                      nom.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : nom.status === 'winner'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {nom.status}
                    </span>
                  </div>
                  <div className="text-xs text-ink/50">
                    {new Date(nom.created_at).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="font-semibold text-ink text-lg">
                  {nom.nominee_name}
                  {nom.nominee_business && (
                    <span className="font-normal text-ink/60"> at {nom.nominee_business}</span>
                  )}
                </h3>

                <p className="text-ink/70 mt-2 mb-4">&ldquo;{nom.reason}&rdquo;</p>

                <div className="flex items-center justify-between pt-3 border-t border-ink/10">
                  <div className="text-sm text-ink/50">
                    Nominated by {nom.nominator_name}
                  </div>

                  {nom.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMakeWinner(nom.id, 1)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                      >
                        🥇 1st
                      </button>
                      <button
                        onClick={() => handleMakeWinner(nom.id, 2)}
                        className="px-3 py-1 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500"
                      >
                        🥈 2nd
                      </button>
                      <button
                        onClick={() => handleMakeWinner(nom.id, 3)}
                        className="px-3 py-1 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
                      >
                        🥉 3rd
                      </button>
                      <button
                        onClick={() => handleReject(nom.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
