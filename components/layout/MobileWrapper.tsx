import { cn } from '@/lib/utils';
import SkipLink from './SkipLink';

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
    <>
      <SkipLink />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'max-w-[430px] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-white min-h-screen relative shadow-lg md:shadow-none',
          'focus:outline-none', // Remove outline when programmatically focused
          withNav && 'pb-20 md:pb-0',
          className
        )}
      >
        {children}
      </main>
    </>
  );
}
