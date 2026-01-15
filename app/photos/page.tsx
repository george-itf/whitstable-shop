'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Filter, Trophy, Calendar, Image as ImageIcon, Users, Heart } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { PhotoGrid, CompetitionBanner } from '@/components/photos';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { createClient } from '@/lib/supabase/client';
import type { PhotoEntryWithUser, PhotoCompetition } from '@/types/database';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<PhotoEntryWithUser[]>([]);
  const [competition, setCompetition] = useState<PhotoCompetition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [isVoting, setIsVoting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular' | 'winners'>('recent');
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch photos and competition
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);

        // Fetch photos from API
        const photosRes = await fetch(`/api/photos?sort=${filter}&limit=50`);
        if (photosRes.ok) {
          const photosData = await photosRes.json();
          setPhotos(photosData);
        }

        // Fetch current competition
        const { data: competitionData } = await supabase
          .from('photo_competitions')
          .select('*')
          .in('status', ['submissions', 'voting'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setCompetition(competitionData);

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
        console.error('Error fetching photos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [filter]);

  const handleVote = async (photoId: string) => {
    if (!userId) {
      window.location.href = '/login?redirect=/photos';
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

  const totalVotes = photos.reduce((sum, p) => sum + p.vote_count, 0);
  const winnersCount = photos.filter((p) => p.status === 'winner').length;
  const photographersCount = new Set(photos.map((p) => p.user_id)).size;

  return (
    <MobileWrapper>
      {/* Sky gradient header */}
      <div className="bg-gradient-to-br from-sky to-sky-dark px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Photos</h1>
            <p className="text-white/80 text-sm mt-1">
              Whitstable through your lens
            </p>
          </div>
          <Link href="/photos/submit">
            <Button
              size="sm"
              className="bg-white text-sky hover:bg-white/90"
              leftIcon={<Camera className="h-4 w-4" />}
            >
              Submit
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <ImageIcon className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{photos.length}</p>
            <p className="text-xs text-white/70">photos</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Trophy className="w-4 h-4 text-yellow/80 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{winnersCount}</p>
            <p className="text-xs text-white/70">winners</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Users className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{photographersCount}</p>
            <p className="text-xs text-white/70">locals</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Heart className="w-4 h-4 text-coral mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{totalVotes}</p>
            <p className="text-xs text-white/70">votes</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Competition Banner */}
        {competition && (
          <div className="mb-4">
            <CompetitionBanner competition={competition} variant="full" />
          </div>
        )}

        {/* Quick links */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <Link href="/photos/competition">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Calendar className="h-4 w-4" />}
              className="whitespace-nowrap"
            >
              Competition
            </Button>
          </Link>
          <Link href="/photos/winners">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trophy className="h-4 w-4" />}
              className="whitespace-nowrap"
            >
              Past Winners
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink section-title">Gallery</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-oyster-400" />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              options={[
                { value: 'recent', label: 'Recent' },
                { value: 'popular', label: 'Popular' },
                { value: 'winners', label: 'Winners' },
                { value: 'all', label: 'All' },
              ]}
              className="w-28 text-sm"
            />
          </div>
        </div>

        {/* Photo Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-oyster-200 aspect-[4/3] rounded-xl" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 bg-oyster-200 rounded w-3/4" />
                  <div className="h-2.5 bg-oyster-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            userVotes={userVotes}
            onVote={handleVote}
            isVoting={isVoting}
            showVoteButton={true}
            emptyMessage="No photos yet. Be the first to share!"
          />
        )}
      </div>
    </MobileWrapper>
  );
}
