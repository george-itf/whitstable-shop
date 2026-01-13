import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <MobileWrapper withNav={false}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-coral to-coral-dark px-4 pt-4 pb-12 relative overflow-hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">back</span>
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">join the locals</h1>
            <p className="text-white/80 text-sm">
              Become part of Whitstable
            </p>
          </div>
          <div className="w-20 h-24 relative -mr-2 -mb-4">
            <Image
              src="/seagull.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 -mt-4 relative">
        <div className="bg-white rounded-t-2xl pt-6">
          <Suspense fallback={
            <div className="space-y-4">
              <div className="h-12 skeleton rounded-xl" />
              <div className="h-12 skeleton rounded-xl" />
              <div className="h-12 skeleton rounded-xl" />
            </div>
          }>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </MobileWrapper>
  );
}
