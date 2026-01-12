import Link from "next/link";
import { ChevronLeft, MessageCircle, Clock, Eye, Share2, Flag } from "lucide-react";
import { Button, Card, Avatar, Badge, Textarea } from "@/components/ui";
import { AnswerCard } from "@/components/questions";
import { formatRelativeTime, pluralize } from "@/lib/utils";
import type { Question, Answer, Profile } from "@/types/database";

// Mock data
const mockQuestion: Question & { profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null } = {
  id: "1",
  user_id: "user1",
  question: "Best fish and chips near the harbour?",
  context: "Visiting for a day trip and want to try the local fish and chips. Looking for somewhere with outdoor seating if possible! We'll be there around lunchtime on a Saturday.",
  status: "answered",
  answer_count: 5,
  view_count: 234,
  created_at: "2025-01-10T12:00:00Z",
  profiles: { display_name: "Day Tripper", avatar_url: null },
};

const mockAnswers: (Answer & { profiles: Pick<Profile, 'display_name' | 'avatar_url' | 'is_local'> | null })[] = [
  {
    id: "1",
    question_id: "1",
    user_id: "user2",
    answer: "The Whitstable Fish Market is a local favourite! It's right on the harbour and they have great outdoor seating overlooking the boats. Their cod and chips is excellent, and they use locally caught fish when available.\n\nOn a Saturday lunchtime it can get busy, so I'd recommend arriving before 12:30 or being prepared for a short wait. Worth it though!",
    upvotes: 12,
    is_accepted: true,
    created_at: "2025-01-10T14:30:00Z",
    profiles: { display_name: "Local Foodie", avatar_url: null, is_local: true },
  },
  {
    id: "2",
    question_id: "1",
    user_id: "user3",
    answer: "I'd also recommend VC Jones - it's a traditional chippy that's been here for years. No frills but consistently good fish and chips. They don't have outdoor seating but there are benches nearby where you can eat overlooking the sea.",
    upvotes: 8,
    is_accepted: false,
    created_at: "2025-01-10T15:00:00Z",
    profiles: { display_name: "Chip Enthusiast", avatar_url: null, is_local: false },
  },
  {
    id: "3",
    question_id: "1",
    user_id: "user4",
    answer: "For outdoor seating, The Old Neptune has a great spot right on the beach. They do fish and chips and you can eat outside with a lovely view. Gets busy on sunny days!",
    upvotes: 6,
    is_accepted: false,
    created_at: "2025-01-10T16:15:00Z",
    profiles: { display_name: "Beach Lover", avatar_url: null, is_local: true },
  },
  {
    id: "4",
    question_id: "1",
    user_id: "user5",
    answer: "Samphire is brilliant if you want something a bit more upmarket. They do amazing fish dishes and have outdoor seating in their courtyard. Not traditional fish and chips but definitely worth considering!",
    upvotes: 4,
    is_accepted: false,
    created_at: "2025-01-10T18:00:00Z",
    profiles: { display_name: "Fine Diner", avatar_url: null, is_local: false },
  },
  {
    id: "5",
    question_id: "1",
    user_id: "user6",
    answer: "If you're willing to walk a bit, The Sportsman in Seasalter has incredible fish. It's about 2 miles from Whitstable but considered one of the best gastropubs in the country. Book ahead!",
    upvotes: 3,
    is_accepted: false,
    created_at: "2025-01-11T09:30:00Z",
    profiles: { display_name: "Gastro Fan", avatar_url: null, is_local: true },
  },
];

export const metadata = {
  title: "Best fish and chips near the harbour?",
  description: "Community answers to your questions about Whitstable",
};

export default function QuestionDetailPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <h1 className="text-2xl font-bold text-oyster-900 mb-4">
          {mockQuestion.question}
        </h1>

        {mockQuestion.context && (
          <p className="text-oyster-600 mb-6">{mockQuestion.context}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-oyster-500 mb-6">
          <div className="flex items-center gap-2">
            <Avatar
              src={mockQuestion.profiles?.avatar_url}
              fallback={mockQuestion.profiles?.display_name || 'U'}
              size="sm"
            />
            <span>{mockQuestion.profiles?.display_name || 'Anonymous'}</span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatRelativeTime(mockQuestion.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {mockQuestion.view_count} views
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {pluralize(mockQuestion.answer_count, 'answer')}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
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
          {pluralize(mockAnswers.length, 'Answer')}
        </h2>
        <div className="space-y-4">
          {mockAnswers
            .sort((a, b) => {
              if (a.is_accepted) return -1;
              if (b.is_accepted) return 1;
              return b.upvotes - a.upvotes;
            })
            .map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
        </div>
      </div>

      {/* Add Answer Form */}
      <Card>
        <h2 className="font-semibold text-oyster-900 mb-4">Your Answer</h2>
        <Textarea
          placeholder="Share your knowledge about Whitstable..."
          rows={4}
          className="mb-4"
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-oyster-500">
            Be helpful and specific. Great answers earn you community points!
          </p>
          <Button leftIcon={<MessageCircle className="h-4 w-4" />}>
            Post Answer
          </Button>
        </div>
      </Card>
    </div>
  );
}
