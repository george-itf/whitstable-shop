'use client';

import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backHref = '/',
  icon: Icon,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('bg-sky px-4 py-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="text-white/80 hover:text-white p-1 -ml-1 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-xl">{title}</h1>
            {subtitle && (
              <p className="text-white/70 text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        {Icon && (
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
