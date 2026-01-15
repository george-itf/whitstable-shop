'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'success';
  className?: string;
}

/**
 * Standardized empty state component for admin pages
 * Provides consistent styling for "no data" scenarios
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
          variant === 'success' ? 'bg-green/10' : 'bg-grey-light/50'
        )}
      >
        <Icon
          className={cn(
            'w-8 h-8',
            variant === 'success' ? 'text-green' : 'text-grey'
          )}
        />
      </div>
      <h3 className="font-semibold text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-grey max-w-xs mx-auto mb-4">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center justify-center gap-3 mt-4">
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 bg-coral text-white rounded-lg font-medium hover:bg-coral/90 transition-colors text-sm"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <>
              {action && <span className="text-grey text-sm">or</span>}
              <button
                onClick={secondaryAction.onClick}
                className="text-sky hover:underline font-medium text-sm"
              >
                {secondaryAction.label}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
