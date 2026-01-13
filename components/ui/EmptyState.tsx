import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';

// Charming coastal illustrations
const illustrations = {
  seagull: (
    <svg viewBox="0 0 80 60" fill="none" className="w-20 h-16">
      <ellipse cx="40" cy="55" rx="20" ry="3" fill="#E8E6E3" />
      <path d="M30 35c0-8 5-15 12-15s12 7 12 15" stroke="#6BA3BE" strokeWidth="2" fill="#FDFCFB" />
      <circle cx="36" cy="28" r="2" fill="#3D3D3D" />
      <path d="M45 30l8-3" stroke="#D4A84B" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 38c-5 1-10 4-12 8" stroke="#6BA3BE" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 38c5 1 10 4 12 8" stroke="#6BA3BE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  oyster: (
    <svg viewBox="0 0 80 50" fill="none" className="w-20 h-14">
      <ellipse cx="40" cy="45" rx="15" ry="2" fill="#E8E6E3" />
      <ellipse cx="40" cy="28" rx="28" ry="16" fill="#D1C4B5" stroke="#9A8167" strokeWidth="2" />
      <path d="M15 25c8-3 18-4 25-4s17 1 25 4" stroke="#9A8167" strokeWidth="1.5" />
      <circle cx="40" cy="28" r="6" fill="#FDFCFB" stroke="#E8E6E3" strokeWidth="2" />
      <circle cx="40" cy="28" r="2" fill="#6BA3BE" />
    </svg>
  ),
  waves: (
    <svg viewBox="0 0 100 40" fill="none" className="w-24 h-10">
      <path d="M5 25c10-8 20 8 30 0s20 8 30 0s20 8 30 0" stroke="#6BA3BE" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M0 32c10-6 20 6 30 0s20 6 30 0s20 6 30 0s20 6 25 0" stroke="#6BA3BE" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />
    </svg>
  ),
  beachHut: (
    <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16">
      <rect x="10" y="45" width="40" height="5" fill="#D1C4B5" rx="1" />
      <rect x="12" y="25" width="36" height="20" fill="#C9705B" stroke="#A85A47" strokeWidth="1.5" />
      <path d="M8 25l22-15 22 15" fill="#FDFCFB" stroke="#9A8167" strokeWidth="1.5" />
      <rect x="24" y="32" width="12" height="13" fill="#FDFCFB" stroke="#6BA3BE" strokeWidth="1" />
      <path d="M30 32v13" stroke="#6BA3BE" strokeWidth="1" />
      <path d="M24 38.5h12" stroke="#6BA3BE" strokeWidth="1" />
    </svg>
  ),
  boat: (
    <svg viewBox="0 0 80 50" fill="none" className="w-20 h-14">
      <ellipse cx="40" cy="46" rx="25" ry="2" fill="#E8E6E3" />
      <path d="M15 40c0 5 12 8 25 8s25-3 25-8l-8-15H23l-8 15z" fill="#9A8167" stroke="#7D6750" strokeWidth="1.5" />
      <rect x="38" y="10" width="4" height="18" fill="#7D6750" />
      <path d="M42 10l18 12v3l-18-8V10z" fill="#FDFCFB" stroke="#D1C4B5" strokeWidth="1" />
    </svg>
  ),
  empty: (
    <svg viewBox="0 0 80 60" fill="none" className="w-20 h-16">
      <circle cx="40" cy="30" r="25" fill="#EDF4F7" stroke="#6BA3BE" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#6BA3BE" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="28" r="2" fill="#6BA3BE" />
      <circle cx="45" cy="28" r="2" fill="#6BA3BE" />
      <path d="M35 38c2.5 2 7.5 2 10 0" stroke="#6BA3BE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

type IllustrationType = keyof typeof illustrations;

interface EmptyStateProps {
  icon?: LucideIcon;
  illustration?: IllustrationType;
  title: string;
  description?: string;
  hint?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'card';
}

export function EmptyState({
  icon: Icon,
  illustration = 'seagull',
  title,
  description,
  hint,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const variants = {
    default: 'py-12 px-4',
    compact: 'py-8 px-4',
    card: 'py-10 px-6 bg-driftwood-50/50 rounded-2xl border border-driftwood-200',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variants[variant],
        className
      )}
    >
      {/* Illustration takes priority over icon */}
      {!Icon && illustration && (
        <div className="mb-4 opacity-90">
          {illustrations[illustration]}
        </div>
      )}
      {Icon && !illustration && (
        <div className="w-14 h-14 rounded-xl bg-sky-light/70 flex items-center justify-center mb-4 border border-sky/20">
          <Icon className="w-7 h-7 text-sky" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink mb-1 font-display">{title}</h3>
      {description && (
        <p className="text-sm text-pebble-500 max-w-xs mb-4 leading-relaxed">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button size="sm">{action.label}</Button>
          </Link>
        ) : action.onClick ? (
          <Button onClick={action.onClick} size="sm">
            {action.label}
          </Button>
        ) : null
      )}
      {hint && (
        <p className="text-xs text-driftwood-400 mt-4 max-w-xs font-handwritten text-base">{hint}</p>
      )}
    </div>
  );
}

export default EmptyState;
