'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Menu,
  Store,
  Calendar,
  Map,
  Info,
  Tag,
  Flame,
  MessageCircleQuestion,
  Camera,
  Trophy,
  Dog,
  BarChart3,
  Heart,
  User,
  Bell,
  LayoutDashboard,
  LogIn,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Context for managing menu state globally
interface MobileMenuContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider');
  }
  return context;
}

// Provider component
export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <MobileMenuContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <MobileMenuPanel />
    </MobileMenuContext.Provider>
  );
}

// Trigger button component
interface MenuTriggerProps {
  className?: string;
  iconClassName?: string;
}

export function MenuTrigger({ className, iconClassName }: MenuTriggerProps) {
  const { open } = useMobileMenu();

  return (
    <button
      onClick={open}
      className={cn(
        'p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        className
      )}
      aria-label="Open navigation menu"
      aria-haspopup="dialog"
    >
      <Menu className={cn('w-6 h-6', iconClassName)} aria-hidden="true" />
    </button>
  );
}

// The slide-out panel
function MobileMenuPanel() {
  const { isOpen, close } = useMobileMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when menu opens
    closeButtonRef.current?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }

      // Focus trap - only trap Tab key
      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, go to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: if on last element, go to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        ref={menuRef}
        className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg animate-slide-in-right"
      >
        <div className="p-4 border-b border-grey-light flex items-center justify-between">
          <span className="font-bold text-lg text-ink">Menu</span>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="p-2 text-grey hover:text-ink rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]" aria-label="Main menu">
          {/* DISCOVER */}
          <MenuSection title="Discover">
            <MenuItem href="/shops" icon={Store} color="text-coral">All Shops</MenuItem>
            <MenuItem href="/events" icon={Calendar} color="text-sky">What&apos;s On</MenuItem>
            <MenuItem href="/map" icon={Map} color="text-green">Map</MenuItem>
            <MenuItem href="/info" icon={Info} color="text-yellow-600">Local Info</MenuItem>
            <MenuItem href="/offers" icon={Tag} color="text-coral">Deals &amp; Offers</MenuItem>
            <MenuItem href="/trending" icon={Flame} color="text-orange-500">Trending</MenuItem>
          </MenuSection>

          {/* COMMUNITY */}
          <MenuSection title="Community">
            <MenuItem href="/ask" icon={MessageCircleQuestion} color="text-sky">Ask a Local</MenuItem>
            <MenuItem href="/photos" icon={Camera} color="text-violet-500">Photos</MenuItem>
            <MenuItem href="/awards" icon={Trophy} color="text-yellow-500">Awards</MenuItem>
            <MenuItem href="/dogs" icon={Dog} color="text-amber-600">Dog Walks</MenuItem>
            <MenuItem href="/leaderboard" icon={BarChart3} color="text-green">Leaderboard</MenuItem>
          </MenuSection>

          {/* ACCOUNT */}
          <MenuSection title="Account">
            <MenuItem href="/saved" icon={Heart} color="text-coral">Saved Shops</MenuItem>
            <MenuItem href="/settings/profile" icon={User} color="text-sky">Profile</MenuItem>
            <MenuItem href="/settings/notifications" icon={Bell} color="text-yellow-500">Notifications</MenuItem>
            <MenuItem href="/dashboard" icon={LayoutDashboard} color="text-green">Dashboard</MenuItem>
            <div className="border-t border-grey-light my-2" />
            <MenuItem href="/auth/login" icon={LogIn} color="text-grey">Log In</MenuItem>
            <MenuItem href="/auth/signup" icon={Sparkles} color="text-coral">Sign Up</MenuItem>
          </MenuSection>
        </nav>
      </div>
    </div>
  );
}

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase text-grey px-3 mb-1">
        {title}
      </h3>
      <ul className="space-y-0.5" role="list">
        {children}
      </ul>
    </div>
  );
}

function MenuItem({
  href,
  icon: Icon,
  color,
  children,
}: {
  href: string;
  icon: LucideIcon;
  color?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-inset',
          isActive
            ? 'bg-sky-light text-sky font-medium'
            : 'text-ink hover:bg-grey-light/50'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon
          className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-sky' : color)}
          aria-hidden="true"
        />
        <span>{children}</span>
      </Link>
    </li>
  );
}

// Export a simple standalone menu button for use anywhere
export function MobileMenuButton({ className }: { className?: string }) {
  return <MenuTrigger className={className} />;
}
