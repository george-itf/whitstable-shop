'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Trophy, Calendar, Heart, Camera } from 'lucide-react';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { PhotoEntryWithUser, PhotoCompetition } from '@/types/database';

interface WinnerMonth {
  month: string;
  competition: PhotoCompetition | null;
  winner: PhotoEntryWithUser | null;
  runnerUp: PhotoEntryWithUser | null;
}

export default function PhotoWinnersPage() {
  const [winners, setWinners] = useState<WinnerMonth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWinners() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Fetch completed competitions
        const { data: competitions } = await supabase
          .from('photo_competitions')
          .select('*')
          .eq('status', 'completed')
          .order('competition_month', { ascending: false })
          .limit(12);

        if (!competitions || competitions.length === 0) {
          setWinners([]);
          return;
        }

        // Fetch winners for each competition
        const winnersData: WinnerMonth[] = await Promise.all(
          competitions.map(async (competition) => {
            // Get winner
            const { data: winner } = await supabase
              .from('photo_entries')
              .select(`
                *,
                profiles:user_id(display_name, avatar_url),
                shops:shop_id(name, slug)
              `)
              .eq('competition_month', competition.competition_month)
              .eq('status', 'winner')
              .single();

            // Get runner up
            const { data: runnerUp } = await supabase
              .from('photo_entries')
              .select(`
                *,
                profiles:user_id(display_name, avatar_url),
                shops:shop_id(name, slug)
              `)
              .eq('competition_month', competition.competition_month)
              .eq('status', 'runner_up')
              .single();

            return {
              month: competition.competition_month,
              competition,
              winner,
              runnerUp,
            };
          })
        );

        setWinners(winnersData);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWinners();
  }, []);

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-oyster-200 rounded mb-6" />
          <div className="h-6 w-48 bg-oyster-200 rounded mb-8" />
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-6 w-32 bg-oyster-200 rounded mb-4" />
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="h-72 bg-oyster-200 rounded-xl" />
                  <div className="h-72 bg-oyster-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/photos">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Gallery
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold text-oyster-900">Past Winners</h1>
        </div>
        <p className="text-oyster-600">
          Celebrating the best photos from our monthly competitions
        </p>
      </div>

      {winners.length === 0 ? (
        <Card className="text-center py-12">
          <Camera className="h-12 w-12 text-oyster-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-oyster-900 mb-2">No Winners Yet</h2>
          <p className="text-oyster-600 mb-6 max-w-md mx-auto">
            The first photo competition hasn&apos;t concluded yet. Check back soon to see our winners!
          </p>
          <Link href="/photos/competition">
            <Button>View Current Competition</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-16">
          {winners.map((winnerMonth) => (
            <section key={winnerMonth.month}>
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-5 w-5 text-ocean-500" />
                <h2 className="text-xl font-bold text-oyster-900">
                  {formatMonthYear(winnerMonth.month)}
                </h2>
                {winnerMonth.competition?.theme && (
                  <Badge variant="outline">Theme: {winnerMonth.competition.theme}</Badge>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Winner */}
                {winnerMonth.winner && (
                  <Link href={`/photos/${winnerMonth.winner.id}`}>
                    <Card hoverable padding="none" className="overflow-hidden h-full">
                      <div className="relative aspect-video">
                        <Image
                          src={winnerMonth.winner.image_url}
                          alt={winnerMonth.winner.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge variant="warning" className="shadow-lg">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{winnerMonth.winner.title}</h3>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={winnerMonth.winner.profiles?.avatar_url}
                              fallback={winnerMonth.winner.profiles?.display_name || 'U'}
                              size="sm"
                            />
                            <span className="text-sm">
                              {winnerMonth.winner.profiles?.display_name || 'Anonymous'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm text-oyster-600">
                          {winnerMonth.winner.location || 'Whitstable'}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-oyster-500">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{winnerMonth.winner.vote_count} votes</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )}

                {/* Runner Up */}
                {winnerMonth.runnerUp && (
                  <Link href={`/photos/${winnerMonth.runnerUp.id}`}>
                    <Card hoverable padding="none" className="overflow-hidden h-full">
                      <div className="relative aspect-video">
                        <Image
                          src={winnerMonth.runnerUp.image_url}
                          alt={winnerMonth.runnerUp.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge variant="info" className="shadow-lg">
                            Runner Up
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{winnerMonth.runnerUp.title}</h3>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={winnerMonth.runnerUp.profiles?.avatar_url}
                              fallback={winnerMonth.runnerUp.profiles?.display_name || 'U'}
                              size="sm"
                            />
                            <span className="text-sm">
                              {winnerMonth.runnerUp.profiles?.display_name || 'Anonymous'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm text-oyster-600">
                          {winnerMonth.runnerUp.location || 'Whitstable'}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-oyster-500">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{winnerMonth.runnerUp.vote_count} votes</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )}
              </div>

              {/* Prize Info */}
              {winnerMonth.competition?.prize_description && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Prize:</strong> {winnerMonth.competition.prize_description}
                    {winnerMonth.competition.prize_value && ` (${winnerMonth.competition.prize_value})`}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
