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
        'max-w-[430px] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-white min-h-screen relative shadow-lg md:shadow-none',
        withNav && 'pb-20 md:pb-0',
        className
      )}
    >
      {children}
    </div>
  );
}
