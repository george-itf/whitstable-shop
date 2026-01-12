'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, Filter, MessageCircle, Users, Clock, Sparkles } from 'lucide-react';
import { Button, Select, Card, Badge, EmptyState } from '@/components/ui';
import { QuestionCard, AskQuestionForm } from '@/components/questions';
import { createClient } from '@/lib/supabase/client';
import type { Question, Profile } from '@/types/database';

type QuestionWithProfile = Question & {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null;
};

export default function AskPage() {
  const [questions, setQuestions] = useState<QuestionWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'unanswered' | 'popular'>('recent');
  const [showAskForm, setShowAskForm] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/questions?sort=${filter}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [filter]);

  // Stats
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(
    (q) => q.status === 'answered' || q.status === 'closed'
  ).length;
  const unansweredQuestions = questions.filter((q) => q.answer_count === 0).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Ask a Local</h1>
          <p className="text-oyster-600 mt-1">
            Get insider tips and answers from Whitstable locals
          </p>
        </div>
        <Button
          leftIcon={<HelpCircle className="h-4 w-4" />}
          onClick={() => setShowAskForm(!showAskForm)}
        >
          {showAskForm ? 'Cancel' : 'Ask a Question'}
        </Button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <Card className="mb-8 border-ocean-200 bg-ocean-50/50">
          <h2 className="text-lg font-semibold text-oyster-900 mb-4">Ask the Community</h2>
          <AskQuestionForm />
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <MessageCircle className="h-5 w-5 text-ocean-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">{totalQuestions}</p>
          <p className="text-sm text-oyster-500">Questions</p>
        </Card>
        <Card className="text-center">
          <Sparkles className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">{answeredQuestions}</p>
          <p className="text-sm text-oyster-500">Answered</p>
        </Card>
        <Card className="text-center">
          <Clock className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-oyster-900">{unansweredQuestions}</p>
          <p className="text-sm text-oyster-500">Need Answers</p>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="mb-8 bg-gradient-to-r from-oyster-50 to-oyster-100 border-oyster-200">
        <h3 className="font-semibold text-oyster-900 mb-3">How Ask a Local Works</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              1
            </div>
            <p className="text-oyster-600">Ask any question about Whitstable - restaurants, activities, hidden gems</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              2
            </div>
            <p className="text-oyster-600">Locals and regular visitors share their knowledge and tips</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              3
            </div>
            <p className="text-oyster-600">Upvote helpful answers and accept the best one</p>
          </div>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-oyster-900">Recent Questions</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-oyster-500" />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            options={[
              { value: 'recent', label: 'Most Recent' },
              { value: 'unanswered', label: 'Unanswered' },
              { value: 'popular', label: 'Most Popular' },
            ]}
            className="w-36"
          />
        </div>
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex gap-4">
                <div className="hidden sm:block w-[60px]">
                  <div className="h-16 bg-oyster-200 rounded" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-oyster-200 rounded w-3/4" />
                  <div className="h-4 bg-oyster-200 rounded w-1/2" />
                  <div className="h-3 bg-oyster-200 rounded w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No questions yet"
          description="Be the first to ask a question about Whitstable!"
          action={{
            label: 'Ask a Question',
            onClick: () => setShowAskForm(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}

      {/* Popular Topics */}
      {questions.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-oyster-900 mb-4">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Restaurants',
              'Fish & Chips',
              'Parking',
              'Beach',
              'Oysters',
              'Day Trips',
              'Family Activities',
              'Dog-Friendly',
              'Pubs',
              'Shopping',
            ].map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="cursor-pointer hover:bg-ocean-50 hover:border-ocean-300"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
