'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'coral' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      children,
      leftIcon,
      rightIcon,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variants = {
      primary: 'bg-sky text-white hover:bg-sky-dark focus-visible:ring-sky shadow-sm hover:shadow',
      secondary: 'bg-oyster-100 text-ink hover:bg-oyster-200 focus-visible:ring-oyster-300',
      coral: 'bg-coral text-white hover:bg-coral-dark focus-visible:ring-coral shadow-sm hover:shadow',
      ghost: 'bg-transparent text-ink hover:bg-oyster-100 focus-visible:ring-oyster-300',
      outline: 'bg-transparent border border-oyster-200 text-ink hover:bg-oyster-50 hover:border-oyster-300 focus-visible:ring-sky',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-sm hover:shadow',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2.5 text-base rounded-xl gap-2',
      lg: 'px-6 py-3 text-lg rounded-xl gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
