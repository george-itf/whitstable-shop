'use client';

import { PhotoCard } from './PhotoCard';
import { EmptyState } from '@/components/ui';
import { Camera } from 'lucide-react';
import type { PhotoEntryWithUser } from '@/types/database';

interface PhotoGridProps {
  photos: PhotoEntryWithUser[];
  userVotes?: Set<string>;
  onVote?: (photoId: string) => void;
  isVoting?: boolean;
  showVoteButton?: boolean;
  emptyMessage?: string;
}

export function PhotoGrid({
  photos,
  userVotes = new Set(),
  onVote,
  isVoting = false,
  showVoteButton = true,
  emptyMessage = 'No photos yet',
}: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title={emptyMessage}
        description="Be the first to submit a photo!"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PhotoCard
            photo={photo}
            hasVoted={userVotes.has(photo.id)}
            onVote={onVote}
            isVoting={isVoting}
            showVoteButton={showVoteButton}
          />
        </div>
      ))}
    </div>
  );
}
