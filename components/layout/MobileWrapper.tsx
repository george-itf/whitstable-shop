import { cn } from '@/lib/utils';

interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;
}

export default function MobileWrapper({
  children,
  className,
  withNav = true,
}: MobileWrapperProps) {
  return (
    <div
      className={cn(
        'max-w-[430px] mx-auto bg-white min-h-screen relative shadow-lg',
        withNav && 'pb-20',
        className
      )}
    >
      {children}
    </div>
  );
}
