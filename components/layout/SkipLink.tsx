'use client';

/**
 * Skip Link - Accessibility component
 * Allows keyboard users to skip directly to main content
 * Visible only when focused (appears at top of page)
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-2 left-2 z-[100]
        px-4 py-2
        bg-sky text-white font-semibold
        rounded-lg shadow-lg
        focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2
        transition-transform
        focus:translate-y-0
        -translate-y-16
      "
    >
      Skip to main content
    </a>
  );
}
