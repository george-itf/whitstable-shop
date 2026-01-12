import Link from 'next/link';

interface MapPreviewProps {
  shopCount?: number;
}

export default function MapPreview({ shopCount = 47 }: MapPreviewProps) {
  return (
    <div className="px-4 py-6">
      <Link href="/map" className="block">
        <div className="bg-ink rounded-card overflow-hidden relative h-32">
          {/* Map placeholder background */}
          <div className="absolute inset-0 opacity-30">
            <svg
              viewBox="0 0 400 120"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full"
            >
              {/* Simple map-like pattern */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#5BB5E0"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Coastline-like curve */}
              <path
                d="M0 80 Q100 60 200 70 T400 65"
                stroke="#5BB5E0"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              <span className="font-bold">explore the map</span>
            </div>
            <p className="text-white/70 text-sm">
              {shopCount} spots to discover
            </p>
          </div>

          {/* Marker pins decoration */}
          <div className="absolute top-4 right-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#f47b5c"
              stroke="#f47b5c"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
          </div>
          <div className="absolute top-6 left-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#5BB5E0"
              stroke="#5BB5E0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
          </div>
          <div className="absolute bottom-8 right-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#10b981"
              stroke="#10b981"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}
