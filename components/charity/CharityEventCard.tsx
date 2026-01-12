import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { CharityEvent } from '@/types/database';

interface CharityEventCardProps {
  event: CharityEvent & { charity_name?: string };
}

const eventTypeLabels: Record<string, { label: string; color: 'success' | 'info' | 'warning' | 'default' }> = {
  cleanup: { label: 'Beach Cleanup', color: 'success' },
  fundraiser: { label: 'Fundraiser', color: 'info' },
  volunteer: { label: 'Volunteer', color: 'warning' },
  awareness: { label: 'Awareness', color: 'default' },
  other: { label: 'Event', color: 'default' },
};

export function CharityEventCard({ event }: CharityEventCardProps) {
  const typeInfo = eventTypeLabels[event.event_type || 'other'] || eventTypeLabels.other;
  const spotsLeft = event.max_participants
    ? event.max_participants - event.current_participants
    : null;

  return (
    <Card hoverable>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date Box */}
        <div className="sm:w-20 flex-shrink-0">
          <div className="bg-ocean-600 text-white rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">
              {formatDate(event.date, 'd')}
            </p>
            <p className="text-sm text-ocean-100">
              {formatDate(event.date, 'MMM')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <Badge variant={typeInfo.color} size="sm" className="mb-1">
                {typeInfo.label}
              </Badge>
              <h3 className="font-semibold text-oyster-900">{event.title}</h3>
            </div>
          </div>

          {event.charity_name && (
            <p className="text-sm text-rose-600 mb-2">
              Organised by {event.charity_name}
            </p>
          )}

          {event.description && (
            <p className="text-sm text-oyster-600 mb-3 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-oyster-500 mb-4">
            {event.time_start && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.time_start}
                {event.time_end && ` - ${event.time_end}`}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
            {event.max_participants && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.current_participants}/{event.max_participants} signed up
                {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
                  <Badge variant="warning" size="sm" className="ml-1">
                    {spotsLeft} left
                  </Badge>
                )}
              </span>
            )}
          </div>

          {event.signup_url && (
            <a href={event.signup_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" rightIcon={<ExternalLink className="h-4 w-4" />}>
                Sign Up
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
