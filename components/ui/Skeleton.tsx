import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'heading' | 'avatar' | 'button' | 'card' | 'image';
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Skeleton loading placeholder component
 *
 * Usage:
 * ```tsx
 * <Skeleton variant="text" />
 * <Skeleton variant="avatar" className="w-10 h-10" />
 * <Skeleton variant="card" className="h-48" />
 * ```
 */
export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const variantClasses = {
    default: 'bg-oyster-200',
    text: 'h-4 bg-oyster-200',
    heading: 'h-6 bg-oyster-200',
    avatar: 'bg-oyster-200 rounded-full',
    button: 'h-10 bg-oyster-200 rounded-lg',
    card: 'bg-oyster-200 rounded-xl',
    image: 'bg-oyster-200',
  };

  return (
    <div
      className={cn(
        'animate-pulse',
        variantClasses[variant],
        variant !== 'avatar' && roundedClasses[rounded],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      role="status"
      aria-label="Loading..."
    />
  );
}

/**
 * Shop card skeleton for loading states
 */
export function ShopCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton variant="image" className="h-36" rounded="none" />
      <div className="p-3.5 space-y-2">
        <Skeleton variant="heading" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex items-center gap-1 pt-1">
          <Skeleton variant="default" className="w-3 h-3" rounded="full" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Photo card skeleton for loading states
 */
export function PhotoCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton variant="image" className="aspect-[4/3]" rounded="none" />
      <div className="p-2.5 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <div className="flex items-center gap-1.5">
          <Skeleton variant="avatar" className="w-5 h-5" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * Event card skeleton for loading states
 */
export function EventCardSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex gap-3">
        <Skeleton variant="default" className="w-14 h-14" rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="heading" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton variant="avatar" className="w-10 h-10" />
      <div className="flex-1 space-y-1.5">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  );
}

/**
 * Shop hero skeleton for shop detail page
 */
export function ShopHeroSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="image" className="h-48 w-full" rounded="none" />
      <div className="px-4 space-y-3">
        <Skeleton variant="heading" className="w-1/2 h-8" />
        <Skeleton variant="text" className="w-3/4" />
        <div className="flex gap-2">
          <Skeleton variant="button" className="w-24" />
          <Skeleton variant="button" className="w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Generic content skeleton with multiple lines
 */
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

/**
 * Page loading skeleton with title and content
 */
export function PageSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <Skeleton variant="heading" className="w-1/3 h-8" />
      <ContentSkeleton lines={4} />
      <div className="grid grid-cols-2 gap-4">
        <ShopCardSkeleton />
        <ShopCardSkeleton />
      </div>
    </div>
  );
}

export default Skeleton;
