import Link from 'next/link';
import { cn } from '@/lib/utils';

// Custom hand-drawn style SVG icons
const MapIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="16" cy="13" r="4" />
    <path d="M16 3c-6 0-11 5-11 11 0 8 11 15 11 15s11-7 11-15c0-6-5-11-11-11z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="4" y="6" width="24" height="22" rx="3" />
    <path d="M4 12h24" />
    <path d="M10 3v5M22 3v5" />
    <circle cx="11" cy="19" r="1.5" fill="currentColor" />
    <circle cx="16" cy="19" r="1.5" fill="currentColor" />
    <circle cx="21" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

const ShopIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M4 10l2-6h20l2 6" />
    <path d="M4 10c0 2 2 4 4 4s4-2 4-4" />
    <path d="M12 10c0 2 2 4 4 4s4-2 4-4" />
    <path d="M20 10c0 2 2 4 4 4s4-2 4-4" />
    <path d="M6 14v12h20V14" />
    <rect x="12" y="20" width="8" height="6" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="16" cy="16" r="12" />
    <path d="M16 21v-6" />
    <circle cx="16" cy="11" r="1" fill="currentColor" />
  </svg>
);

const DealsIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M19 3l-3 3-3-3-10 10 3 3 3-3v13h14V13l3 3 3-3L19 3z" />
    <circle cx="13" cy="17" r="2" />
    <circle cx="19" cy="23" r="2" />
    <path d="M12 24l8-10" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M6 6h20a2 2 0 012 2v12a2 2 0 01-2 2H10l-6 5V8a2 2 0 012-2z" />
    <path d="M10 12h12M10 16h8" />
  </svg>
);

const hubs = [
  {
    href: '/map',
    label: 'town map',
    Icon: MapIcon,
    color: 'bg-sky-light text-sky border-2 border-sky/20',
    hoverColor: 'group-hover:bg-sky group-hover:text-white group-hover:border-sky',
  },
  {
    href: '/events',
    label: "what's on",
    Icon: CalendarIcon,
    color: 'bg-coral-light text-coral border-2 border-coral/20',
    hoverColor: 'group-hover:bg-coral group-hover:text-white group-hover:border-coral',
  },
  {
    href: '/shops',
    label: 'browse shops',
    Icon: ShopIcon,
    color: 'bg-green-light text-green border-2 border-green/20',
    hoverColor: 'group-hover:bg-green group-hover:text-white group-hover:border-green',
  },
  {
    href: '/info',
    label: 'local info',
    Icon: InfoIcon,
    color: 'bg-yellow-light text-yellow border-2 border-yellow/20',
    hoverColor: 'group-hover:bg-yellow group-hover:text-white group-hover:border-yellow',
  },
  {
    href: '/offers',
    label: 'deals',
    Icon: DealsIcon,
    color: 'bg-coral-light text-coral border-2 border-coral/20',
    hoverColor: 'group-hover:bg-coral group-hover:text-white group-hover:border-coral',
  },
  {
    href: '/ask',
    label: 'ask a local',
    Icon: ChatIcon,
    color: 'bg-sky-light text-sky border-2 border-sky/20',
    hoverColor: 'group-hover:bg-sky group-hover:text-white group-hover:border-sky',
  },
];

export default function HubButtons() {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {hubs.map((hub) => {
          const { Icon } = hub;
          return (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex flex-col items-center gap-2 tap-effect"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200',
                  hub.color,
                  hub.hoverColor
                )}
              >
                <Icon />
              </div>
              <span className="text-xs font-medium text-pebble-600 group-hover:text-ink transition-colors text-center leading-tight">
                {hub.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
