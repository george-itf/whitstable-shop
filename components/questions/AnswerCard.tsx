'use client';

import { ThumbsUp, CheckCircle, Shield } from 'lucide-react';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { Answer, Profile } from '@/types/database';

interface AnswerCardProps {
  answer: Answer & {
    profiles?: Pick<Profile, 'display_name' | 'avatar_url' | 'is_local'> | null;
  };
  isQuestionOwner?: boolean;
  onAccept?: () => void;
  onUpvote?: () => void;
  hasUpvoted?: boolean;
}

export function AnswerCard({
  answer,
  isQuestionOwner = false,
  onAccept,
  onUpvote,
  hasUpvoted = false,
}: AnswerCardProps) {
  return (
    <Card
      className={cn(
        answer.is_accepted && 'border-green-300 bg-green-50'
      )}
    >
      <div className="flex gap-4">
        {/* Vote Column */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onUpvote}
            className={cn(
              'p-2 rounded-lg transition-colors',
              hasUpvoted
                ? 'text-ocean-600 bg-ocean-100'
                : 'text-oyster-400 hover:text-ocean-600 hover:bg-ocean-50'
            )}
          >
            <ThumbsUp className={cn('h-5 w-5', hasUpvoted && 'fill-current')} />
          </button>
          <span className="font-medium text-oyster-900">{answer.upvotes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {answer.is_accepted && (
            <Badge variant="success" className="mb-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Accepted Answer
            </Badge>
          )}

          <p className="text-oyster-700 whitespace-pre-wrap mb-4">
            {answer.answer}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={answer.profiles?.avatar_url}
                fallback={answer.profiles?.display_name || 'U'}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-oyster-900">
                  {answer.profiles?.display_name || 'Anonymous'}
                </span>
                {answer.profiles?.is_local && (
                  <Badge variant="info" size="sm">
                    <Shield className="h-3 w-3 mr-1" />
                    Local
                  </Badge>
                )}
              </div>
              <span className="text-sm text-oyster-500">
                {formatRelativeTime(answer.created_at)}
              </span>
            </div>

            {isQuestionOwner && !answer.is_accepted && (
              <Button
                size="sm"
                variant="outline"
                onClick={onAccept}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Accept
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
