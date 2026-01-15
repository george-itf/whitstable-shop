// NOTE: This Profile interface is deprecated. Use types from types/database.ts instead.
// Kept for backwards compatibility during migration.
export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null; // Renamed from 'name' to match database schema
  bio: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'moderator'; // Aligned with canonical database schema
  is_public: boolean;
  is_local: boolean;
  joined_at: string; // Renamed from 'created_at' to match database schema
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
}

// NOTE: This Shop interface is deprecated. Use types from types/database.ts instead.
// Kept for backwards compatibility during migration.
// Canonical schema uses 'address' and 'street' fields, not 'address_line1/address_line2'
export interface Shop {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string; // Category name (for backwards compat)
  category_id: string | null;
  subcategory: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null; // Canonical field name
  street: string | null; // Canonical field name
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  opening_hours: OpeningHours | null;
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  is_verified: boolean;
  is_featured: boolean;
  view_count: number;
  save_count: number;
  review_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface ShopImage {
  id: string;
  shop_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  shop_id: string;
  user_id: string | null;
  author_name: string;
  author_postcode: string;
  rating: number;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  flagged_reason: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface Save {
  id: string;
  user_id: string;
  shop_id: string;
  created_at: string;
}

// NOTE: This Event interface is deprecated. Use types from types/database.ts instead.
// Canonical schema uses 'start_date/end_date' and 'start_time/end_time', not 'date/time_start/time_end'
export interface Event {
  id: string;
  shop_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  start_date: string; // Canonical field name
  end_date: string | null; // Canonical field name
  start_time: string | null; // Canonical field name
  end_time: string | null; // Canonical field name
  is_recurring: boolean;
  recurrence_rule: string | null;
  location: string | null;
  venue: string | null;
  price: string | null;
  booking_url: string | null;
  image_url: string | null;
  category: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalInfo {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  icon: string | null;
  display_order: number;
  updated_at: string;
}

export interface Notice {
  id: string;
  message: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface ShopView {
  id: string;
  shop_id: string;
  viewed_at: string;
  session_id: string | null;
}

export type ShopWithCategory = Omit<Shop, 'category'> & {
  category: Category | null;
  images?: Pick<ShopImage, 'url' | 'is_primary'>[];
};

export type ShopWithDetails = Omit<Shop, 'category' | 'images'> & {
  category: Category | null;
  images: ShopImage[];
  reviews: Review[];
};
