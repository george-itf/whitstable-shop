'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Custom coastal icons - hand-drawn style matching HubButtons

// Beach hut icon for Home
const BeachHutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M4 12l8-7 8 7" />
    <path d="M6 10v10h12V10" />
    <rect x="9" y="14" width="6" height="6" />
    <path d="M12 14v6" />
    <path d="M9 17h6" />
  </svg>
);

// Binoculars for Search
const BinocularsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="7" cy="17" r="3" />
    <circle cx="17" cy="17" r="3" />
    <path d="M7 14V8c0-1 .5-2 2-2h1" />
    <path d="M17 14V8c0-1-.5-2-2-2h-1" />
    <path d="M10 6h4" />
  </svg>
);

// Compass for Map
const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="9" />
    <polygon points="15 9 9 11 9 15 15 13 15 9" fill="currentColor" />
  </svg>
);

// Heart with wave for Saved
const HeartWaveIcon = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    {!filled && <path d="M7 13c2-1.5 4 1.5 6 0s4 1.5 5 0" strokeWidth="1.5" />}
  </svg>
);

const navItems = [
  {
    href: '/',
    label: 'home',
    Icon: BeachHutIcon,
  },
  {
    href: '/search',
    label: 'search',
    Icon: BinocularsIcon,
  },
  {
    href: '/map',
    label: 'map',
    Icon: CompassIcon,
  },
  {
    href: '/saved',
    label: 'saved',
    Icon: HeartWaveIcon,
    fillOnActive: true,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-oyster-100 safe-bottom z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.Icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-5 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-sky'
                  : 'text-oyster-400 hover:text-ink active:scale-95'
              )}
            >
              <div className={cn(
                'transition-all duration-200',
                isActive && 'scale-110'
              )}>
                {item.fillOnActive ? (
                  <Icon filled={isActive} />
                ) : (
                  <Icon />
                )}
              </div>
              <span className={cn(
                'text-xs mt-1 transition-all duration-200',
                isActive ? 'font-bold font-handwritten text-sm' : 'font-medium'
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 bg-sky rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
