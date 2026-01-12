/**
 * Database Seed Script for whitstable.shop
 *
 * Run with: npx tsx database/seed.ts
 *
 * Prerequisites:
 * - .env.local file with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * - Database tables created via migrations
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =============================================================================
// SEED DATA
// =============================================================================

const categories = [
  { name: 'Oysters & Seafood', slug: 'oysters-seafood', icon: '🦪', color: '#F97316', sort_order: 1 },
  { name: 'Café & Coffee', slug: 'cafe-coffee', icon: '☕', color: '#8B5CF6', sort_order: 2 },
  { name: 'Restaurant & Pub', slug: 'restaurant-pub', icon: '🍽️', color: '#EF4444', sort_order: 3 },
  { name: 'Fish & Chips / Takeaway', slug: 'fish-chips-takeaway', icon: '🍟', color: '#F59E0B', sort_order: 4 },
  { name: 'Bakery & Deli', slug: 'bakery-deli', icon: '🥐', color: '#EC4899', sort_order: 5 },
  { name: 'Ice Cream & Sweets', slug: 'ice-cream-sweets', icon: '🍦', color: '#06B6D4', sort_order: 6 },
  { name: 'Books & Records', slug: 'books-records', icon: '📚', color: '#6366F1', sort_order: 7 },
  { name: 'Art & Galleries', slug: 'art-galleries', icon: '🎨', color: '#14B8A6', sort_order: 8 },
  { name: 'Fashion & Vintage', slug: 'fashion-vintage', icon: '👗', color: '#D946EF', sort_order: 9 },
  { name: 'Home & Gifts', slug: 'home-gifts', icon: '🏠', color: '#84CC16', sort_order: 10 },
  { name: 'Health & Beauty', slug: 'health-beauty', icon: '💆', color: '#F472B6', sort_order: 11 },
  { name: 'Services', slug: 'services', icon: '🔧', color: '#64748B', sort_order: 12 },
];

const shops = [
  {
    name: 'Wheelers Oyster Bar',
    slug: 'wheelers-oyster-bar',
    tagline: "Whitstable's oldest oyster bar",
    description:
      'Family-run since 1856, Wheelers has been serving the freshest oysters straight from Whitstable Bay for over 160 years. Our intimate setting and dedication to quality has made us a destination for seafood lovers from around the world.',
    category_slug: 'oysters-seafood',
    phone: '01227 273311',
    email: 'info@wheelersoysterbar.com',
    website: 'https://wheelersoysterbar.com',
    instagram: '@wheelersoysterbar',
    address_line1: '8 High Street',
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
  },
  {
    name: 'The Forge',
    slug: 'the-forge',
    tagline: 'Modern British dining',
    description:
      'Contemporary restaurant focusing on locally-sourced ingredients and seasonal menus. Our chefs create innovative dishes that celebrate the best of Kent produce.',
    category_slug: 'restaurant-pub',
    phone: '01227 266510',
    instagram: '@theforgewhitstable',
    address_line1: '4 Harbour Street',
    postcode: 'CT5 1AQ',
    latitude: 51.361,
    longitude: 1.026,
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
  },
  {
    name: 'Harbour Books',
    slug: 'harbour-books',
    tagline: 'Independent bookshop',
    description:
      'A carefully curated selection of new and second-hand books. We specialize in local history, maritime titles, and beach reads.',
    category_slug: 'books-records',
    phone: '01227 262844',
    instagram: '@harbourbookswhitstable',
    address_line1: '12 Harbour Street',
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
  },
  {
    name: "JoJo's",
    slug: 'jojos',
    tagline: 'Famous fish & chips',
    description:
      'Award-winning fish and chips. We use only the freshest locally-caught fish, hand-cut chips, and our secret batter recipe.',
    category_slug: 'fish-chips-takeaway',
    phone: '01227 274591',
    instagram: '@jojosfishandchips',
    address_line1: '2 Tankerton Road',
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
  },
  {
    name: 'The Cheese Box',
    slug: 'the-cheese-box',
    tagline: 'Artisan cheeses & fine foods',
    description:
      'Specialist cheese shop offering the finest British and European cheeses, along with charcuterie, olives, and artisan foods.',
    category_slug: 'bakery-deli',
    phone: '01227 273888',
    address_line1: '15 Harbour Street',
    postcode: 'CT5 1AG',
    latitude: 51.3609,
    longitude: 1.0258,
    opening_hours: {
      monday: { open: '09:00', close: '17:30' },
      tuesday: { open: '09:00', close: '17:30' },
      wednesday: { open: '09:00', close: '17:30' },
      thursday: { open: '09:00', close: '17:30' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' },
    },
    status: 'approved',
    is_featured: false,
  },
  {
    name: 'Frank',
    slug: 'frank',
    tagline: 'Coffee & community',
    description: 'Independent coffee shop serving specialty coffee, homemade cakes, and light lunches. A community hub for locals.',
    category_slug: 'cafe-coffee',
    phone: '01227 770123',
    instagram: '@frankcoffeewhitstable',
    address_line1: '3 Oxford Street',
    postcode: 'CT5 1DB',
    latitude: 51.3615,
    longitude: 1.0245,
    opening_hours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '08:30', close: '17:30' },
      sunday: { open: '09:00', close: '16:00' },
    },
    status: 'approved',
    is_featured: false,
  },
  {
    name: 'Windy Corner Stores',
    slug: 'windy-corner-stores',
    tagline: 'Local produce & deli',
    description: 'Farm shop and deli selling local Kent produce, fresh bread, and everyday essentials.',
    category_slug: 'bakery-deli',
    phone: '01227 263456',
    address_line1: '18 Harbour Street',
    postcode: 'CT5 1AQ',
    latitude: 51.361,
    longitude: 1.0262,
    opening_hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '09:00', close: '16:00' },
    },
    status: 'approved',
    is_featured: false,
  },
];

const reviews = [
  {
    shop_slug: 'wheelers-oyster-bar',
    author_name: 'Sarah',
    author_postcode: 'CT5',
    rating: 5,
    comment:
      'Absolutely incredible oysters! The best I have ever had. The service was wonderful and the atmosphere so authentic.',
  },
  {
    shop_slug: 'wheelers-oyster-bar',
    author_name: 'James',
    author_postcode: 'SE1',
    rating: 5,
    comment: 'Worth the trip from London! A true institution.',
  },
  {
    shop_slug: 'wheelers-oyster-bar',
    author_name: 'Emma',
    author_postcode: 'CT1',
    rating: 4,
    comment: 'Lovely experience. Can get busy so book ahead.',
  },
  {
    shop_slug: 'harbour-books',
    author_name: 'Tom',
    author_postcode: 'CT5',
    rating: 5,
    comment: 'My favourite bookshop. Always find something interesting.',
  },
  {
    shop_slug: 'jojos',
    author_name: 'Sarah',
    author_postcode: 'CT5',
    rating: 5,
    comment: 'Best fish and chips in Kent! The queue is always worth it.',
  },
  {
    shop_slug: 'jojos',
    author_name: 'Mike',
    author_postcode: 'BR1',
    rating: 4,
    comment: 'Excellent fish, perfectly crispy batter.',
  },
];

const events = [
  {
    title: 'Oyster Festival Opening',
    description:
      'The annual celebration of Whitstable oysters returns! Join us for live music, oyster shucking competitions, and the freshest seafood from local suppliers.',
    date: '2025-07-26',
    time_start: '10:00',
    time_end: '18:00',
    location: 'Whitstable Harbour',
    is_recurring: false,
    status: 'approved',
  },
  {
    title: 'Oyster Festival Day 2',
    description: 'The festivities continue with more music, food, and fun for the whole family.',
    date: '2025-07-27',
    time_start: '10:00',
    time_end: '20:00',
    location: 'Whitstable Harbour',
    is_recurring: false,
    status: 'approved',
  },
  {
    title: 'Live Music at The Old Neptune',
    description: 'Weekly live music night featuring local bands and artists. Free entry, great atmosphere.',
    date: '2025-07-28',
    time_start: '19:00',
    time_end: '22:00',
    location: 'The Old Neptune',
    is_recurring: true,
    recurrence_rule: 'weekly',
    status: 'approved',
  },
  {
    title: 'Art Walk',
    description: 'Monthly gallery trail through Whitstable. Visit local galleries and meet the artists.',
    date: '2025-08-02',
    time_start: '14:00',
    time_end: '17:00',
    location: 'Town Centre',
    is_recurring: true,
    recurrence_rule: 'monthly',
    status: 'approved',
  },
  {
    title: 'Beach Clean',
    description: 'Join the community beach clean. Equipment provided. Refreshments afterwards.',
    date: '2025-08-09',
    time_start: '09:00',
    time_end: '11:00',
    location: 'West Beach',
    is_recurring: true,
    recurrence_rule: 'monthly',
    status: 'approved',
  },
  {
    title: 'Farmers Market',
    description: 'Weekly farmers market with local produce, artisan foods, and handmade crafts.',
    date: '2025-08-10',
    time_start: '09:00',
    time_end: '14:00',
    location: 'Oxford Street',
    is_recurring: true,
    recurrence_rule: 'weekly',
    status: 'approved',
  },
];

const charities = [
  {
    name: 'Whitstable Lifeboat Station (RNLI)',
    slug: 'rnli-whitstable',
    description:
      'The Royal National Lifeboat Institution saves lives at sea. Our Whitstable lifeboat crew are on call 24/7, 365 days a year.',
    website: 'https://rnli.org/find-my-nearest/lifeboat-stations/whitstable-lifeboat-station',
    donation_url: 'https://rnli.org/support-us/donate',
    current_campaign: '2025 Lifeboat Fund',
    target_amount: 10000,
    raised_amount: 6250,
    is_featured: true,
  },
  {
    name: 'Pilgrims Hospices',
    slug: 'pilgrims-hospices',
    description: 'Providing expert, compassionate care for people living with an incurable illness.',
    website: 'https://pilgrimshospices.org',
    donation_url: 'https://pilgrimshospices.org/donate',
    is_featured: false,
  },
  {
    name: 'Whitstable Community Museum',
    slug: 'whitstable-museum',
    description: "Preserving and sharing Whitstable's rich maritime heritage and local history.",
    website: 'https://whitstablemuseum.org',
    current_campaign: 'Heritage Preservation Fund',
    target_amount: 5000,
    raised_amount: 2100,
    is_featured: false,
  },
  {
    name: 'Surfers Against Sewage',
    slug: 'surfers-against-sewage',
    description: "Protecting the UK's beaches and ocean for everyone to enjoy.",
    website: 'https://sas.org.uk',
    donation_url: 'https://sas.org.uk/donate',
    is_featured: false,
  },
];

const charityEvents = [
  {
    charity_slug: 'surfers-against-sewage',
    title: 'Winter Beach Cleanup',
    description: 'Join us for our monthly beach cleanup. All equipment provided!',
    date: '2025-01-18',
    time_start: '10:00',
    time_end: '12:00',
    location: 'West Beach Car Park',
    signup_url: 'https://example.com/signup',
    max_participants: 30,
    current_participants: 22,
    event_type: 'cleanup',
  },
  {
    charity_slug: 'rnli-whitstable',
    title: 'Lifeboat Station Open Day',
    description: 'Meet the crew, see the lifeboat, and learn about sea safety.',
    date: '2025-01-25',
    time_start: '11:00',
    time_end: '15:00',
    location: 'Whitstable Lifeboat Station',
    event_type: 'awareness',
  },
  {
    charity_slug: 'pilgrims-hospices',
    title: 'Charity Quiz Night',
    description: 'Test your knowledge and raise money for Pilgrims Hospices.',
    date: '2025-02-01',
    time_start: '19:00',
    location: 'The Old Neptune',
    signup_url: 'https://example.com/quiz',
    max_participants: 60,
    current_participants: 48,
    event_type: 'fundraiser',
  },
];

const offers = [
  {
    shop_slug: 'wheelers-oyster-bar',
    title: '10% off Tuesday lunches',
    description: 'Enjoy 10% off your bill when you visit us for lunch on Tuesdays. Perfect for a mid-week treat!',
    valid_from: '2025-01-01',
    valid_until: '2025-03-31',
    is_ongoing: false,
    terms: 'Not valid with other offers. Lunch service only.',
    offer_type: 'discount',
  },
  {
    shop_slug: 'the-cheese-box',
    title: 'Free cheese tasting with any purchase over £20',
    description: 'Sample our artisan cheese selection when you spend £20 or more in store.',
    valid_from: '2025-01-01',
    is_ongoing: true,
    terms: 'Subject to availability.',
    offer_type: 'freebie',
  },
  {
    shop_slug: 'jojos',
    title: 'Kids eat free on Sundays',
    description: 'One free kids meal with every adult main course ordered. Perfect for family Sunday lunch!',
    valid_from: '2025-01-01',
    is_ongoing: true,
    terms: 'One child per paying adult. Under 12s only.',
    offer_type: 'freebie',
  },
  {
    shop_slug: 'harbour-books',
    title: 'Buy 2, get 3rd book half price',
    description: 'Build your reading list and save! Buy any two books and get your third at 50% off.',
    valid_from: '2025-01-01',
    valid_until: '2025-01-31',
    is_ongoing: false,
    terms: 'Cheapest book discounted. Excludes special editions.',
    offer_type: 'bundle',
  },
  {
    shop_slug: 'frank',
    title: 'Loyalty card - 9th drink free',
    description: 'Pick up a loyalty card and get your 9th hot drink absolutely free!',
    valid_from: '2024-01-01',
    is_ongoing: true,
    terms: 'One stamp per visit. Card must be presented.',
    offer_type: 'loyalty',
  },
  {
    shop_slug: 'windy-corner-stores',
    title: '15% off local produce Thursdays',
    description: 'Support local producers and save! All local Kent produce 15% off every Thursday.',
    valid_from: '2025-01-01',
    is_ongoing: true,
    terms: 'Local produce section only.',
    offer_type: 'discount',
  },
];

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

async function seedCategories() {
  console.log('Seeding categories...');

  const { data, error } = await supabase.from('categories').upsert(categories, {
    onConflict: 'slug',
  });

  if (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }

  console.log(`✓ Seeded ${categories.length} categories`);
}

async function seedShops() {
  console.log('Seeding shops...');

  // Get category IDs
  const { data: categoryData } = await supabase.from('categories').select('id, slug');
  const categoryMap = new Map(categoryData?.map((c) => [c.slug, c.id]) || []);

  const shopsToInsert = shops.map((shop) => ({
    name: shop.name,
    slug: shop.slug,
    tagline: shop.tagline,
    description: shop.description,
    category_id: categoryMap.get(shop.category_slug),
    phone: shop.phone || null,
    email: shop.email || null,
    website: shop.website || null,
    instagram: shop.instagram || null,
    address_line1: shop.address_line1,
    postcode: shop.postcode,
    latitude: shop.latitude,
    longitude: shop.longitude,
    opening_hours: shop.opening_hours,
    status: shop.status,
    is_featured: shop.is_featured,
  }));

  const { error } = await supabase.from('shops').upsert(shopsToInsert, {
    onConflict: 'slug',
  });

  if (error) {
    console.error('Error seeding shops:', error);
    throw error;
  }

  console.log(`✓ Seeded ${shops.length} shops`);
}

async function seedReviews() {
  console.log('Seeding reviews...');

  // Get shop IDs
  const { data: shopData } = await supabase.from('shops').select('id, slug');
  const shopMap = new Map(shopData?.map((s) => [s.slug, s.id]) || []);

  const reviewsToInsert = reviews.map((review) => ({
    shop_id: shopMap.get(review.shop_slug),
    author_name: review.author_name,
    author_postcode: review.author_postcode,
    rating: review.rating,
    comment: review.comment,
    status: 'approved',
  }));

  const { error } = await supabase.from('reviews').insert(reviewsToInsert);

  if (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }

  console.log(`✓ Seeded ${reviews.length} reviews`);
}

async function seedEvents() {
  console.log('Seeding events...');

  const { error } = await supabase.from('events').insert(events);

  if (error) {
    console.error('Error seeding events:', error);
    throw error;
  }

  console.log(`✓ Seeded ${events.length} events`);
}

async function seedCharities() {
  console.log('Seeding charities...');

  const charitiesToInsert = charities.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    website: c.website || null,
    donation_url: c.donation_url || null,
    current_campaign: c.current_campaign || null,
    target_amount: c.target_amount || null,
    raised_amount: c.raised_amount || 0,
    is_featured: c.is_featured,
    is_active: true,
  }));

  const { error } = await supabase.from('charities').upsert(charitiesToInsert, {
    onConflict: 'slug',
  });

  if (error) {
    console.error('Error seeding charities:', error);
    throw error;
  }

  console.log(`✓ Seeded ${charities.length} charities`);
}

async function seedCharityEvents() {
  console.log('Seeding charity events...');

  // Get charity IDs
  const { data: charityData } = await supabase.from('charities').select('id, slug');
  const charityMap = new Map(charityData?.map((c) => [c.slug, c.id]) || []);

  const eventsToInsert = charityEvents.map((event) => ({
    charity_id: charityMap.get(event.charity_slug),
    title: event.title,
    description: event.description,
    date: event.date,
    time_start: event.time_start,
    time_end: event.time_end || null,
    location: event.location,
    signup_url: event.signup_url || null,
    max_participants: event.max_participants || null,
    current_participants: event.current_participants || 0,
    event_type: event.event_type,
    is_active: true,
  }));

  const { error } = await supabase.from('charity_events').insert(eventsToInsert);

  if (error) {
    console.error('Error seeding charity events:', error);
    throw error;
  }

  console.log(`✓ Seeded ${charityEvents.length} charity events`);
}

async function seedOffers() {
  console.log('Seeding offers...');

  // Get shop IDs
  const { data: shopData } = await supabase.from('shops').select('id, slug');
  const shopMap = new Map(shopData?.map((s) => [s.slug, s.id]) || []);

  const offersToInsert = offers.map((offer) => ({
    shop_id: shopMap.get(offer.shop_slug),
    title: offer.title,
    description: offer.description,
    valid_from: offer.valid_from,
    valid_until: offer.valid_until || null,
    is_ongoing: offer.is_ongoing,
    terms: offer.terms || null,
    offer_type: offer.offer_type,
    is_active: true,
  }));

  const { error } = await supabase.from('offers').insert(offersToInsert);

  if (error) {
    console.error('Error seeding offers:', error);
    throw error;
  }

  console.log(`✓ Seeded ${offers.length} offers`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    await seedCategories();
    await seedShops();
    await seedReviews();
    await seedEvents();
    await seedCharities();
    await seedCharityEvents();
    await seedOffers();

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`  - ${categories.length} categories`);
    console.log(`  - ${shops.length} shops`);
    console.log(`  - ${reviews.length} reviews`);
    console.log(`  - ${events.length} events`);
    console.log(`  - ${charities.length} charities`);
    console.log(`  - ${charityEvents.length} charity events`);
    console.log(`  - ${offers.length} offers`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
