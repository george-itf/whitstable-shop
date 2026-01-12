# Performance Optimization Checklist

A comprehensive checklist for ensuring whitstable.shop delivers excellent performance and Core Web Vitals scores.

## Images

- [ ] **WebP Format**: All images served in WebP format with fallbacks
- [ ] **Lazy Loading**: Images below the fold use `loading="lazy"`
- [ ] **Responsive Images**: Use `srcset` and `sizes` for responsive delivery
- [ ] **Image Dimensions**: Width and height attributes set to prevent CLS
- [ ] **Image CDN**: Images served through Vercel's image optimization
- [ ] **Thumbnails**: Generate and use thumbnails for shop cards (max 400px wide)
- [ ] **Hero Images**: Preload above-the-fold hero images

```tsx
// Example: Optimized image component
import Image from 'next/image';

<Image
  src="/shop-image.jpg"
  alt="Shop name"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## Fonts

- [ ] **Preload Primary Font**: Preload Nunito (or chosen font) in document head
- [ ] **Font Display Swap**: Use `font-display: swap` for all fonts
- [ ] **Subset Fonts**: Only include Latin characters if not using others
- [ ] **Self-Host Fonts**: Consider self-hosting for better performance
- [ ] **Variable Fonts**: Use variable fonts to reduce file count

```tsx
// next.config.js font preload
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});
```

## Core Web Vitals Targets

### LCP (Largest Contentful Paint) < 2.5s

- [ ] Optimize hero image loading
- [ ] Preload critical resources
- [ ] Use server-side rendering for above-fold content
- [ ] Minimize render-blocking resources
- [ ] Implement efficient caching

### FID (First Input Delay) < 100ms

- [ ] Minimize JavaScript bundle size
- [ ] Break up long tasks
- [ ] Use web workers for heavy computation
- [ ] Defer non-critical JavaScript
- [ ] Optimize event handlers

### CLS (Cumulative Layout Shift) < 0.1

- [ ] Set explicit dimensions on images and embeds
- [ ] Reserve space for dynamic content
- [ ] Avoid inserting content above existing content
- [ ] Use CSS transforms for animations
- [ ] Precompute dynamic content heights

## JavaScript Bundle

- [ ] **Bundle Analysis**: Run `npm run analyze` to check bundle size
- [ ] **No Unused Dependencies**: Remove unused npm packages
- [ ] **Tree Shaking**: Ensure tree shaking is working
- [ ] **Code Splitting**: Dynamic imports for non-critical features
- [ ] **External Libraries**: Lazy load heavy libraries (maps, charts)

```tsx
// Dynamic import example
const Map = dynamic(() => import('@/components/Map'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});
```

## API Routes

- [ ] **Edge Runtime**: Use Edge runtime for simple API routes
- [ ] **Streaming**: Implement streaming for large responses
- [ ] **Compression**: Enable gzip/brotli compression
- [ ] **Response Caching**: Add appropriate cache headers

```tsx
// Edge runtime API route
export const runtime = 'edge';

export async function GET(request: Request) {
  // Fast, globally distributed response
}
```

## Database

- [ ] **Indexed Columns**: Index frequently queried columns (slug, status, category)
- [ ] **Connection Pooling**: Use connection pooling (PgBouncer/Supabase default)
- [ ] **Query Optimization**: Analyze and optimize slow queries
- [ ] **Select Only Needed**: Don't SELECT * - choose specific columns
- [ ] **Pagination**: Implement cursor-based pagination for lists

```sql
-- Essential indexes
CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_status ON shops(status);
CREATE INDEX idx_shops_category ON shops(category_id);
CREATE INDEX idx_reviews_shop ON reviews(shop_id);
```

## Caching Strategy

- [ ] **Static Generation**: Use static generation for shop pages
- [ ] **ISR**: Implement Incremental Static Regeneration for dynamic content
- [ ] **SWR**: Use SWR for client-side data fetching
- [ ] **API Caching**: Cache API responses appropriately
- [ ] **Browser Caching**: Set proper Cache-Control headers

```tsx
// ISR example
export const revalidate = 3600; // Revalidate every hour

// Or use on-demand revalidation
export async function generateStaticParams() {
  const shops = await getApprovedShops();
  return shops.map((shop) => ({ slug: shop.slug }));
}
```

## CDN & Edge

- [ ] **Vercel Edge Network**: Confirm deployment on Vercel's edge
- [ ] **Edge Caching**: Static assets cached at edge
- [ ] **Regional Deployment**: Consider region-specific deployment (EU for UK users)
- [ ] **Asset Optimization**: Enable automatic asset optimization

## Monitoring

- [ ] **Core Web Vitals Monitoring**: Set up Vercel Analytics or Web Vitals tracking
- [ ] **Error Tracking**: Implement error tracking (Sentry)
- [ ] **Performance Budgets**: Set and enforce performance budgets
- [ ] **Lighthouse CI**: Run Lighthouse in CI pipeline

```tsx
// Web Vitals tracking
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}
```

## Mobile Optimization

- [ ] **Touch Targets**: Minimum 44x44px touch targets
- [ ] **Viewport Meta**: Correct viewport meta tag
- [ ] **No Horizontal Scroll**: Test on various screen sizes
- [ ] **Input Optimization**: Correct input types on forms
- [ ] **Reduced Motion**: Respect prefers-reduced-motion

## Pre-Launch Checks

- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Test on 3G network throttling
- [ ] Test on low-end Android device
- [ ] Verify all images have WebP versions
- [ ] Check bundle size (target: <200KB initial JS)
- [ ] Confirm no layout shifts on page load
- [ ] Test map loading performance
- [ ] Verify PWA functionality

## Tools

- **Lighthouse**: Chrome DevTools > Lighthouse
- **WebPageTest**: https://www.webpagetest.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Bundle Analyzer**: `npm run analyze`
- **Vercel Analytics**: Dashboard metrics

---

*Review and update this checklist before each major release.*
