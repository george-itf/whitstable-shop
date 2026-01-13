'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <Link href={`/photos/${photo.id}`} className="block group tap-effect">
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image Container */}
        <div className="aspect-[4/3] relative">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
              className="absolute top-2 left-2 text-xs"
            >
              Winner
            </Badge>
          )}
          {photo.status === 'runner_up' && (
            <Badge
              variant="info"
              className="absolute top-2 left-2 text-xs"
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
                'absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full',
                'transition-all duration-200',
                'backdrop-blur-sm text-xs',
                hasVoted
                  ? 'bg-coral text-white'
                  : 'bg-white/90 text-oyster-700 hover:bg-white',
                isVoting && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Heart
                className={cn('h-3.5 w-3.5', hasVoted && 'fill-current')}
              />
              <span className="font-medium">{photo.vote_count}</span>
            </button>
          )}
        </div>

        {/* Content - compact on mobile */}
        <div className="p-2.5">
          <h3 className="font-medium text-ink text-sm truncate group-hover:text-sky transition-colors">
            {photo.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5">
            <Avatar
              src={photo.profiles?.avatar_url}
              fallback={photo.profiles?.display_name || 'U'}
              size="xs"
            />
            <span className="text-xs text-oyster-500 truncate">
              {photo.profiles?.display_name || 'Anonymous'}
            </span>
          </div>

          {(photo.location || photo.shops) && (
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-oyster-400">
              {photo.location && (
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </span>
              )}
              {photo.shops && (
                <span className="flex items-center gap-0.5 truncate">
                  <Store className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">{photo.shops.name}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
