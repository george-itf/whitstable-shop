import Link from 'next/link';
import { MapPin, Calendar, Store, Info, Tag, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const hubs = [
  // Row 1: Core discovery
  {
    href: '/map',
    label: 'map',
    icon: MapPin,
    color: 'bg-sky-light text-sky',
    hoverColor: 'group-hover:bg-sky group-hover:text-white',
  },
  {
    href: '/events',
    label: "what's on",
    icon: Calendar,
    color: 'bg-coral-light text-coral',
    hoverColor: 'group-hover:bg-coral group-hover:text-white',
  },
  {
    href: '/shops',
    label: 'shops',
    icon: Store,
    color: 'bg-green-light text-green',
    hoverColor: 'group-hover:bg-green group-hover:text-white',
  },
  // Row 2: Engagement
  {
    href: '/info',
    label: 'local info',
    icon: Info,
    color: 'bg-yellow-light text-yellow',
    hoverColor: 'group-hover:bg-yellow group-hover:text-white',
  },
  {
    href: '/offers',
    label: 'deals',
    icon: Tag,
    color: 'bg-coral-light text-coral',
    hoverColor: 'group-hover:bg-coral group-hover:text-white',
  },
  {
    href: '/ask',
    label: 'ask locals',
    icon: MessageCircle,
    color: 'bg-sky-light text-sky',
    hoverColor: 'group-hover:bg-sky group-hover:text-white',
  },
];

export default function HubButtons() {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          return (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex flex-col items-center gap-2 tap-effect"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
                  hub.color,
                  hub.hoverColor
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-ink group-hover:text-grey-dark transition-colors">
                {hub.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
