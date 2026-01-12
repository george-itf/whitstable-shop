import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'outlined' | 'elevated';
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
      default: 'bg-white border-oyster-100',
      info: 'bg-sky-light/50 border-sky/20',
      success: 'bg-green-light border-green/20',
      warning: 'bg-yellow-light border-yellow/20',
      error: 'bg-coral-light border-coral/20',
      outlined: 'bg-transparent border-oyster-200 border-dashed',
      elevated: 'bg-white border-transparent shadow-float',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border shadow-card',
          variants[variant],
          hoverable && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
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
