'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [tideInfo, setTideInfo] = useState({ status: 'rising', time: '2:34pm' });

  useEffect(() => {
    // Mock tide data - in production this would come from an API
    const hour = new Date().getHours();
    setTideInfo({
      status: hour % 12 < 6 ? 'rising' : 'falling',
      time: hour % 12 < 6 ? 'high at 3:45pm' : 'low at 9:20pm',
    });
  }, []);

  return (
    <div className="bg-sky relative overflow-hidden">
      <div className="px-4 pt-4 pb-8">
        {/* Header with logo and menu */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-white font-bold text-xl">whitstable.shop</span>
          <button
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
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
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main content */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">
              hey there, local
            </h1>
            <p className="text-white/80 text-sm mb-4">
              discover what&apos;s happening in whitstable
            </p>

            {/* Tide widget */}
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-pill px-3 py-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
              <span className="text-white text-sm font-medium">
                tide {tideInfo.status} · {tideInfo.time}
              </span>
            </div>
          </div>

          {/* Seagull mascot */}
          <div className="w-24 h-28 relative">
            <Image
              src="/seagull.svg"
              alt="Whitstable seagull mascot"
              fill
              className="object-contain"
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
