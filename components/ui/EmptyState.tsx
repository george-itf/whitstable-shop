import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-oyster-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-oyster-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-oyster-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-oyster-600 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
