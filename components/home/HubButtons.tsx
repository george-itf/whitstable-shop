import Link from 'next/link';
import { cn } from '@/lib/utils';

const hubs = [
  {
    href: '/map',
    label: 'map',
    icon: (
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
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    color: 'bg-sky-light text-sky',
  },
  {
    href: '/events',
    label: "what's on",
    icon: (
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    color: 'bg-coral-light text-coral',
  },
  {
    href: '/shops',
    label: 'shops',
    icon: (
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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: 'bg-green-light text-green',
  },
  {
    href: '/info',
    label: 'local info',
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    color: 'bg-yellow/10 text-yellow',
  },
];

export default function HubButtons() {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-3">
        {hubs.map((hub) => (
          <Link
            key={hub.href}
            href={hub.href}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={cn(
                'w-14 h-14 rounded-card flex items-center justify-center',
                hub.color
              )}
            >
              {hub.icon}
            </div>
            <span className="text-xs font-medium text-ink">{hub.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
