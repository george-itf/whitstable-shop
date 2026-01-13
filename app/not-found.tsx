import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <MobileWrapper withNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-sky-light rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🦪</span>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">Page not found</h1>
        <p className="text-oyster-600 mb-8 max-w-xs">
          Sorry, we couldn&apos;t find what you&apos;re looking for. It might have washed out with the tide.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link href="/" className="flex-1">
            <Button fullWidth className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
          <Link href="/search" className="flex-1">
            <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </MobileWrapper>
  );
}
