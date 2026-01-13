import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
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
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const variants = {
    default: 'py-12 px-4',
    compact: 'py-8 px-4',
    card: 'py-10 px-6 bg-oyster-50 rounded-2xl',
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
        <div className="w-16 h-16 rounded-2xl bg-sky-light flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-sky" />
        </div>
      )}
      <h3 className="text-lg font-bold text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-grey max-w-xs mb-5 leading-relaxed">{description}</p>
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
    </div>
  );
}

export default EmptyState;
