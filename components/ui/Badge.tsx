import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sky' | 'coral' | 'green' | 'yellow' | 'grey' | 'success' | 'warning' | 'info' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-grey-light text-grey-dark',
      sky: 'bg-sky-light text-sky',
      coral: 'bg-coral-light text-coral',
      green: 'bg-green-light text-green',
      yellow: 'bg-yellow/10 text-yellow',
      grey: 'bg-grey-light text-grey',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-amber-100 text-amber-700',
      info: 'bg-blue-100 text-blue-700',
      danger: 'bg-red-100 text-red-700',
      outline: 'bg-transparent border border-grey-light text-grey-dark',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-pill font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
