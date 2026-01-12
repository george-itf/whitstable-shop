import { Metadata } from 'next';

interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  twitterHandle?: string;
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  geo?: {
    region: string;
    placename: string;
    position: { lat: number; lng: number };
  };
}

const SITE_NAME = 'whitstable.shop';
const DEFAULT_IMAGE = 'https://whitstable.shop/og-image.jpg';
const TWITTER_HANDLE = '@whitstableshop';

/**
 * Generate Next.js Metadata object for SEO
 * Use this in your page.tsx files:
 *
 * export const metadata = generateMetadata({
 *   title: 'Page Title',
 *   description: 'Page description',
 *   url: 'https://whitstable.shop/page',
 * });
 */
export function generateMetadata(config: MetaTagsConfig): Metadata {
  const {
    title,
    description,
    url,
    image = DEFAULT_IMAGE,
    type = 'website',
    siteName = SITE_NAME,
    locale = 'en_GB',
    twitterHandle = TWITTER_HANDLE,
    noIndex = false,
    keywords = [],
    author,
    publishedTime,
    modifiedTime,
    geo,
  } = config;

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle,
    },

    // Robots
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    // Other meta
    other: {},
  };

  // Add geo meta tags if provided
  if (geo && metadata.other) {
    metadata.other['geo.region'] = geo.region;
    metadata.other['geo.placename'] = geo.placename;
    metadata.other['geo.position'] = `${geo.position.lat};${geo.position.lng}`;
    metadata.other['ICBM'] = `${geo.position.lat}, ${geo.position.lng}`;
  }

  // Add article-specific meta if type is article
  if (type === 'article' && metadata.openGraph) {
    const ogArticle = metadata.openGraph as Record<string, unknown>;
    if (publishedTime) ogArticle.publishedTime = publishedTime;
    if (modifiedTime) ogArticle.modifiedTime = modifiedTime;
    if (author) ogArticle.authors = [author];
  }

  return metadata;
}

/**
 * Pre-configured metadata generators for common page types
 */

// Homepage metadata
export function generateHomepageMetadata(): Metadata {
  return generateMetadata({
    title: 'whitstable.shop - Discover Independent Shops in Whitstable',
    description:
      'Your complete guide to independent shops, restaurants, cafes, and local events in Whitstable, Kent. Discover the best of the high street.',
    url: 'https://whitstable.shop',
    keywords: [
      'Whitstable',
      'Whitstable shops',
      'independent shops',
      'Whitstable restaurants',
      'Kent shopping',
      'Whitstable high street',
      'local businesses',
    ],
    geo: {
      region: 'GB-KEN',
      placename: 'Whitstable',
      position: { lat: 51.3608, lng: 1.0256 },
    },
  });
}

// Shop page metadata generator
export function generateShopMetadata(shop: {
  name: string;
  slug: string;
  description: string;
  category: string;
  image?: string;
}): Metadata {
  return generateMetadata({
    title: `${shop.name} - ${shop.category} in Whitstable`,
    description: shop.description,
    url: `https://whitstable.shop/shop/${shop.slug}`,
    image: shop.image,
    type: 'website',
    keywords: [
      shop.name,
      shop.category,
      'Whitstable',
      `${shop.category} Whitstable`,
      'Kent',
    ],
    geo: {
      region: 'GB-KEN',
      placename: 'Whitstable',
      position: { lat: 51.3608, lng: 1.0256 },
    },
  });
}

// Event page metadata generator
export function generateEventMetadata(event: {
  name: string;
  slug: string;
  description: string;
  date: string;
  image?: string;
}): Metadata {
  return generateMetadata({
    title: `${event.name} - Event in Whitstable`,
    description: event.description,
    url: `https://whitstable.shop/events/${event.slug}`,
    image: event.image,
    type: 'article',
    publishedTime: event.date,
    keywords: [
      event.name,
      'Whitstable events',
      'things to do Whitstable',
      'Kent events',
    ],
  });
}

// Category page metadata generator
export function generateCategoryMetadata(category: {
  name: string;
  slug: string;
  description: string;
  shopCount: number;
}): Metadata {
  return generateMetadata({
    title: `${category.name} in Whitstable - ${category.shopCount} Places to Discover`,
    description: category.description,
    url: `https://whitstable.shop/category/${category.slug}`,
    keywords: [
      category.name,
      `${category.name} Whitstable`,
      'Whitstable shops',
      'Kent',
    ],
  });
}

// Local info page metadata generator
export function generateLocalInfoMetadata(page: {
  title: string;
  slug: string;
  description: string;
}): Metadata {
  return generateMetadata({
    title: `${page.title} - Whitstable Local Info`,
    description: page.description,
    url: `https://whitstable.shop/info/${page.slug}`,
    keywords: [
      page.title,
      'Whitstable',
      'Whitstable information',
      'visitor guide',
    ],
  });
}

export default generateMetadata;
