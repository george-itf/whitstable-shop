'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oyster-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full py-3 border rounded-xl text-ink bg-white placeholder:text-oyster-400',
              'focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent',
              'hover:border-oyster-300 transition-all duration-200',
              error ? 'border-coral focus:ring-coral' : 'border-oyster-200',
              leftIcon ? 'pl-11 pr-4' : 'px-4',
              rightIcon ? 'pr-11' : '',
              props.disabled && 'bg-oyster-50 cursor-not-allowed text-oyster-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-oyster-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-coral flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && <p className="mt-1.5 text-sm text-oyster-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
