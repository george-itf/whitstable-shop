'use client';

import Link from 'next/link';
import Image from 'next/image';
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
            <Image
              src="/seagull.svg"
              alt=""
              width={28}
              height={36}
              className="object-contain"
            />
            <span className="text-white font-bold text-xl tracking-tight">whitstable.shop</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shops" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              Shops
            </Link>
            <Link href="/events" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              Events
            </Link>
            <Link href="/map" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              Map
            </Link>
            <Link href="/community" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              Community
            </Link>
            <Link href="/saved" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              Saved
            </Link>
            <Link href="/auth/login" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              Log In
            </Link>
          </nav>

          {showMenu && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
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
                aria-label="Close menu"
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
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
              {/* DISCOVER */}
              <MenuSection title="Discover">
                <MenuItem href="/shops" onClick={() => setIsMenuOpen(false)}>
                  All Shops
                </MenuItem>
                <MenuItem href="/events" onClick={() => setIsMenuOpen(false)}>
                  What&apos;s On
                </MenuItem>
                <MenuItem href="/map" onClick={() => setIsMenuOpen(false)}>
                  Map
                </MenuItem>
                <MenuItem href="/info" onClick={() => setIsMenuOpen(false)}>
                  Local Info
                </MenuItem>
                <MenuItem href="/offers" onClick={() => setIsMenuOpen(false)}>
                  Deals &amp; Offers
                </MenuItem>
              </MenuSection>

              {/* COMMUNITY */}
              <MenuSection title="Community">
                <MenuItem href="/community" onClick={() => setIsMenuOpen(false)}>
                  Community Hub
                </MenuItem>
                <MenuItem href="/awards" onClick={() => setIsMenuOpen(false)}>
                  Awards
                </MenuItem>
                <MenuItem href="/ask" onClick={() => setIsMenuOpen(false)}>
                  Ask a Local
                </MenuItem>
                <MenuItem href="/photos" onClick={() => setIsMenuOpen(false)}>
                  Photos
                </MenuItem>
                <MenuItem href="/leaderboard" onClick={() => setIsMenuOpen(false)}>
                  Leaderboard
                </MenuItem>
              </MenuSection>

              {/* ACCOUNT */}
              <MenuSection title="Account">
                <MenuItem href="/settings/profile" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </MenuItem>
                <MenuItem href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </MenuItem>
                <div className="border-t border-grey-light my-2" />
                <MenuItem href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  Log In
                </MenuItem>
                <MenuItem href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </MenuItem>
              </MenuSection>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase text-grey px-3 mb-1">
        {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </div>
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
