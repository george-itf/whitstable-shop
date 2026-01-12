'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-grey-dark mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 border rounded-button text-ink placeholder:text-grey',
            'focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent',
            'transition-colors duration-200',
            error ? 'border-coral' : 'border-grey-light',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-coral">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-grey">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
