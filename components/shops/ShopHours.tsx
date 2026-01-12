'use client';

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
        <h2 className="font-bold text-ink mb-3">opening hours</h2>
        <p className="text-grey text-sm">Hours not available</p>
      </div>
    );
  }

  const today = getDayName();

  return (
    <div className="px-4 py-4 border-b border-grey-light">
      <h2 className="font-bold text-ink mb-3">opening hours</h2>

      <div className="space-y-2">
        {ORDERED_DAYS.map((day) => {
          const dayHours = hours[day];
          const isToday = day === today;

          return (
            <div
              key={day}
              className={cn(
                'flex items-center justify-between py-1.5 px-2 rounded-lg',
                isToday && 'bg-sky-light'
              )}
            >
              <span
                className={cn(
                  'text-sm',
                  isToday ? 'font-semibold text-sky' : 'text-grey-dark'
                )}
              >
                {DAYS_DISPLAY[day]}
                {isToday && ' (today)'}
              </span>
              <span
                className={cn(
                  'text-sm',
                  isToday ? 'font-semibold text-sky' : 'text-ink'
                )}
              >
                {dayHours && !dayHours.closed
                  ? `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`
                  : 'Closed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
