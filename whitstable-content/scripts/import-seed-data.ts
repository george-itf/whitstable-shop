/**
 * Seed Data Import Script for whitstable.shop
 *
 * This script imports all seed data into Supabase in the correct order.
 * It's idempotent — can be run multiple times without duplicating data.
 *
 * Usage:
 *   npx ts-node scripts/import-seed-data.ts
 *
 * Environment variables required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (not anon key!)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SEED_DATA_PATH = path.join(__dirname, '../seed-data');

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables');
  console.error('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper functions
function readJsonFile<T>(filename: string): T {
  const filepath = path.join(SEED_DATA_PATH, filename);
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content) as T;
}

function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function logError(message: string, error: unknown) {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
  console.error(error);
}

// Type definitions for seed data
interface ShopSeed {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  address_line1: string;
  postcode: string;
  latitude: number;
  longitude: number;
  price_level?: number;
  opening_hours: Record<string, unknown>;
}

interface ReviewSeed {
  shop_slug: string;
  author_name: string;
  author_postcode: string;
  rating: number;
  comment: string;
}

interface EventSeed {
  title: string;
  description: string;
  date: string;
  time_start: string;
  time_end: string;
  location: string;
  shop_slug: string | null;
}

interface NoticeSeed {
  message: string;
  is_active: boolean;
  expires_at: string | null;
}

interface MapMarkerSeed {
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  notes: string;
}

// Category mapping (slug to display name)
const CATEGORIES: Record<string, string> = {
  'oysters-seafood': 'Oysters & Seafood',
  'cafe-coffee': 'Café & Coffee',
  'restaurant-pub': 'Restaurant & Pub',
  'fish-chips': 'Fish & Chips',
  'gallery-art': 'Gallery & Art',
  'books': 'Books',
  'deli': 'Deli',
  'boutique': 'Boutique',
  'antiques': 'Antiques',
  'market': 'Market',
  'bakery': 'Bakery',
  'service': 'Service',
  'attraction': 'Attraction'
};

// Import functions
async function importCategories(): Promise<Map<string, string>> {
  log('Importing categories...');

  const categoryMap = new Map<string, string>();

  for (const [slug, name] of Object.entries(CATEGORIES)) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(
        { slug, name },
        { onConflict: 'slug', ignoreDuplicates: false }
      )
      .select('id')
      .single();

    if (error) {
      logError(`Failed to upsert category ${slug}`, error);
      continue;
    }

    categoryMap.set(slug, data.id);
    log(`  ✓ Category: ${name}`);
  }

  log(`Imported ${categoryMap.size} categories`);
  return categoryMap;
}

async function importShops(categoryMap: Map<string, string>): Promise<Map<string, string>> {
  log('Importing shops...');

  const shops = readJsonFile<ShopSeed[]>('shops.json');
  const shopMap = new Map<string, string>();
  let successCount = 0;
  let errorCount = 0;

  for (const shop of shops) {
    const categoryId = categoryMap.get(shop.category);

    if (!categoryId) {
      logError(`Unknown category ${shop.category} for shop ${shop.name}`, null);
      errorCount++;
      continue;
    }

    const shopData = {
      name: shop.name,
      slug: shop.slug,
      tagline: shop.tagline,
      description: shop.description,
      category: categoryId,
      phone: shop.phone,
      website: shop.website,
      instagram: shop.instagram,
      address_line1: shop.address_line1,
      postcode: shop.postcode,
      latitude: shop.latitude,
      longitude: shop.longitude,
      price_level: shop.price_level || 2,
      opening_hours: shop.opening_hours,
      status: 'approved',
      view_count: Math.floor(Math.random() * 500) + 50, // Random initial views
      trending_score: Math.random() * 100 // Random initial trending score
    };

    const { data, error } = await supabase
      .from('shops')
      .upsert(shopData, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id')
      .single();

    if (error) {
      logError(`Failed to upsert shop ${shop.name}`, error);
      errorCount++;
      continue;
    }

    shopMap.set(shop.slug, data.id);
    successCount++;
  }

  log(`Imported ${successCount} shops (${errorCount} errors)`);
  return shopMap;
}

async function importReviews(shopMap: Map<string, string>): Promise<void> {
  log('Importing reviews...');

  const reviews = readJsonFile<ReviewSeed[]>('reviews.json');
  let successCount = 0;
  let errorCount = 0;

  for (const review of reviews) {
    const shopId = shopMap.get(review.shop_slug);

    if (!shopId) {
      logError(`Unknown shop ${review.shop_slug} for review`, null);
      errorCount++;
      continue;
    }

    const reviewData = {
      shop_id: shopId,
      author_name: review.author_name,
      author_postcode: review.author_postcode,
      rating: review.rating,
      comment: review.comment,
      status: 'approved',
      created_at: getRandomPastDate(90) // Random date within last 90 days
    };

    const { error } = await supabase
      .from('reviews')
      .insert(reviewData);

    if (error) {
      // Might be duplicate, try to continue
      if (error.code === '23505') {
        // Unique violation - skip
        continue;
      }
      logError(`Failed to insert review for ${review.shop_slug}`, error);
      errorCount++;
      continue;
    }

    successCount++;
  }

  log(`Imported ${successCount} reviews (${errorCount} errors)`);
}

async function importEvents(shopMap: Map<string, string>): Promise<void> {
  log('Importing events...');

  const events = readJsonFile<EventSeed[]>('events.json');
  let successCount = 0;
  let errorCount = 0;

  for (const event of events) {
    const shopId = event.shop_slug ? shopMap.get(event.shop_slug) : null;

    const eventData = {
      title: event.title,
      description: event.description,
      date: event.date,
      time_start: event.time_start,
      time_end: event.time_end,
      location: event.location,
      shop_id: shopId,
      status: 'approved'
    };

    const { error } = await supabase
      .from('events')
      .upsert(eventData, {
        onConflict: 'title,date',
        ignoreDuplicates: true
      });

    if (error) {
      logError(`Failed to upsert event ${event.title}`, error);
      errorCount++;
      continue;
    }

    successCount++;
  }

  log(`Imported ${successCount} events (${errorCount} errors)`);
}

async function importNotices(): Promise<void> {
  log('Importing notices...');

  const notices = readJsonFile<NoticeSeed[]>('notices.json');
  let successCount = 0;

  // Clear existing notices first
  await supabase.from('notices').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (const notice of notices) {
    const noticeData = {
      message: notice.message,
      is_active: notice.is_active,
      expires_at: notice.expires_at
    };

    const { error } = await supabase
      .from('notices')
      .insert(noticeData);

    if (error) {
      logError(`Failed to insert notice: ${notice.message.substring(0, 30)}...`, error);
      continue;
    }

    successCount++;
  }

  log(`Imported ${successCount} notices`);
}

async function importMapMarkers(): Promise<void> {
  log('Importing map markers...');

  const markers = readJsonFile<MapMarkerSeed[]>('map-markers.json');
  let successCount = 0;
  let errorCount = 0;

  for (const marker of markers) {
    const markerData = {
      type: marker.type,
      name: marker.name,
      latitude: marker.latitude,
      longitude: marker.longitude,
      notes: marker.notes
    };

    const { error } = await supabase
      .from('map_markers')
      .upsert(markerData, {
        onConflict: 'name,type',
        ignoreDuplicates: false
      });

    if (error) {
      logError(`Failed to upsert marker ${marker.name}`, error);
      errorCount++;
      continue;
    }

    successCount++;
  }

  log(`Imported ${successCount} map markers (${errorCount} errors)`);
}

async function updateShopStats(shopMap: Map<string, string>): Promise<void> {
  log('Updating shop statistics...');

  for (const [slug, shopId] of shopMap) {
    // Count reviews and calculate average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('shop_id', shopId)
      .eq('status', 'approved');

    if (reviews && reviews.length > 0) {
      const reviewCount = reviews.length;
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

      await supabase
        .from('shops')
        .update({
          review_count: reviewCount,
          average_rating: Math.round(avgRating * 10) / 10
        })
        .eq('id', shopId);
    }
  }

  log('Shop statistics updated');
}

// Helper to generate random past date
function getRandomPastDate(maxDaysAgo: number): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
}

// Main execution
async function main() {
  console.log('='.repeat(50));
  console.log('whitstable.shop — Seed Data Import');
  console.log('='.repeat(50));
  console.log('');

  try {
    // Test connection
    log('Testing Supabase connection...');
    const { error: connError } = await supabase.from('categories').select('count').limit(1);
    if (connError) {
      throw new Error(`Connection failed: ${connError.message}`);
    }
    log('Connection successful');
    console.log('');

    // Import in order
    const categoryMap = await importCategories();
    console.log('');

    const shopMap = await importShops(categoryMap);
    console.log('');

    await importReviews(shopMap);
    console.log('');

    await importEvents(shopMap);
    console.log('');

    await importNotices();
    console.log('');

    await importMapMarkers();
    console.log('');

    await updateShopStats(shopMap);
    console.log('');

    console.log('='.repeat(50));
    console.log('Import complete!');
    console.log('='.repeat(50));

  } catch (error) {
    logError('Fatal error during import', error);
    process.exit(1);
  }
}

main();
