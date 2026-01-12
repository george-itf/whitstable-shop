'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Heart, MapPin, Store, Calendar, Camera, Share2, Flag } from 'lucide-react';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import { VoteButton } from '@/components/photos';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { PhotoEntryWithUser } from '@/types/database';

export default function PhotoDetailPage() {
  const params = useParams();
  const photoId = params.id as string;

  const [photo, setPhoto] = useState<PhotoEntryWithUser | null>(null);
  const [relatedPhotos, setRelatedPhotos] = useState<PhotoEntryWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhoto() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);

        // Fetch photo from API
        const res = await fetch(`/api/photos/${photoId}`);
        if (!res.ok) {
          setPhoto(null);
          return;
        }

        const photoData = await res.json();
        setPhoto(photoData);
        setVoteCount(photoData.vote_count);

        // Check if user has voted
        if (user) {
          const { data: vote } = await supabase
            .from('photo_votes')
            .select('id')
            .eq('photo_id', photoId)
            .eq('user_id', user.id)
            .single();

          setHasVoted(!!vote);
        }

        // Fetch related photos from same competition month
        if (photoData.competition_month) {
          const { data: related } = await supabase
            .from('photo_entries')
            .select(`
              *,
              profiles:user_id(display_name, avatar_url),
              shops:shop_id(name, slug)
            `)
            .eq('status', 'approved')
            .eq('competition_month', photoData.competition_month)
            .neq('id', photoId)
            .order('vote_count', { ascending: false })
            .limit(3);

          setRelatedPhotos(related || []);
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhoto();
  }, [photoId]);

  const handleVote = async () => {
    if (!userId) {
      window.location.href = `/login?redirect=/photos/${photoId}`;
      return;
    }

    setIsVoting(true);
    try {
      const res = await fetch(`/api/photos/${photoId}/vote`, {
        method: hasVoted ? 'DELETE' : 'POST',
      });

      if (res.ok) {
        setHasVoted(!hasVoted);
        setVoteCount((prev) => prev + (hasVoted ? -1 : 1));
      }
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && photo) {
      navigator.share({
        title: photo.title,
        text: `Check out this photo from Whitstable: ${photo.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-oyster-200 rounded mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-[4/3] bg-oyster-200 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-oyster-200 rounded w-3/4" />
              <div className="h-24 bg-oyster-200 rounded" />
              <div className="h-32 bg-oyster-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-oyster-900 mb-2">Photo not found</h1>
          <p className="text-oyster-600 mb-4">This photo may have been removed or doesn&apos;t exist.</p>
          <Link href="/photos">
            <Button>Back to Gallery</Button>
          </Link>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Image */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] bg-oyster-900 rounded-2xl overflow-hidden">
            <Image
              src={photo.image_url}
              alt={photo.title}
              fill
              className="object-contain"
              priority
            />

            {/* Status Badge */}
            {photo.status === 'winner' && (
              <Badge variant="warning" className="absolute top-4 left-4">
                Winner
              </Badge>
            )}
            {photo.status === 'runner_up' && (
              <Badge variant="info" className="absolute top-4 left-4">
                Runner Up
              </Badge>
            )}
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          {/* Title & Vote */}
          <div>
            <h1 className="text-2xl font-bold text-oyster-900 mb-4">{photo.title}</h1>
            <VoteButton
              voteCount={voteCount}
              hasVoted={hasVoted}
              onVote={handleVote}
              isLoading={isVoting}
              size="lg"
            />
          </div>

          {/* Author */}
          <Card>
            <div className="flex items-center gap-3">
              <Avatar
                src={photo.profiles?.avatar_url}
                fallback={photo.profiles?.display_name || 'U'}
                size="lg"
              />
              <div>
                <p className="font-semibold text-oyster-900">
                  {photo.profiles?.display_name || 'Anonymous'}
                </p>
                <p className="text-sm text-oyster-500">{formatRelativeTime(photo.created_at)}</p>
              </div>
            </div>
          </Card>

          {/* Description */}
          {photo.description && (
            <Card>
              <h2 className="font-semibold text-oyster-900 mb-2">About this photo</h2>
              <p className="text-oyster-600">{photo.description}</p>
            </Card>
          )}

          {/* Details */}
          <Card>
            <h2 className="font-semibold text-oyster-900 mb-3">Details</h2>
            <div className="space-y-3">
              {photo.location && (
                <div className="flex items-center gap-3 text-oyster-600">
                  <MapPin className="h-5 w-5 text-oyster-400" />
                  <span>{photo.location}</span>
                </div>
              )}
              {photo.shops && (
                <div className="flex items-center gap-3 text-oyster-600">
                  <Store className="h-5 w-5 text-oyster-400" />
                  <Link
                    href={`/shops/${photo.shops.slug}`}
                    className="text-ocean-600 hover:underline"
                  >
                    {photo.shops.name}
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-3 text-oyster-600">
                <Calendar className="h-5 w-5 text-oyster-400" />
                <span>{formatDate(photo.created_at, 'dd MMMM yyyy')}</span>
              </div>
              {photo.camera_info && (
                <div className="flex items-center gap-3 text-oyster-600">
                  <Camera className="h-5 w-5 text-oyster-400" />
                  <span>{photo.camera_info}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              leftIcon={<Share2 className="h-4 w-4" />}
              onClick={handleShare}
            >
              Share
            </Button>
            <Button variant="ghost" leftIcon={<Flag className="h-4 w-4" />}>
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* More from this competition */}
      {relatedPhotos.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-oyster-900">More from this month</h2>
            <Link
              href="/photos/competition"
              className="text-ocean-600 hover:text-ocean-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPhotos.map((relatedPhoto) => (
              <Link key={relatedPhoto.id} href={`/photos/${relatedPhoto.id}`}>
                <Card hoverable padding="none" className="overflow-hidden">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={relatedPhoto.image_url}
                      alt={relatedPhoto.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-oyster-900 truncate">{relatedPhoto.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-oyster-500">
                        {relatedPhoto.profiles?.display_name}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-oyster-500">
                        <Heart className="h-4 w-4" />
                        {relatedPhoto.vote_count}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
