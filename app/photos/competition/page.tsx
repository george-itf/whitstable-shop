'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Camera, Trophy, Users, Heart } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PhotoGrid, CompetitionBanner } from '@/components/photos';
import { createClient } from '@/lib/supabase/client';
import type { PhotoEntryWithUser, PhotoCompetition } from '@/types/database';

export default function PhotoCompetitionPage() {
  const [competition, setCompetition] = useState<PhotoCompetition | null>(null);
  const [photos, setPhotos] = useState<PhotoEntryWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [isVoting, setIsVoting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);

        // Fetch current competition
        const { data: competitionData } = await supabase
          .from('photo_competitions')
          .select('*')
          .in('status', ['submissions', 'voting'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setCompetition(competitionData);

        // Fetch competition entries
        if (competitionData) {
          const { data: photosData } = await supabase
            .from('photo_entries')
            .select(`
              *,
              profiles:user_id(display_name, avatar_url),
              shops:shop_id(name, slug)
            `)
            .eq('competition_month', competitionData.competition_month)
            .eq('status', 'approved')
            .order('vote_count', { ascending: false });

          setPhotos(photosData || []);
        }

        // Fetch user's votes if logged in
        if (user) {
          const { data: votes } = await supabase
            .from('photo_votes')
            .select('photo_id')
            .eq('user_id', user.id);

          if (votes) {
            setUserVotes(new Set(votes.map((v: { photo_id: string }) => v.photo_id)));
          }
        }
      } catch (error) {
        console.error('Error fetching competition:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleVote = async (photoId: string) => {
    if (!userId) {
      window.location.href = '/login?redirect=/photos/competition';
      return;
    }

    setIsVoting(true);
    try {
      const hasVoted = userVotes.has(photoId);
      const res = await fetch(`/api/photos/${photoId}/vote`, {
        method: hasVoted ? 'DELETE' : 'POST',
      });

      if (res.ok) {
        const newVotes = new Set(userVotes);
        if (hasVoted) {
          newVotes.delete(photoId);
        } else {
          newVotes.add(photoId);
        }
        setUserVotes(newVotes);

        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photoId
              ? { ...p, vote_count: p.vote_count + (hasVoted ? -1 : 1) }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-oyster-200 rounded mb-6" />
          <div className="h-48 bg-oyster-200 rounded-xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="bg-oyster-200 aspect-[4/3] rounded-xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-oyster-200 rounded w-3/4" />
                  <div className="h-3 bg-oyster-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/photos">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Gallery
            </Button>
          </Link>
        </div>

        <Card className="text-center py-12">
          <Camera className="h-12 w-12 text-oyster-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-oyster-900 mb-2">No Active Competition</h1>
          <p className="text-oyster-600 mb-6 max-w-md mx-auto">
            The next photo competition hasn&apos;t started yet. Check back soon or browse past winners!
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/photos">
              <Button variant="outline">Browse Gallery</Button>
            </Link>
            <Link href="/photos/winners">
              <Button>View Past Winners</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isSubmissionsOpen = competition.status === 'submissions';
  const isVotingOpen = competition.status === 'voting';

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

      {/* Competition Banner */}
      <div className="mb-8">
        <CompetitionBanner competition={competition} variant="full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <Users className="h-5 w-5 text-ocean-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">{photos.length}</p>
          <p className="text-sm text-oyster-500">Entries</p>
        </Card>
        <Card className="text-center">
          <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">
            {photos.reduce((sum, p) => sum + p.vote_count, 0)}
          </p>
          <p className="text-sm text-oyster-500">Votes</p>
        </Card>
        <Card className="text-center">
          <Camera className="h-5 w-5 text-ocean-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">
            {new Set(photos.map((p) => p.user_id)).size}
          </p>
          <p className="text-sm text-oyster-500">Photographers</p>
        </Card>
        <Card className="text-center">
          <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">
            {competition.prize_value || 'TBA'}
          </p>
          <p className="text-sm text-oyster-500">Prize</p>
        </Card>
      </div>

      {/* Competition Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-oyster-900">Competition Entries</h2>
          <p className="text-oyster-600">
            {isSubmissionsOpen
              ? 'Submit your photo to enter!'
              : isVotingOpen
              ? 'Vote for your favourite photos'
              : 'Competition in progress'}
          </p>
        </div>

        {isSubmissionsOpen && (
          <Link href="/photos/submit">
            <Button leftIcon={<Camera className="h-4 w-4" />}>Submit Your Photo</Button>
          </Link>
        )}
      </div>

      {/* Leaderboard for Top 3 */}
      {photos.length >= 3 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-oyster-900 mb-4">Current Leaders</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {photos.slice(0, 3).map((photo, index) => (
              <Link key={photo.id} href={`/photos/${photo.id}`}>
                <Card hoverable className="relative overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center ${
                      index === 0
                        ? 'bg-amber-500'
                        : index === 1
                        ? 'bg-slate-400'
                        : 'bg-amber-700'
                    } text-white font-bold text-sm rounded-bl-lg`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-oyster-100 relative">
                      <Image
                        src={photo.image_url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-oyster-900 truncate">{photo.title}</h4>
                      <p className="text-sm text-oyster-500 truncate">
                        {photo.profiles?.display_name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{photo.vote_count}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Entries */}
      <PhotoGrid
        photos={photos}
        userVotes={userVotes}
        onVote={handleVote}
        isVoting={isVoting}
        showVoteButton={isVotingOpen || isSubmissionsOpen}
        emptyMessage="No entries yet. Be the first to submit!"
      />
    </div>
  );
}
