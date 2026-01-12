import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FeedItem {
  id: string;
  type: 'tide' | 'new_shop' | 'review';
  title: string;
  description: string;
  link?: string;
  timestamp?: string;
}

interface FeedListProps {
  items: FeedItem[];
}

const typeConfig = {
  tide: {
    icon: (
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
      >
        <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2z" />
      </svg>
    ),
    color: 'bg-sky-light text-sky',
  },
  new_shop: {
    icon: (
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
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: 'bg-green-light text-green',
  },
  review: {
    icon: (
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
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: 'bg-yellow/10 text-yellow',
  },
};

export default function FeedList({ items }: FeedListProps) {
  return (
    <div className="px-4 py-6">
      <h2 className="section-title mb-4">local feed</h2>

      <div className="space-y-3">
        {items.map((item) => {
          const config = typeConfig[item.type];
          const content = (
            <div className="card p-3 flex items-start gap-3">
              {/* Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  config.color
                )}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink text-sm">{item.title}</h3>
                <p className="text-xs text-grey mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Arrow if has link */}
              {item.link && (
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
                  className="text-grey-light flex-shrink-0 mt-1"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          );

          if (item.link) {
            return (
              <Link key={item.id} href={item.link} className="block card-hover">
                {content}
              </Link>
            );
          }

          return <div key={item.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
