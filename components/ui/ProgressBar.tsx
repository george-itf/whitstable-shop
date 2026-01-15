import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
  /** Accessible label describing what this progress bar represents */
  'aria-label'?: string;
  /** ID of element that labels this progress bar */
  'aria-labelledby'?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-ocean-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-oyster-600 mb-1">
          <span>{value.toLocaleString()}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(
          'w-full bg-oyster-200 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
      {/* Screen reader announcement of percentage */}
      <span className="sr-only">{percentage}% complete</span>
    </div>
  );
}

export default ProgressBar;
