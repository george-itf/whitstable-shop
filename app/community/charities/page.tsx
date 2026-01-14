'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ChevronLeft, Heart, Search } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { CharityCard } from "@/components/charity";
import type { Charity } from "@/types/database";

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCharities() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/charities');
        if (res.ok) {
          const data = await res.json();
          setCharities(data);
        }
      } catch (error) {
        console.error('Error fetching charities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCharities();
  }, []);

  const filteredCharities = searchQuery
    ? charities.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : charities;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/community">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Community Hub
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart className="h-6 w-6 text-rose-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Local Charities</h1>
          <p className="text-oyster-600">
            {isLoading ? 'Loading...' : `${charities.length} causes making a difference in our community`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-oyster-400" />
          <input
            type="text"
            placeholder="Search charities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-oyster-300 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
          />
        </div>
      </div>

      {/* Charities Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-6 skeleton w-3/4 mb-2" />
              <div className="h-4 skeleton w-full mb-1" />
              <div className="h-4 skeleton w-2/3" />
            </Card>
          ))}
        </div>
      ) : filteredCharities.length === 0 ? (
        <Card className="text-center py-12">
          <Heart className="h-12 w-12 text-oyster-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-oyster-900 mb-2">
            {searchQuery ? 'No charities found' : 'No charities yet'}
          </h2>
          <p className="text-oyster-600 max-w-md mx-auto">
            {searchQuery
              ? 'Try a different search term'
              : 'Check back soon for local charities and causes to support.'
            }
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredCharities.map((charity) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      )}

      {/* CTA */}
      <Card className="mt-8 text-center">
        <Heart className="h-12 w-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-oyster-900 mb-2">
          Know a local charity we&apos;re missing?
        </h2>
        <p className="text-oyster-600 mb-6 max-w-md mx-auto">
          Help us support more local causes by suggesting charities and
          organisations in the Whitstable area.
        </p>
        <Link href="/report">
          <Button>Suggest a Charity</Button>
        </Link>
      </Card>
    </div>
  );
}
