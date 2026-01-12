import Link from 'next/link';
import { MessageCircle, CheckCircle, Clock, ThumbsUp } from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import type { Question, Profile } from '@/types/database';

interface QuestionCardProps {
  question: Question & { profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null };
  variant?: 'default' | 'compact';
}

export function QuestionCard({ question, variant = 'default' }: QuestionCardProps) {
  const hasAnswers = question.answer_count > 0;
  const isAnswered = question.status === 'answered' || question.status === 'closed';

  if (variant === 'compact') {
    return (
      <Link href={`/ask/${question.id}`}>
        <div className="py-3 hover:bg-oyster-50 transition-colors -mx-4 px-4 rounded-lg">
          <p className="font-medium text-oyster-900 line-clamp-1 mb-1">
            {question.question}
          </p>
          <div className="flex items-center gap-3 text-sm text-oyster-500">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {question.answer_count}
            </span>
            <span>{formatRelativeTime(question.created_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/ask/${question.id}`}>
      <Card hoverable>
        <div className="flex gap-4">
          {/* Stats Column */}
          <div className="hidden sm:flex flex-col items-center gap-2 text-center min-w-[60px]">
            <div className={`${hasAnswers ? 'text-green-600' : 'text-oyster-400'}`}>
              <MessageCircle className="h-6 w-6 mx-auto" />
              <p className="text-sm font-medium mt-1">{question.answer_count}</p>
              <p className="text-xs">answers</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="font-semibold text-oyster-900 line-clamp-2 flex-1">
                {question.question}
              </h3>
              {isAnswered && (
                <Badge variant="success" size="sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Answered
                </Badge>
              )}
            </div>

            {question.context && (
              <p className="text-sm text-oyster-600 line-clamp-2 mb-3">
                {question.context}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={question.profiles?.avatar_url}
                  fallback={question.profiles?.display_name || 'U'}
                  size="sm"
                />
                <span className="text-sm text-oyster-600">
                  {question.profiles?.display_name || 'Anonymous'}
                </span>
              </div>
              <span className="text-sm text-oyster-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatRelativeTime(question.created_at)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
