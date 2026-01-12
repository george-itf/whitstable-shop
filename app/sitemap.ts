import { MetadataRoute } from 'next';

const BASE_URL = 'https://whitstable.shop';

// Types for data sources
interface Shop {
  slug: string;
  updatedAt: Date;
}

interface Event {
  slug: string;
  updatedAt: Date;
}

interface InfoPage {
  slug: string;
  updatedAt: Date;
}

interface Category {
  slug: string;
}

/**
 * Fetch approved shops from database
 * Replace with actual database query
 */
async function getApprovedShops(): Promise<Shop[]> {
  // TODO: Replace with actual Supabase query
  // const { data } = await supabase
  //   .from('shops')
  //   .select('slug, updated_at')
  //   .eq('status', 'approved');

  // Placeholder - replace with real data
  return [];
}

/**
 * Fetch upcoming and recent events
 * Replace with actual database query
 */
async function getEvents(): Promise<Event[]> {
  // TODO: Replace with actual Supabase query
  // const { data } = await supabase
  //   .from('events')
  //   .select('slug, updated_at')
  //   .gte('end_date', new Date().toISOString());

  // Placeholder - replace with real data
  return [];
}

/**
 * Fetch local info pages
 * Replace with actual database query or static list
 */
async function getInfoPages(): Promise<InfoPage[]> {
  // Static info pages
  return [
    { slug: 'tide-times', updatedAt: new Date() },
    { slug: 'parking', updatedAt: new Date() },
    { slug: 'getting-here', updatedAt: new Date() },
    { slug: 'beach-guide', updatedAt: new Date() },
    { slug: 'oyster-guide', updatedAt: new Date() },
  ];
}

/**
 * Get all categories
 */
function getCategories(): Category[] {
  return [
    { slug: 'restaurants' },
    { slug: 'cafes' },
    { slug: 'pubs' },
    { slug: 'shops' },
    { slug: 'galleries' },
    { slug: 'services' },
    { slug: 'health-beauty' },
    { slug: 'food-drink' },
  ];
}

/**
 * Generate dynamic sitemap
 * Next.js will automatically serve this at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shops, events, infoPages] = await Promise.all([
    getApprovedShops(),
    getEvents(),
    getInfoPages(),
  ]);

  const categories = getCategories();
  const now = new Date();

  // Static pages with highest priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Shop pages - high priority
  const shopPages: MetadataRoute.Sitemap = shops.map((shop) => ({
    url: `${BASE_URL}/shop/${shop.slug}`,
    lastModified: shop.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Event pages
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE_URL}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Info pages
  const infoPagesSitemap: MetadataRoute.Sitemap = infoPages.map((page) => ({
    url: `${BASE_URL}/info/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...shopPages,
    ...eventPages,
    ...infoPagesSitemap,
  ];
}
