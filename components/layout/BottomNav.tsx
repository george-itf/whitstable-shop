'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Map, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
  },
  {
    href: '/map',
    label: 'Map',
    icon: Map,
  },
  {
    href: '/saved',
    label: 'Saved',
    icon: Heart,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-oyster-100 safe-bottom z-50 md:hidden"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2 px-2" role="list">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={isActive ? `${item.label} (current page)` : item.label}
              className={cn(
                'relative flex flex-col items-center py-2 px-5 rounded-xl transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2',
                isActive
                  ? 'text-sky'
                  : 'text-oyster-400 hover:text-ink active:scale-95'
              )}
            >
              <div className={cn(
                'transition-all duration-200',
                isActive && 'scale-110'
              )}>
                <Icon
                  className="w-6 h-6"
                  fill={isActive && item.icon === Heart ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden="true"
                />
              </div>
              <span className={cn(
                'text-xs mt-1 transition-all duration-200',
                isActive ? 'font-bold' : 'font-medium'
              )}>
                {item.label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-0.5 w-1 h-1 bg-sky rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
