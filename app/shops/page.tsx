import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import ShopList from '@/components/shops/ShopList';
import { Category } from '@/types';

// Mock data - will be replaced with Supabase data
const mockCategories: Category[] = [
  { id: '1', name: 'Oysters & Seafood', slug: 'oysters-seafood', icon: null, display_order: 1 },
  { id: '2', name: 'Café & Coffee', slug: 'cafe-coffee', icon: null, display_order: 2 },
  { id: '3', name: 'Restaurant & Pub', slug: 'restaurant-pub', icon: null, display_order: 3 },
  { id: '4', name: 'Fish & Chips', slug: 'fish-chips-takeaway', icon: null, display_order: 4 },
  { id: '5', name: 'Gallery & Art', slug: 'gallery-art', icon: null, display_order: 5 },
  { id: '6', name: 'Boutique', slug: 'boutique-fashion', icon: null, display_order: 6 },
];

const mockShops = [
  {
    id: '1',
    owner_id: null,
    name: 'Wheelers Oyster Bar',
    slug: 'wheelers-oyster-bar',
    tagline: 'Whitstable\'s oldest oyster bar',
    description: 'Family-run since 1856',
    category_id: '1',
    phone: '01234 567890',
    email: null,
    website: null,
    instagram: '@wheelers',
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
    status: 'approved' as const,
    is_featured: true,
    view_count: 1250,
    save_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: '2',
    owner_id: null,
    name: 'The Forge',
    slug: 'the-forge',
    tagline: 'Modern British dining',
    description: 'Contemporary restaurant',
    category_id: '3',
    phone: '01234 567891',
    email: null,
    website: null,
    instagram: '@theforge',
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
    status: 'approved' as const,
    is_featured: false,
    view_count: 980,
    save_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
  {
    id: '3',
    owner_id: null,
    name: 'Harbour Books',
    slug: 'harbour-books',
    tagline: 'Independent bookshop',
    description: 'Curated selection of books',
    category_id: '8',
    phone: '01234 567892',
    email: null,
    website: null,
    instagram: '@harbourbooks',
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
    status: 'approved' as const,
    is_featured: false,
    view_count: 450,
    save_count: 34,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '8', name: 'Books & Records', slug: 'books-records', icon: null, display_order: 8 },
  },
  {
    id: '4',
    owner_id: null,
    name: 'JoJo\'s',
    slug: 'jojos',
    tagline: 'Famous fish & chips',
    description: 'Award-winning fish and chips',
    category_id: '4',
    phone: '01234 567893',
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
    status: 'approved' as const,
    is_featured: false,
    view_count: 2100,
    save_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3],
  },
];

export default function ShopsPage() {
  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white">
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">shops</h1>
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-3 border-b border-grey-light overflow-x-auto hide-scrollbar">
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          <CategoryPill active>All</CategoryPill>
          {mockCategories.map((cat) => (
            <CategoryPill key={cat.id}>{cat.name}</CategoryPill>
          ))}
        </div>
      </div>

      {/* Shop count */}
      <div className="px-4 py-3">
        <p className="text-sm text-grey">{mockShops.length} shops</p>
      </div>

      {/* Shop list */}
      <div className="px-4 pb-6">
        <ShopList shops={mockShops} />
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

function CategoryPill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-sky text-white'
          : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
      }`}
    >
      {children}
    </button>
  );
}
