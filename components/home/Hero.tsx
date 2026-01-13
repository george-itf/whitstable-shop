'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

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
      <div className="px-4 pt-4 pb-8">
        {/* Header with logo and menu */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/seagull.svg"
              alt=""
              width={32}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-white font-bold text-xl tracking-tight">whitstable.shop</span>
          </Link>
          <button
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex items-end justify-between">
          <div className="flex-1 pb-2">
            <h1 className="text-white text-2xl font-bold mb-2">
              {greeting}
            </h1>
            <p className="text-white/80 text-sm mb-4">
              see what&apos;s on, who&apos;s open, what&apos;s good
            </p>

            {/* Tide widget - enhanced with live indicator */}
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-pill px-3 py-1.5 backdrop-blur-sm">
              <div className="relative">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
              </div>
              <span className="text-white text-sm font-medium">
                {tideInfo.status} · {tideInfo.time}
              </span>
            </div>
          </div>

          {/* Seagull mascot - larger and peeking from edge like the logo */}
          <div className="w-28 h-32 relative -mr-4 -mb-2">
            <Image
              src="/seagull.svg"
              alt="Whitstable seagull mascot"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 430 20"
          preserveAspectRatio="none"
          className="w-full h-5"
        >
          <path
            d="M0 20 Q107.5 0 215 10 Q322.5 20 430 0 L430 20 Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
