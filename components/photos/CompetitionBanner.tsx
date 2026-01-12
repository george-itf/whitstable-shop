import Link from 'next/link';
import { Camera, Award, Clock } from 'lucide-react';
import { Card, Button, Countdown, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { PhotoCompetition } from '@/types/database';

interface CompetitionBannerProps {
  competition: PhotoCompetition | null;
  variant?: 'full' | 'compact';
}

export function CompetitionBanner({
  competition,
  variant = 'full',
}: CompetitionBannerProps) {
  if (!competition) {
    return null;
  }

  const isSubmissionsOpen = competition.status === 'submissions';
  const isVotingOpen = competition.status === 'voting';
  const deadline = isSubmissionsOpen
    ? competition.submissions_close
    : isVotingOpen
    ? competition.voting_close
    : null;

  if (variant === 'compact') {
    return (
      <Card className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white border-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              {isSubmissionsOpen ? (
                <Camera className="h-5 w-5" />
              ) : (
                <Award className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{competition.title}</p>
              <p className="text-ocean-100 text-xs">
                {isSubmissionsOpen
                  ? 'Submissions open'
                  : isVotingOpen
                  ? 'Vote now'
                  : competition.status}
              </p>
            </div>
          </div>
          <Link href="/photos/competition">
            <Button size="sm" variant="secondary">
              {isSubmissionsOpen ? 'Submit' : 'View'}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-700 text-white border-0 overflow-hidden">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge variant="outline" className="border-white/30 text-white mb-2">
                {isSubmissionsOpen
                  ? 'Submissions Open'
                  : isVotingOpen
                  ? 'Voting Open'
                  : competition.status}
              </Badge>
              <h2 className="text-2xl font-bold">{competition.title}</h2>
              {competition.theme && (
                <p className="text-ocean-100 mt-1">Theme: {competition.theme}</p>
              )}
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Camera className="h-8 w-8" />
            </div>
          </div>

          {/* Prize */}
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-ocean-100 mb-1">Prize</p>
            <p className="font-semibold">{competition.prize_description}</p>
            {competition.prize_value && (
              <p className="text-sm text-ocean-200">
                Value: {competition.prize_value}
              </p>
            )}
          </div>

          {/* Countdown & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {deadline && (
              <div>
                <p className="text-sm text-ocean-100 mb-2 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {isSubmissionsOpen ? 'Submit by' : 'Vote by'}
                </p>
                <Countdown
                  targetDate={deadline}
                  variant="default"
                />
              </div>
            )}

            <div className="flex gap-2">
              {isSubmissionsOpen && (
                <Link href="/photos/submit">
                  <Button variant="secondary" leftIcon={<Camera className="h-4 w-4" />}>
                    Submit Your Photo
                  </Button>
                </Link>
              )}
              <Link href="/photos/competition">
                <Button
                  variant={isSubmissionsOpen ? 'ghost' : 'secondary'}
                  className={isSubmissionsOpen ? 'text-white hover:bg-white/10' : ''}
                >
                  View Entries
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
