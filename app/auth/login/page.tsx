import Link from 'next/link';
import { Suspense } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <MobileWrapper withNav={false}>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">log in</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-2">welcome back</h2>
          <p className="text-grey">Sign in to access your saved shops and more</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </MobileWrapper>
  );
}
