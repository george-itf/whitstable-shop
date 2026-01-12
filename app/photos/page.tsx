'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Filter, Trophy, Calendar } from 'lucide-react';
import { Button, Select, Card } from '@/components/ui';
import { PhotoGrid, CompetitionBanner } from '@/components/photos';
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
            setUserVotes(new Set(votes.map((v) => v.photo_id)));
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
      // Redirect to login
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
        // Update local state
        const newVotes = new Set(userVotes);
        if (hasVoted) {
          newVotes.delete(photoId);
        } else {
          newVotes.add(photoId);
        }
        setUserVotes(newVotes);

        // Update photo vote count in list
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Photo Gallery</h1>
          <p className="text-oyster-600 mt-1">
            Beautiful photos of Whitstable shared by the community
          </p>
        </div>
        <Link href="/photos/submit">
          <Button leftIcon={<Camera className="h-4 w-4" />}>
            Submit Photo
          </Button>
        </Link>
      </div>

      {/* Competition Banner */}
      {competition && (
        <div className="mb-8">
          <CompetitionBanner competition={competition} variant="full" />
        </div>
      )}

      {/* Navigation & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <Link href="/photos/competition">
            <Button variant="outline" size="sm" leftIcon={<Calendar className="h-4 w-4" />}>
              Current Competition
            </Button>
          </Link>
          <Link href="/photos/winners">
            <Button variant="outline" size="sm" leftIcon={<Trophy className="h-4 w-4" />}>
              Past Winners
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-oyster-500" />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            options={[
              { value: 'recent', label: 'Most Recent' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'winners', label: 'Winners Only' },
              { value: 'all', label: 'All Photos' },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-2xl font-bold text-ocean-600">{photos.length}</p>
          <p className="text-sm text-oyster-500">Photos</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-ocean-600">
            {photos.filter((p) => p.status === 'winner').length}
          </p>
          <p className="text-sm text-oyster-500">Winners</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-ocean-600">
            {new Set(photos.map((p) => p.user_id)).size}
          </p>
          <p className="text-sm text-oyster-500">Photographers</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-ocean-600">
            {photos.reduce((sum, p) => sum + p.vote_count, 0)}
          </p>
          <p className="text-sm text-oyster-500">Total Votes</p>
        </Card>
      </div>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-oyster-200 aspect-[4/3] rounded-xl" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-oyster-200 rounded w-3/4" />
                <div className="h-3 bg-oyster-200 rounded w-1/2" />
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
  );
}
