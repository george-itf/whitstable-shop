'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Map, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/',
    label: 'home',
    icon: Home,
  },
  {
    href: '/search',
    label: 'search',
    icon: Search,
  },
  {
    href: '/map',
    label: 'map',
    icon: Map,
  },
  {
    href: '/saved',
    label: 'saved',
    icon: Heart,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-oyster-100 safe-bottom z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

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
                <Icon
                  className="w-6 h-6"
                  fill={isActive && item.icon === Heart ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                'text-xs mt-1 transition-all duration-200',
                isActive ? 'font-bold' : 'font-medium'
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
