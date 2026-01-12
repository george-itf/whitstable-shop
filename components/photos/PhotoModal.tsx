'use client';

import Image from 'next/image';
import { Heart, MapPin, Store, Calendar, Camera, X } from 'lucide-react';
import { Modal, Avatar, Badge, Button } from '@/components/ui';
import { formatDate, formatRelativeTime, cn } from '@/lib/utils';
import type { PhotoEntryWithUser } from '@/types/database';

interface PhotoModalProps {
  photo: PhotoEntryWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (photoId: string) => void;
  hasVoted?: boolean;
  isVoting?: boolean;
}

export function PhotoModal({
  photo,
  isOpen,
  onClose,
  onVote,
  hasVoted = false,
  isVoting = false,
}: PhotoModalProps) {
  if (!photo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="flex flex-col lg:flex-row gap-6 -m-4">
        {/* Image */}
        <div className="relative flex-1 min-h-[300px] lg:min-h-[500px] bg-oyster-900 rounded-l-xl overflow-hidden">
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        {/* Details */}
        <div className="lg:w-80 p-4 lg:p-0 lg:pr-4 flex flex-col">
          {/* Status */}
          {photo.status === 'winner' && (
            <Badge variant="warning" className="self-start mb-2">
              Winner
            </Badge>
          )}
          {photo.status === 'runner_up' && (
            <Badge variant="info" className="self-start mb-2">
              Runner Up
            </Badge>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold text-oyster-900 mb-2">
            {photo.title}
          </h2>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              src={photo.profiles?.avatar_url}
              fallback={photo.profiles?.display_name || 'U'}
              size="md"
            />
            <div>
              <p className="font-medium text-oyster-900">
                {photo.profiles?.display_name || 'Anonymous'}
              </p>
              <p className="text-sm text-oyster-500">
                {formatRelativeTime(photo.created_at)}
              </p>
            </div>
          </div>

          {/* Description */}
          {photo.description && (
            <p className="text-oyster-600 mb-4">{photo.description}</p>
          )}

          {/* Metadata */}
          <div className="space-y-2 mb-6">
            {photo.location && (
              <div className="flex items-center gap-2 text-sm text-oyster-600">
                <MapPin className="h-4 w-4" />
                {photo.location}
              </div>
            )}
            {photo.shops && (
              <div className="flex items-center gap-2 text-sm text-oyster-600">
                <Store className="h-4 w-4" />
                {photo.shops.name}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-oyster-600">
              <Calendar className="h-4 w-4" />
              {formatDate(photo.created_at, 'dd MMMM yyyy')}
            </div>
            {photo.camera_info && (
              <div className="flex items-center gap-2 text-sm text-oyster-600">
                <Camera className="h-4 w-4" />
                {photo.camera_info}
              </div>
            )}
          </div>

          {/* Vote Button */}
          <div className="mt-auto pt-4 border-t border-oyster-200">
            <Button
              onClick={() => onVote?.(photo.id)}
              disabled={isVoting}
              variant={hasVoted ? 'primary' : 'outline'}
              className="w-full"
              leftIcon={
                <Heart className={cn('h-4 w-4', hasVoted && 'fill-current')} />
              }
            >
              {hasVoted ? 'Voted' : 'Vote for this photo'} ({photo.vote_count})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
