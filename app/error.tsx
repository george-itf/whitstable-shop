'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <div className="max-w-md w-full text-center">
        {/* Error icon */}
        <div className="w-20 h-20 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-coral"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">Something went wrong</h1>
        <p className="text-grey mb-6">
          We&apos;re sorry, but something unexpected happened. Please try again.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-grey-light rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-mono text-grey-dark break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-grey mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-sky text-white rounded-button font-semibold hover:bg-sky/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-grey-light text-ink rounded-button font-semibold hover:bg-grey-light/80 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
