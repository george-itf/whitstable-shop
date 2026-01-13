import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
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
    card: 'py-10 px-6 bg-oyster-50/50 rounded-2xl border border-oyster-100',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variants[variant],
        className
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-sky-light/70 flex items-center justify-center mb-4 border border-sky/10">
          <Icon className="w-7 h-7 text-sky" />
        </div>
      )}
      <h3 className="text-base font-bold text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-oyster-500 max-w-xs mb-4 leading-relaxed">{description}</p>
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
        <p className="text-xs text-oyster-400 mt-4 max-w-xs italic">{hint}</p>
      )}
    </div>
  );
}

export default EmptyState;
