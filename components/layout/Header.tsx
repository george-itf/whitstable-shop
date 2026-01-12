'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  variant?: 'default' | 'transparent';
  showMenu?: boolean;
}

export default function Header({ variant = 'default', showMenu = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'relative z-40',
          variant === 'transparent' ? 'bg-transparent' : 'bg-sky'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">whitstable.shop</span>
          </Link>

          {showMenu && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Slide-out menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg">
            <div className="p-4 border-b border-grey-light flex items-center justify-between">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-grey hover:text-ink transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                <MenuItem href="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </MenuItem>
                <MenuItem href="/shops" onClick={() => setIsMenuOpen(false)}>
                  All Shops
                </MenuItem>
                <MenuItem href="/map" onClick={() => setIsMenuOpen(false)}>
                  Map
                </MenuItem>
                <MenuItem href="/events" onClick={() => setIsMenuOpen(false)}>
                  What&apos;s On
                </MenuItem>
                <MenuItem href="/info" onClick={() => setIsMenuOpen(false)}>
                  Local Info
                </MenuItem>
                <div className="border-t border-grey-light my-3" />
                <MenuItem href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  Log In
                </MenuItem>
                <MenuItem href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </MenuItem>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="block px-3 py-2 rounded-lg text-ink hover:bg-grey-light/50 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
