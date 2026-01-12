import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'outlined';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, padding = 'md', variant = 'default', children, ...props }, ref) => {
    const paddingSizes = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const variants = {
      default: 'bg-white border-grey-light',
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
      warning: 'bg-amber-50 border-amber-200',
      error: 'bg-red-50 border-red-200',
      outlined: 'bg-transparent border-grey-light border-dashed',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-card border shadow-card',
          variants[variant],
          hoverable && 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer',
          paddingSizes[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
