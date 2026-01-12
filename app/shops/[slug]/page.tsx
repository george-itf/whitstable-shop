import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopHero from '@/components/shops/ShopHero';
import ShopActions from '@/components/shops/ShopActions';
import ShopHours from '@/components/shops/ShopHours';
import ShopContact from '@/components/shops/ShopContact';
import ShopReviews from '@/components/shops/ShopReviews';
import ShopMap from '@/components/shops/ShopMap';
import { Shop, Category, Review } from '@/types';
import { notFound } from 'next/navigation';

// Mock data - will be replaced with Supabase fetch
const mockShops: Record<string, Shop & { category: Category; reviews: Review[] }> = {
  'wheelers-oyster-bar': {
    id: '1',
    owner_id: null,
    name: 'Wheelers Oyster Bar',
    slug: 'wheelers-oyster-bar',
    tagline: "Whitstable's oldest oyster bar",
    description: 'Family-run since 1856, Wheelers has been serving the freshest oysters straight from Whitstable Bay for over 160 years. Our intimate setting and dedication to quality has made us a destination for seafood lovers from around the world.',
    category_id: '1',
    phone: '01227 273311',
    email: 'info@wheelersoysterbar.com',
    website: 'https://wheelersoysterbar.com',
    instagram: '@wheelersoysterbar',
    address_line1: '8 High Street',
    address_line2: null,
    postcode: 'CT5 1BQ',
    latitude: 51.3607,
    longitude: 1.0253,
    opening_hours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '09:00', close: '20:00' },
      sunday: { open: '10:00', close: '17:00' },
    },
    status: 'approved',
    is_featured: true,
    view_count: 1250,
    save_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '1',
      name: 'Oysters & Seafood',
      slug: 'oysters-seafood',
      icon: null,
      display_order: 1,
    },
    reviews: [
      {
        id: '1',
        shop_id: '1',
        user_id: null,
        author_name: 'Sarah',
        author_postcode: 'CT5',
        rating: 5,
        comment: 'Absolutely incredible oysters! The best I have ever had. The service was wonderful and the atmosphere so authentic.',
        status: 'approved',
        flagged_reason: null,
        ip_hash: null,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: '2',
        shop_id: '1',
        user_id: null,
        author_name: 'James',
        author_postcode: 'SE1',
        rating: 5,
        comment: 'Worth the trip from London! A true institution.',
        status: 'approved',
        flagged_reason: null,
        ip_hash: null,
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: '3',
        shop_id: '1',
        user_id: null,
        author_name: 'Emma',
        author_postcode: 'CT1',
        rating: 4,
        comment: 'Lovely experience. Can get busy so book ahead.',
        status: 'approved',
        flagged_reason: null,
        ip_hash: null,
        created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      },
    ],
  },
  'the-forge': {
    id: '2',
    owner_id: null,
    name: 'The Forge',
    slug: 'the-forge',
    tagline: 'Modern British dining',
    description: 'Contemporary restaurant focusing on locally-sourced ingredients and seasonal menus. Our chefs create innovative dishes that celebrate the best of Kent produce.',
    category_id: '3',
    phone: '01227 266510',
    email: null,
    website: null,
    instagram: '@theforgewhitstable',
    address_line1: '4 Harbour Street',
    address_line2: null,
    postcode: 'CT5 1AQ',
    latitude: 51.3610,
    longitude: 1.0260,
    opening_hours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' },
    },
    status: 'approved',
    is_featured: false,
    view_count: 980,
    save_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '3',
      name: 'Restaurant & Pub',
      slug: 'restaurant-pub',
      icon: null,
      display_order: 3,
    },
    reviews: [],
  },
  'harbour-books': {
    id: '3',
    owner_id: null,
    name: 'Harbour Books',
    slug: 'harbour-books',
    tagline: 'Independent bookshop',
    description: 'A carefully curated selection of new and second-hand books. We specialize in local history, maritime titles, and beach reads.',
    category_id: '8',
    phone: '01227 262844',
    email: null,
    website: null,
    instagram: '@harbourbookswhitstable',
    address_line1: '12 Harbour Street',
    address_line2: null,
    postcode: 'CT5 1AQ',
    latitude: 51.3608,
    longitude: 1.0255,
    opening_hours: {
      monday: { open: '09:30', close: '17:30' },
      tuesday: { open: '09:30', close: '17:30' },
      wednesday: { open: '09:30', close: '17:30' },
      thursday: { open: '09:30', close: '17:30' },
      friday: { open: '09:30', close: '17:30' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' },
    },
    status: 'approved',
    is_featured: false,
    view_count: 450,
    save_count: 34,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '8',
      name: 'Books & Records',
      slug: 'books-records',
      icon: null,
      display_order: 8,
    },
    reviews: [
      {
        id: '4',
        shop_id: '3',
        user_id: null,
        author_name: 'Tom',
        author_postcode: 'CT5',
        rating: 5,
        comment: 'My favourite bookshop. Always find something interesting.',
        status: 'approved',
        flagged_reason: null,
        ip_hash: null,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
  },
  'jojos': {
    id: '4',
    owner_id: null,
    name: "JoJo's",
    slug: 'jojos',
    tagline: 'Famous fish & chips',
    description: 'Award-winning fish and chips. We use only the freshest locally-caught fish, hand-cut chips, and our secret batter recipe.',
    category_id: '4',
    phone: '01227 274591',
    email: null,
    website: null,
    instagram: '@jojosfishandchips',
    address_line1: '2 Tankerton Road',
    address_line2: null,
    postcode: 'CT5 1AB',
    latitude: 51.3612,
    longitude: 1.0248,
    opening_hours: {
      monday: { open: '11:30', close: '20:00' },
      tuesday: { open: '11:30', close: '20:00' },
      wednesday: { open: '11:30', close: '20:00' },
      thursday: { open: '11:30', close: '20:00' },
      friday: { open: '11:30', close: '21:00' },
      saturday: { open: '11:00', close: '21:00' },
      sunday: { open: '12:00', close: '19:00' },
    },
    status: 'approved',
    is_featured: false,
    view_count: 2100,
    save_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '4',
      name: 'Fish & Chips / Takeaway',
      slug: 'fish-chips-takeaway',
      icon: null,
      display_order: 4,
    },
    reviews: [
      {
        id: '5',
        shop_id: '4',
        user_id: null,
        author_name: 'Sarah',
        author_postcode: 'CT5',
        rating: 5,
        comment: 'Best fish and chips in Kent! The queue is always worth it.',
        status: 'approved',
        flagged_reason: null,
        ip_hash: null,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '6',
        shop_id: '4',
        user_id: null,
        author_name: 'Mike',
        author_postcode: 'BR1',
        rating: 4,
        comment: 'Excellent fish, perfectly crispy batter.',
        status: 'approved',
        flagged_reason: null,
        ip_hash: null,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ],
  },
};

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const shop = mockShops[slug];

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
          <p className="text-sm text-grey-dark leading-relaxed">
            {shop.description}
          </p>
        </div>
      )}

      {/* Opening hours */}
      <ShopHours hours={shop.opening_hours} />

      {/* Contact info */}
      <ShopContact shop={shop} />

      {/* Reviews */}
      <ShopReviews
        reviews={shop.reviews}
        shopId={shop.id}
      />

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

export async function generateStaticParams() {
  return Object.keys(mockShops).map((slug) => ({ slug }));
}
