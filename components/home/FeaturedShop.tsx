'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { Shop } from '@/types';
import { cn } from '@/lib/utils';

interface FeaturedShopProps {
  shop: Pick<Shop, 'id' | 'name' | 'slug' | 'tagline' | 'description'> & {
    category_name?: string;
    image_url?: string;
  };
}

export default function FeaturedShop({ shop }: FeaturedShopProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="px-4 py-6">
      <h2 className="section-title mb-4">featured</h2>

      <Link href={`/shops/${shop.slug}`} className="block">
        <div className="card card-hover overflow-hidden">
          {/* Image */}
          <div className="relative h-40 bg-grey-light">
            {shop.image_url ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 skeleton" aria-hidden="true" />
                )}
                <Image
                  src={shop.image_url}
                  alt={shop.name}
                  fill
                  sizes="(max-width: 430px) 100vw, (max-width: 768px) 80vw, 600px"
                  priority
                  className={cn(
                    'object-cover transition-opacity duration-300',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-grey"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}

            {/* Featured badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="coral">featured</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {shop.category_name && (
              <p className="text-xs text-grey uppercase tracking-wide mb-1">
                {shop.category_name}
              </p>
            )}
            <h3 className="font-bold text-lg text-ink">{shop.name}</h3>
            {shop.tagline && (
              <p className="text-sm text-grey mt-1">{shop.tagline}</p>
            )}
            {shop.description && (
              <p className="text-sm text-grey-dark mt-2 line-clamp-2">
                {shop.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
