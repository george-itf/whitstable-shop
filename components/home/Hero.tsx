'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MenuTrigger } from '@/components/layout/MobileMenu';

export default function Hero() {
  const [tideInfo, setTideInfo] = useState({ status: 'rising', time: '2:34pm' });
  const [greeting, setGreeting] = useState('hey there');

  useEffect(() => {
    // Dynamic greeting with Whitstable personality
    const hour = new Date().getHours();
    const greetings = {
      earlyMorning: ['early riser?', 'up with the seagulls', 'morning, sleepyhead'],
      morning: ['morning, local', 'lovely morning for it', 'coffee first?'],
      afternoon: ['afternoon stroll?', 'found a new favourite yet?', 'good to see you'],
      evening: ['fish & chips o\'clock', 'evening, local', 'sunset watcher?'],
      night: ['night owl?', 'can\'t sleep either?', 'late one tonight'],
    };

    let timeOfDay: keyof typeof greetings;
    if (hour < 7) timeOfDay = 'earlyMorning';
    else if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const options = greetings[timeOfDay];
    setGreeting(options[Math.floor(Math.random() * options.length)]);

    // Mock tide data - in production this would come from an API
    const isRising = hour % 12 < 6;
    setTideInfo({
      status: isRising ? 'coming in' : 'heading out',
      time: isRising ? 'high around 3:45pm' : 'low around 9:20pm',
    });
  }, []);

  return (
    <div className="bg-sky relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div className="px-4 pt-4 pb-10 relative">
        {/* Header with logo and menu */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand/logo-banner.svg"
              alt="whitstable.shop"
              width={180}
              height={48}
              className="object-contain h-10 w-auto"
              priority
            />
          </Link>
          <MenuTrigger
            className="text-white/80 hover:text-white"
            iconClassName="text-white/80 hover:text-white"
          />
        </div>

        {/* Main content */}
        <div className="flex items-end justify-between">
          <div className="flex-1 pb-2">
            <p className="text-white/70 text-xs uppercase tracking-wider mb-1 font-medium">your local guide</p>
            <h1 className="text-white text-2xl font-semibold mb-3 font-display">
              {greeting}
            </h1>

            {/* Tide widget - more prominent */}
            <div className="inline-flex items-center gap-2.5 bg-white/15 border border-white/20 rounded-xl px-3.5 py-2">
              <div className="relative">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/90"
                >
                  <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green rounded-full animate-pulse" />
              </div>
              <div className="text-white">
                <p className="text-xs text-white/70 leading-none mb-0.5">the tide&apos;s</p>
                <p className="text-sm font-medium leading-none">{tideInfo.status}</p>
              </div>
            </div>
          </div>

          {/* Seagull mascot - larger and peeking from edge */}
          <div className="w-28 h-32 relative -mr-2 -mb-6">
            <Image
              src="/brand/seagull-stand.svg"
              alt="Whitstable seagull mascot"
              fill
              className="object-contain object-bottom drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Hand-drawn style wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 430 24"
          preserveAspectRatio="none"
          className="w-full h-6"
        >
          <path
            d="M0 24 C30 18, 60 8, 100 12 C140 16, 180 6, 215 10 C250 14, 290 4, 330 8 C370 12, 400 6, 430 2 L430 24 Z"
            fill="#FDFCFB"
          />
        </svg>
      </div>
    </div>
  );
}
