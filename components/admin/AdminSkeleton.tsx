'use client';

import { cn } from '@/lib/utils';

interface AdminSkeletonProps {
  /** Number of skeleton items to show */
  count?: number;
  /** Type of skeleton layout */
  variant?: 'list' | 'card' | 'table' | 'stats';
  /** Additional className */
  className?: string;
}

/**
 * Standardized skeleton loader for admin pages
 * Provides consistent loading states across the admin
 */
export default function AdminSkeleton({
  count = 3,
  variant = 'list',
  className,
}: AdminSkeletonProps) {
  if (variant === 'stats') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-grey-light p-4 animate-pulse"
          >
            <div className="h-3 bg-grey-light rounded w-20 mb-3" />
            <div className="h-8 bg-grey-light rounded w-16 mb-2" />
            <div className="h-3 bg-grey-light rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-grey-light p-4 animate-pulse"
          >
            <div className="h-32 bg-grey-light rounded-lg mb-4" />
            <div className="h-5 bg-grey-light rounded w-3/4 mb-2" />
            <div className="h-4 bg-grey-light rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="bg-white rounded-xl border border-grey-light p-4 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 bg-grey-light rounded w-32" />
            <div className="h-4 bg-grey-light rounded w-24" />
            <div className="h-4 bg-grey-light rounded w-20" />
            <div className="flex-1" />
            <div className="h-4 bg-grey-light rounded w-16" />
          </div>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-t border-grey-light">
              <div className="h-4 bg-grey-light rounded w-32" />
              <div className="h-4 bg-grey-light rounded w-24" />
              <div className="h-4 bg-grey-light rounded w-20" />
              <div className="flex-1" />
              <div className="h-4 bg-grey-light rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: list variant
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-grey-light p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-grey-light rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-5 bg-grey-light rounded w-3/4 mb-2" />
              <div className="h-4 bg-grey-light rounded w-1/2 mb-2" />
              <div className="h-3 bg-grey-light rounded w-1/3" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-grey-light rounded-lg" />
              <div className="w-8 h-8 bg-grey-light rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
