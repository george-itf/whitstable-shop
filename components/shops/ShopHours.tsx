'use client';

import { Clock } from 'lucide-react';
import { OpeningHours } from '@/types';
import { formatTime, getDayName } from '@/lib/utils';
import { DAYS_DISPLAY } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ShopHoursProps {
  hours: OpeningHours | null;
}

const ORDERED_DAYS: (keyof OpeningHours)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default function ShopHours({ hours }: ShopHoursProps) {
  if (!hours) {
    return (
      <div className="px-4 py-4 border-b border-grey-light">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-sky" />
          <h2 className="font-bold text-ink">opening hours</h2>
        </div>
        <p className="text-grey text-sm">Hours not available</p>
      </div>
    );
  }

  const today = getDayName();

  return (
    <div className="px-4 py-4 border-b border-grey-light">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-sky" />
        <h2 className="font-bold text-ink">opening hours</h2>
      </div>

      <div className="space-y-1.5">
        {ORDERED_DAYS.map((day) => {
          const dayHours = hours[day];
          const isToday = day === today;
          const isClosed = !dayHours || dayHours.closed;

          return (
            <div
              key={day}
              className={cn(
                'flex items-center justify-between py-2 px-3 rounded-xl transition-colors',
                isToday ? 'bg-sky-light' : 'hover:bg-oyster-50'
              )}
            >
              <span
                className={cn(
                  'text-sm',
                  isToday ? 'font-bold text-sky' : 'font-medium text-grey-dark'
                )}
              >
                {DAYS_DISPLAY[day]}
                {isToday && (
                  <span className="ml-1.5 text-xs bg-sky text-white px-1.5 py-0.5 rounded-md">
                    today
                  </span>
                )}
              </span>
              <span
                className={cn(
                  'text-sm',
                  isClosed
                    ? 'text-grey'
                    : isToday
                    ? 'font-bold text-sky'
                    : 'font-medium text-ink'
                )}
              >
                {isClosed
                  ? 'Closed'
                  : `${formatTime(dayHours!.open)} - ${formatTime(dayHours!.close)}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
