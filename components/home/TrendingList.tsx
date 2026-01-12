import Link from 'next/link';
import { Shop } from '@/types';

interface TrendingShop extends Pick<Shop, 'id' | 'name' | 'slug'> {
  reason: string;
  category_name?: string;
}

interface TrendingListProps {
  shops: TrendingShop[];
}

export default function TrendingList({ shops }: TrendingListProps) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">trending this week</h2>
        <Link
          href="/shops?sort=trending"
          className="text-sky text-sm font-medium"
        >
          see all
        </Link>
      </div>

      <div className="space-y-3">
        {shops.map((shop, index) => (
          <Link
            key={shop.id}
            href={`/shops/${shop.slug}`}
            className="card card-hover p-3 flex items-center gap-3"
          >
            {/* Rank number */}
            <div className="w-8 h-8 rounded-full bg-sky-light text-sky font-bold text-sm flex items-center justify-center">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink truncate">{shop.name}</h3>
              <p className="text-sm text-grey truncate">{shop.reason}</p>
            </div>

            {/* Arrow */}
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
              className="text-grey-light"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
