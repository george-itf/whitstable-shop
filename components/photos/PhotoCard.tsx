'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Store } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Badge, Avatar } from '@/components/ui';
import type { PhotoEntryWithUser } from '@/types/database';

interface PhotoCardProps {
  photo: PhotoEntryWithUser;
  onVote?: (photoId: string) => void;
  hasVoted?: boolean;
  isVoting?: boolean;
  showVoteButton?: boolean;
}

export function PhotoCard({
  photo,
  onVote,
  hasVoted = false,
  isVoting = false,
  showVoteButton = true,
}: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleVoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isVoting && onVote) {
      onVote(photo.id);
    }
  };

  return (
    <Link href={`/photos/${photo.id}`} className="block group">
      <div className="relative bg-oyster-100 rounded-xl overflow-hidden">
        {/* Image Container */}
        <div className="aspect-[4/3] relative">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-oyster-200" />
          )}
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              'group-hover:scale-105'
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Status Badge */}
          {photo.status === 'winner' && (
            <Badge
              variant="warning"
              className="absolute top-3 left-3"
            >
              Winner
            </Badge>
          )}
          {photo.status === 'runner_up' && (
            <Badge
              variant="info"
              className="absolute top-3 left-3"
            >
              Runner Up
            </Badge>
          )}

          {/* Vote Button */}
          {showVoteButton && (
            <button
              onClick={handleVoteClick}
              disabled={isVoting}
              className={cn(
                'absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'transition-all duration-200',
                'backdrop-blur-sm',
                hasVoted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-oyster-700 hover:bg-white',
                isVoting && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Heart
                className={cn('h-4 w-4', hasVoted && 'fill-current')}
              />
              <span className="text-sm font-medium">{photo.vote_count}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-oyster-900 truncate group-hover:text-ocean-600 transition-colors">
            {photo.title}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <Avatar
              src={photo.profiles?.avatar_url}
              fallback={photo.profiles?.display_name || 'U'}
              size="sm"
            />
            <span className="text-sm text-oyster-600 truncate">
              {photo.profiles?.display_name || 'Anonymous'}
            </span>
          </div>

          {(photo.location || photo.shops) && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-oyster-500">
              {photo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {photo.location}
                </span>
              )}
              {photo.shops && (
                <span className="flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  {photo.shops.name}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
