import Link from 'next/link';
import { cn } from '@/lib/utils';

// Bold, characterful SVG icons with more visual weight
const MapIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
    {/* Map pin with solid fill for more weight */}
    <path d="M16 2C10.5 2 6 6.5 6 12c0 7.5 10 17 10 17s10-9.5 10-17c0-5.5-4.5-10-10-10z" />
    <circle cx="16" cy="12" r="4" fill="white" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
    {/* Calendar with filled header for more visual impact */}
    <rect x="4" y="8" width="24" height="20" rx="3" fill="currentColor" />
    <rect x="4" y="8" width="24" height="8" rx="3" fill="currentColor" />
    <rect x="6" y="18" width="4" height="4" rx="1" fill="white" />
    <rect x="14" y="18" width="4" height="4" rx="1" fill="white" />
    <rect x="22" y="18" width="4" height="4" rx="1" fill="white" />
    <rect x="9" y="3" width="3" height="8" rx="1.5" fill="currentColor" />
    <rect x="20" y="3" width="3" height="8" rx="1.5" fill="currentColor" />
  </svg>
);

const ShopIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
    {/* Storefront with awning - bold and recognizable */}
    <path d="M4 12h24v3H4z" />
    <path d="M6 15v13h20V15" fill="currentColor" fillOpacity="0.4" />
    <path d="M6 12l1-6h18l1 6" />
    {/* Awning stripes */}
    <path d="M4 12c0 2 2 4 4.8 4s4.8-2 4.8-4M9.6 12c0 2 2 4 4.8 4s4.8-2 4.8-4M18.4 12c0 2 2 4 4.8 4s4.8-2 4.8-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Door */}
    <rect x="12" y="20" width="8" height="8" rx="1" fill="white" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
    {/* Bold info icon with filled background */}
    <circle cx="16" cy="16" r="14" />
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="serif">i</text>
  </svg>
);

const DealsIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
    {/* Price tag - simple and clear */}
    <path d="M29 13l-13-10-13 10v13a3 3 0 003 3h20a3 3 0 003-3z" />
    <circle cx="12" cy="17" r="2.5" fill="white" />
    <circle cx="20" cy="23" r="2.5" fill="white" />
    <path d="M11 25l10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
    {/* Speech bubble - bold and friendly */}
    <path d="M4 6h24a2 2 0 012 2v14a2 2 0 01-2 2h-14l-8 6V24H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
    <circle cx="10" cy="15" r="2" fill="white" />
    <circle cx="16" cy="15" r="2" fill="white" />
    <circle cx="22" cy="15" r="2" fill="white" />
  </svg>
);

const hubs = [
  {
    href: '/map',
    label: 'town map',
    Icon: MapIcon,
    color: 'bg-sky-light text-sky border-2 border-sky/30',
    hoverColor: 'group-hover:bg-sky group-hover:text-white group-hover:border-sky group-hover:scale-105',
  },
  {
    href: '/events',
    label: "what's on",
    Icon: CalendarIcon,
    color: 'bg-coral-light text-coral border-2 border-coral/30',
    hoverColor: 'group-hover:bg-coral group-hover:text-white group-hover:border-coral group-hover:scale-105',
  },
  {
    href: '/shops',
    label: 'browse shops',
    Icon: ShopIcon,
    color: 'bg-green-light text-green border-2 border-green/30',
    hoverColor: 'group-hover:bg-green group-hover:text-white group-hover:border-green group-hover:scale-105',
  },
  {
    href: '/info',
    label: 'local info',
    Icon: InfoIcon,
    color: 'bg-yellow-light text-yellow-600 border-2 border-yellow/30',
    hoverColor: 'group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500 group-hover:scale-105',
  },
  {
    href: '/offers',
    label: 'deals',
    Icon: DealsIcon,
    color: 'bg-coral-light text-coral border-2 border-coral/30',
    hoverColor: 'group-hover:bg-coral group-hover:text-white group-hover:border-coral group-hover:scale-105',
  },
  {
    href: '/ask',
    label: 'ask a local',
    Icon: ChatIcon,
    color: 'bg-sky-light text-sky border-2 border-sky/30',
    hoverColor: 'group-hover:bg-sky group-hover:text-white group-hover:border-sky group-hover:scale-105',
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
                  'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm',
                  hub.color,
                  hub.hoverColor
                )}
              >
                <Icon />
              </div>
              <span className="text-xs font-semibold text-ink/70 group-hover:text-ink transition-colors text-center leading-tight">
                {hub.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
