'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Filter, MessageCircle, Clock, CheckCircle, Users } from 'lucide-react';
import { Button, Select, Card, Badge, EmptyState } from '@/components/ui';
import { QuestionCard, AskQuestionForm } from '@/components/questions';
import MobileWrapper from '@/components/layout/MobileWrapper';
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
    <MobileWrapper>
      {/* Sky gradient header */}
      <div className="bg-gradient-to-br from-sky to-sky-dark px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Ask a Local</h1>
            <p className="text-white/80 text-sm mt-1">
              Insider tips from Whitstable locals
            </p>
          </div>
          <Button
            size="sm"
            className="bg-white text-sky hover:bg-white/90"
            leftIcon={<HelpCircle className="h-4 w-4" />}
            onClick={() => setShowAskForm(!showAskForm)}
          >
            Ask
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <MessageCircle className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{totalQuestions}</p>
            <p className="text-xs text-white/70">questions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <CheckCircle className="w-4 h-4 text-green mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{answeredQuestions}</p>
            <p className="text-xs text-white/70">answered</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-yellow mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{unansweredQuestions}</p>
            <p className="text-xs text-white/70">waiting</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Ask Question Form */}
        {showAskForm && (
          <Card className="mb-4 border-sky/20 bg-sky-light/30">
            <h2 className="text-base font-semibold text-ink mb-3">Ask the Community</h2>
            <AskQuestionForm />
          </Card>
        )}

        {/* How it Works */}
        <div className="bg-sand-100 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-ink text-sm mb-3">How it works</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-sky rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                1
              </div>
              <p className="text-xs text-oyster-600">Ask about restaurants, activities, or hidden gems</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-sky rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                2
              </div>
              <p className="text-xs text-oyster-600">Locals share their knowledge and tips</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-sky rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                3
              </div>
              <p className="text-xs text-oyster-600">Upvote helpful answers</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink section-title">Questions</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-oyster-400" />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              options={[
                { value: 'recent', label: 'Recent' },
                { value: 'unanswered', label: 'Unanswered' },
                { value: 'popular', label: 'Popular' },
              ]}
              className="w-28 text-sm"
            />
          </div>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-oyster-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-oyster-200 rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-oyster-200 rounded w-16" />
                  <div className="h-6 bg-oyster-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No questions yet"
            description="Be the first to ask about Whitstable!"
            action={{
              label: 'Ask a Question',
              onClick: () => setShowAskForm(true),
            }}
            variant="card"
          />
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <QuestionCard question={question} />
              </div>
            ))}
          </div>
        )}

        {/* Popular Topics */}
        {questions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-ink text-sm mb-3 section-title">Popular Topics</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Oysters',
                'Fish & Chips',
                'Parking',
                'Beach',
                'Pubs',
                'Dog-Friendly',
                'Family',
                'Day Trips',
              ].map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="cursor-pointer hover:bg-sky-light hover:border-sky hover:text-sky transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileWrapper>
  );
}
