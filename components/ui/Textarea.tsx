'use client';

import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  autoGrow?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, showCharCount, autoGrow, maxLength, onChange, value, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Update character count
    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    // Auto-grow functionality
    useEffect(() => {
      if (autoGrow && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
      }
    }, [value, autoGrow, textareaRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white resize-y',
              'text-ink placeholder:text-oyster-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent',
              'hover:border-oyster-300',
              error
                ? 'border-coral focus:ring-coral'
                : 'border-oyster-200',
              autoGrow ? 'resize-none overflow-hidden' : 'min-h-[120px]',
              props.disabled && 'bg-oyster-50 cursor-not-allowed text-oyster-500',
              className
            )}
            {...props}
          />

          {/* Decorative focus glow effect */}
          {isFocused && !error && (
            <div className="absolute inset-0 rounded-xl bg-sky/5 pointer-events-none -z-10 scale-[1.02] transition-all" />
          )}
        </div>

        {/* Footer with helper text and character count */}
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-coral flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-oyster-500">{helperText}</p>
            )}
          </div>

          {showCharCount && maxLength && (
            <p className={cn(
              'text-xs tabular-nums flex-shrink-0',
              charCount >= maxLength ? 'text-coral font-medium' : 'text-oyster-400'
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
