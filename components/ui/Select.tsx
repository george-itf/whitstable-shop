'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  children?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helperText, options, placeholder, id, children, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-3 pr-10 rounded-xl border appearance-none',
              'text-ink bg-white',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent',
              'hover:border-oyster-300',
              error
                ? 'border-coral focus:ring-coral'
                : 'border-oyster-200',
              props.disabled && 'bg-oyster-50 cursor-not-allowed text-oyster-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children || (options && options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-oyster-400 pointer-events-none" />
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

Select.displayName = 'Select';

export default Select;
