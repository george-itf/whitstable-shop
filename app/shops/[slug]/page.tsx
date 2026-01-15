import { notFound } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopHero from '@/components/shops/ShopHero';
import ShopActions from '@/components/shops/ShopActions';
import ShopHours from '@/components/shops/ShopHours';
import ShopContact from '@/components/shops/ShopContact';
import ShopReviews from '@/components/shops/ShopReviews';
import ShopMap from '@/components/shops/ShopMap';
import { createClient } from '@/lib/supabase/server';

interface ShopPageProps {
  params: { slug: string };
}

async function getShop(slug: string) {
  const supabase = await createClient();

  // Fetch shop with category
  const { data: shop, error } = await supabase
    .from('shops')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (error || !shop) {
    return null;
  }

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);

  // Increment view count atomically (don't await, fire and forget)
  supabase
    .rpc('increment_view_count', { p_shop_id: shop.id })
    .then(() => {});

  return {
    ...shop,
    reviews: reviews || [],
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = params;
  const shop = await getShop(slug);

  if (!shop) {
    notFound();
  }

  return (
    <MobileWrapper>
      {/* Hero */}
      <ShopHero shop={shop} category={shop.category} />

      {/* Action buttons */}
      <ShopActions shop={shop} />

      {/* About */}
      {shop.description && (
        <div className="px-4 py-4 border-b border-grey-light">
          <h2 className="font-bold text-ink mb-2">about</h2>
          <p className="text-sm text-grey-dark leading-relaxed">{shop.description}</p>
        </div>
      )}

      {/* Opening hours */}
      <ShopHours hours={shop.opening_hours} />

      {/* Contact info */}
      <ShopContact shop={shop} />

      {/* Reviews */}
      <ShopReviews reviews={shop.reviews} shopId={shop.id} />

      {/* Map */}
      <ShopMap shop={shop} />

      {/* Sticky footer */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-white border-t border-grey-light">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-grey-light rounded-button font-semibold text-ink">
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            save
          </button>
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky rounded-button font-semibold text-white"
            >
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              call
            </a>
          )}
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

export async function generateMetadata({ params }: ShopPageProps) {
  const shop = await getShop(params.slug);

  if (!shop) {
    return { title: 'Shop not found' };
  }

  return {
    title: `${shop.name} | Whitstable.shop`,
    description: shop.tagline || shop.description?.slice(0, 160),
  };
}
