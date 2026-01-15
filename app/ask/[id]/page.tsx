'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, MessageCircle, Clock, Eye, Share2, Flag, Send, CheckCircle } from 'lucide-react';
import { Button, Card, Avatar, Textarea } from '@/components/ui';
import { AnswerCard } from '@/components/questions';
import { formatRelativeTime, pluralize } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Question, Answer, Profile } from '@/types/database';

type QuestionWithProfile = Question & {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null;
};

type AnswerWithProfile = Answer & {
  profiles: Pick<Profile, 'display_name' | 'avatar_url' | 'is_local'> | null;
};

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = params.id as string;
  const isNewQuestion = searchParams.get('new') === 'true';

  const [question, setQuestion] = useState<QuestionWithProfile | null>(null);
  const [answers, setAnswers] = useState<AnswerWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());
  const [showNewQuestionBanner, setShowNewQuestionBanner] = useState(isNewQuestion);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);

        // Fetch question with answers from API
        const res = await fetch(`/api/questions/${questionId}`);
        if (!res.ok) {
          setQuestion(null);
          return;
        }

        const data = await res.json();
        setQuestion(data);
        setAnswers(data.answers || []);

        // Fetch user's upvotes if logged in
        if (user) {
          const { data: upvotes } = await supabase
            .from('answer_votes')
            .select('answer_id')
            .eq('user_id', user.id);

          if (upvotes) {
            setUserUpvotes(new Set(upvotes.map((v: { answer_id: string }) => v.answer_id)));
          }
        }

        // Increment view count (fire-and-forget)
        supabase.rpc('increment_view_count', { question_id: questionId }).then(() => {});
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [questionId]);

  const handleShare = () => {
    if (navigator.share && question) {
      navigator.share({
        title: question.question,
        text: `Check out this question about Whitstable: ${question.question}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      router.push(`/auth/login?redirect=/ask/${questionId}`);
      return;
    }

    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: newAnswer.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswers((prev) => [...prev, data]);
        setNewAnswer('');

        // Update question answer count
        if (question) {
          setQuestion({ ...question, answer_count: question.answer_count + 1 });
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (answerId: string) => {
    if (!userId) {
      router.push(`/auth/login?redirect=/ask/${questionId}`);
      return;
    }

    const supabase = createClient();
    const hasUpvoted = userUpvotes.has(answerId);

    try {
      if (hasUpvoted) {
        await supabase
          .from('answer_votes')
          .delete()
          .eq('answer_id', answerId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('answer_votes')
          .insert({ answer_id: answerId, user_id: userId });
      }

      // Update local state
      const newUpvotes = new Set(userUpvotes);
      if (hasUpvoted) {
        newUpvotes.delete(answerId);
      } else {
        newUpvotes.add(answerId);
      }
      setUserUpvotes(newUpvotes);

      // Update answer upvote count
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === answerId
            ? { ...a, upvotes: a.upvotes + (hasUpvoted ? -1 : 1) }
            : a
        )
      );
    } catch (error) {
      console.error('Upvote error:', error);
    }
  };

  const handleAccept = async (answerId: string) => {
    if (!userId || userId !== question?.user_id) return;

    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer_id: answerId, action: 'accept' }),
      });

      if (res.ok) {
        // Update local state
        setAnswers((prev) =>
          prev.map((a) => ({
            ...a,
            is_accepted: a.id === answerId,
          }))
        );

        // Update question status
        if (question) {
          setQuestion({ ...question, status: 'answered' });
        }
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-oyster-200 rounded mb-6" />
          <Card className="mb-8">
            <div className="h-6 bg-oyster-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-oyster-200 rounded w-1/2 mb-6" />
            <div className="h-3 bg-oyster-200 rounded w-1/4" />
          </Card>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <div className="h-4 bg-oyster-200 rounded w-full mb-2" />
                <div className="h-4 bg-oyster-200 rounded w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-oyster-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-oyster-900 mb-2">Question not found</h1>
          <p className="text-oyster-600 mb-4">This question may have been removed or doesn&apos;t exist.</p>
          <Link href="/ask">
            <Button>Back to Questions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isQuestionOwner = userId === question.user_id;
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.is_accepted) return -1;
    if (b.is_accepted) return 1;
    return b.upvotes - a.upvotes;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* New Question Banner */}
      {showNewQuestionBanner && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800">Your question has been posted! Locals will start answering soon.</p>
            </div>
            <button
              onClick={() => setShowNewQuestionBanner(false)}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/ask">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Questions
          </Button>
        </Link>
      </div>

      {/* Question */}
      <Card className="mb-8">
        <h1 className="text-2xl font-bold text-oyster-900 mb-4">{question.question}</h1>

        {question.context && <p className="text-oyster-600 mb-6">{question.context}</p>}

        <div className="flex flex-wrap items-center gap-4 text-sm text-oyster-500 mb-6">
          <div className="flex items-center gap-2">
            <Avatar
              src={question.profiles?.avatar_url}
              fallback={question.profiles?.display_name || 'U'}
              size="sm"
            />
            <span>{question.profiles?.display_name || 'Anonymous'}</span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatRelativeTime(question.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {question.view_count} views
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {pluralize(question.answer_count, 'answer')}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="h-4 w-4" />}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Flag className="h-4 w-4" />}>
            Report
          </Button>
        </div>
      </Card>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-oyster-900 mb-4">
          {pluralize(answers.length, 'Answer')}
        </h2>
        {answers.length === 0 ? (
          <Card className="text-center py-8">
            <MessageCircle className="h-10 w-10 text-oyster-300 mx-auto mb-3" />
            <p className="text-oyster-600">No answers yet. Be the first to help!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                isQuestionOwner={isQuestionOwner}
                onAccept={() => handleAccept(answer.id)}
                onUpvote={() => handleUpvote(answer.id)}
                hasUpvoted={userUpvotes.has(answer.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Answer Form */}
      <Card>
        <h2 className="font-semibold text-oyster-900 mb-4">Your Answer</h2>
        <form onSubmit={handleSubmitAnswer}>
          <Textarea
            placeholder="Share your knowledge about Whitstable..."
            rows={4}
            className="mb-4"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-oyster-500">
              Be helpful and specific. Great answers earn you community points!
            </p>
            <Button
              type="submit"
              leftIcon={<Send className="h-4 w-4" />}
              isLoading={isSubmitting}
              disabled={!newAnswer.trim()}
            >
              Post Answer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
