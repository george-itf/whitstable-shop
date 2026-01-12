'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface VoteButtonProps {
  voteCount: number;
  hasVoted: boolean;
  onVote: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
}

export function VoteButton({
  voteCount,
  hasVoted,
  onVote,
  isLoading = false,
  size = 'md',
  variant = 'button',
}: VoteButtonProps) {
  if (variant === 'icon') {
    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <button
        onClick={onVote}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1.5 rounded-full transition-all',
          sizes[size],
          hasVoted
            ? 'text-red-500'
            : 'text-oyster-500 hover:text-red-500',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Heart
          className={cn(
            iconSizes[size],
            'transition-transform',
            hasVoted && 'fill-current scale-110'
          )}
        />
        <span className="text-sm font-medium">{voteCount}</span>
      </button>
    );
  }

  return (
    <Button
      onClick={onVote}
      isLoading={isLoading}
      variant={hasVoted ? 'primary' : 'outline'}
      size={size}
      leftIcon={
        <Heart
          className={cn('h-4 w-4', hasVoted && 'fill-current')}
        />
      }
    >
      {hasVoted ? 'Voted' : 'Vote'} ({voteCount})
    </Button>
  );
}
