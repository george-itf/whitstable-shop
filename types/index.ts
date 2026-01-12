export interface Profile {
  id: string;
  email: string;
  name: string | null;
  postcode: string | null;
  role: 'visitor' | 'shop_owner' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
}

export interface Shop {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category_id: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: OpeningHours | null;
  status: 'pending' | 'approved' | 'rejected' | 'claimed';
  is_featured: boolean;
  view_count: number;
  save_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ShopImage[];
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

export interface Event {
  id: string;
  shop_id: string | null;
  title: string;
  description: string | null;
  date: string;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  shop?: Shop;
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
};

export type ShopWithDetails = Omit<Shop, 'category' | 'images'> & {
  category: Category | null;
  images: ShopImage[];
  reviews: Review[];
};
