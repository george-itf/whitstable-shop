import { MetadataRoute } from 'next';

/**
 * Generate robots.txt
 * Next.js will automatically serve this at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/auth/',
          '/_next/',
          '/private/',
        ],
      },
      {
        // Googlebot can access everything except private areas
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/auth/', '/private/'],
      },
      {
        // Block AI crawlers from scraping content
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
    ],
    sitemap: 'https://whitstable.shop/sitemap.xml',
    host: 'https://whitstable.shop',
  };
}
