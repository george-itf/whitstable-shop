'use client';

import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  color?: 'default' | 'sky' | 'coral' | 'green' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorStyles = {
  default: {
    bg: 'bg-grey-light/50',
    icon: 'text-grey',
  },
  sky: {
    bg: 'bg-sky-light',
    icon: 'text-sky',
  },
  coral: {
    bg: 'bg-coral-light',
    icon: 'text-coral',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
  },
  yellow: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
  },
};

const sizeStyles = {
  sm: {
    padding: 'p-3',
    iconSize: 'w-8 h-8',
    iconInner: 'w-4 h-4',
    title: 'text-xs',
    value: 'text-lg',
    subtitle: 'text-xs',
  },
  md: {
    padding: 'p-4',
    iconSize: 'w-10 h-10',
    iconInner: 'w-5 h-5',
    title: 'text-sm',
    value: 'text-2xl',
    subtitle: 'text-xs',
  },
  lg: {
    padding: 'p-5',
    iconSize: 'w-12 h-12',
    iconInner: 'w-6 h-6',
    title: 'text-sm',
    value: 'text-3xl',
    subtitle: 'text-sm',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'default',
  size = 'md',
  className,
}: StatCardProps) {
  const colorStyle = colorStyles[color];
  const sizeStyle = sizeStyles[size];

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  const trendColor = trend
    ? trend.value > 0
      ? 'text-green-600'
      : trend.value < 0
      ? 'text-red-600'
      : 'text-grey'
    : '';

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-grey-light/50 shadow-sm',
        sizeStyle.padding,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-grey uppercase tracking-wide', sizeStyle.title)}>
            {title}
          </p>
          <p className={cn('font-bold text-ink mt-1', sizeStyle.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {(subtitle || trend) && (
            <div className={cn('flex items-center gap-2 mt-1', sizeStyle.subtitle)}>
              {trend && TrendIcon && (
                <span className={cn('flex items-center gap-0.5 font-medium', trendColor)}>
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && <span className="text-grey">{subtitle}</span>}
              {trend?.label && <span className="text-grey">{trend.label}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('rounded-xl flex items-center justify-center', colorStyle.bg, sizeStyle.iconSize)}>
            <Icon className={cn(colorStyle.icon, sizeStyle.iconInner)} />
          </div>
        )}
      </div>
    </div>
  );
}
