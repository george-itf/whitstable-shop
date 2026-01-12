'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: Date | string;
  onComplete?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({
  targetDate,
  onComplete,
  className,
  variant = 'default',
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance <= 0) {
        setIsComplete(true);
        onComplete?.();
        return null;
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className={cn('text-oyster-600 font-medium', className)}>
        Time&apos;s up!
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={cn('text-sm font-medium text-oyster-600', className)}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours}h {timeLeft.minutes}m
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {timeLeft.days > 0 && (
        <TimeUnit value={timeLeft.days} label="days" />
      )}
      <TimeUnit value={timeLeft.hours} label="hrs" />
      <TimeUnit value={timeLeft.minutes} label="min" />
      <TimeUnit value={timeLeft.seconds} label="sec" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-oyster-900 text-white px-3 py-2 rounded-lg min-w-[48px] text-center">
        <span className="text-xl font-bold">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs text-oyster-500 mt-1">{label}</span>
    </div>
  );
}

export default Countdown;
