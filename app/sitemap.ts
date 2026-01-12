import { MetadataRoute } from 'next';

const BASE_URL = 'https://whitstable.shop';

/**
 * Info pages that actually exist
 * These match the slugs used in /info/[slug]
 */
const INFO_PAGE_SLUGS = [
  'bin-collection',
  'tide-times',
  'oyster-festival',
  'parking',
  'beach-info',
  'emergency-contacts',
];

/**
 * Generate sitemap with only routes that actually exist
 * Next.js will automatically serve this at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages - only include routes that actually exist
  const staticPages: MetadataRoute.Sitemap = [
    // High priority - main pages
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shops`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
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
    // Community pages
    {
      url: `${BASE_URL}/community`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/awards`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ask`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/photos`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/offers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/info`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    // Legal pages
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

  // Info pages - these use /info/[slug] route
  const infoPages: MetadataRoute.Sitemap = INFO_PAGE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/info/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // TODO: When Supabase is connected, add dynamic shop pages:
  // const { data: shops } = await supabase
  //   .from('shops')
  //   .select('slug, updated_at')
  //   .eq('is_active', true);
  //
  // const shopPages = shops?.map((shop) => ({
  //   url: `${BASE_URL}/shops/${shop.slug}`,  // Note: /shops/ not /shop/
  //   lastModified: new Date(shop.updated_at),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // })) ?? [];

  return [
    ...staticPages,
    ...infoPages,
    // ...shopPages,  // Uncomment when Supabase is connected
  ];
}
