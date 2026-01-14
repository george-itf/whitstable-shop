import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Calendar,
  Store,
  Info,
  Percent,
  MessageCircle,
  LucideIcon,
} from 'lucide-react';

interface Hub {
  href: string;
  label: string;
  Icon: LucideIcon;
  color: string;
  hoverColor: string;
}

const hubs: Hub[] = [
  {
    href: '/map',
    label: 'town map',
    Icon: MapPin,
    color: 'bg-sky-light text-sky border-2 border-sky/20',
    hoverColor: 'group-hover:bg-sky group-hover:text-white group-hover:border-sky group-hover:scale-105',
  },
  {
    href: '/events',
    label: "what's on",
    Icon: Calendar,
    color: 'bg-coral-light text-coral border-2 border-coral/20',
    hoverColor: 'group-hover:bg-coral group-hover:text-white group-hover:border-coral group-hover:scale-105',
  },
  {
    href: '/shops',
    label: 'browse shops',
    Icon: Store,
    color: 'bg-green-light text-green border-2 border-green/20',
    hoverColor: 'group-hover:bg-green group-hover:text-white group-hover:border-green group-hover:scale-105',
  },
  {
    href: '/info',
    label: 'local info',
    Icon: Info,
    color: 'bg-ink/5 text-ink/70 border-2 border-ink/10',
    hoverColor: 'group-hover:bg-ink group-hover:text-white group-hover:border-ink group-hover:scale-105',
  },
  {
    href: '/offers',
    label: 'deals',
    Icon: Percent,
    color: 'bg-coral-light text-coral border-2 border-coral/20',
    hoverColor: 'group-hover:bg-coral group-hover:text-white group-hover:border-coral group-hover:scale-105',
  },
  {
    href: '/ask',
    label: 'ask a local',
    Icon: MessageCircle,
    color: 'bg-sky-light text-sky border-2 border-sky/20',
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
                <Icon className="w-6 h-6" strokeWidth={2} />
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
