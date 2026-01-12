import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Heart, Calendar } from 'lucide-react';
import { Card, Avatar, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { PhotoEntryWithUser, PhotoCompetition } from '@/types/database';

interface WinnerCardProps {
  photo: PhotoEntryWithUser;
  competition?: PhotoCompetition;
  variant?: 'featured' | 'compact';
}

export function WinnerCard({
  photo,
  competition,
  variant = 'featured',
}: WinnerCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/photos/${photo.id}`}>
        <Card hoverable className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={photo.image_url}
              alt={photo.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="warning" size="sm" className="mb-1">
              <Trophy className="h-3 w-3 mr-1" />
              Winner
            </Badge>
            <h3 className="font-medium text-oyster-900 truncate">{photo.title}</h3>
            <p className="text-sm text-oyster-600 truncate">
              by {photo.profiles?.display_name || 'Anonymous'}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-oyster-500">
              <Heart className="h-3 w-3" />
              {photo.vote_count} votes
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={photo.image_url}
          alt={photo.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge variant="warning" className="mb-2">
            <Trophy className="h-3 w-3 mr-1" />
            Photo of the Month
          </Badge>
          <h3 className="text-xl font-bold mb-1">{photo.title}</h3>
          <div className="flex items-center gap-3">
            <Avatar
              src={photo.profiles?.avatar_url}
              fallback={photo.profiles?.display_name || 'U'}
              size="sm"
            />
            <span>{photo.profiles?.display_name || 'Anonymous'}</span>
          </div>
        </div>
      </div>
      {competition && (
        <div className="p-4 flex items-center justify-between text-sm">
          <span className="text-oyster-600">
            {competition.title}
          </span>
          <span className="flex items-center gap-1 text-oyster-500">
            <Heart className="h-4 w-4" />
            {photo.vote_count} votes
          </span>
        </div>
      )}
      <div className="px-4 pb-4">
        <Link
          href={`/photos/${photo.id}`}
          className="text-ocean-600 hover:text-ocean-700 text-sm font-medium"
        >
          View winning photo →
        </Link>
      </div>
    </Card>
  );
}
