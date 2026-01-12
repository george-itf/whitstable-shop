'use client';

import Script from 'next/script';

// Types for structured data
interface Address {
  streetAddress: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode: string;
  addressCountry?: string;
}

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface OpeningHours {
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

interface Review {
  authorName: string;
  datePublished: string;
  reviewBody: string;
  rating: number;
}

interface LocalBusinessProps {
  type: 'LocalBusiness';
  name: string;
  description: string;
  image?: string;
  url?: string;
  address: Address;
  geo?: GeoCoordinates;
  phone?: string;
  email?: string;
  priceRange?: string;
  openingHours?: OpeningHours[];
  rating?: { value: number; count: number };
  reviews?: Review[];
  socialLinks?: string[];
}

interface EventProps {
  type: 'Event';
  name: string;
  description: string;
  image?: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: Address;
    geo?: GeoCoordinates;
  };
  organizer?: { name: string; url?: string };
  price?: number;
  isFree?: boolean;
  ticketUrl?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageProps {
  type: 'FAQPage';
  questions: FAQItem[];
}

interface WebSiteProps {
  type: 'WebSite';
  name: string;
  url: string;
  description: string;
  searchUrlTemplate?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbListProps {
  type: 'BreadcrumbList';
  items: BreadcrumbItem[];
}

type StructuredDataProps =
  | LocalBusinessProps
  | EventProps
  | FAQPageProps
  | WebSiteProps
  | BreadcrumbListProps;

// Generate JSON-LD for LocalBusiness
function generateLocalBusinessLD(props: LocalBusinessProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: props.name,
    description: props.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address.streetAddress,
      addressLocality: props.address.addressLocality || 'Whitstable',
      addressRegion: props.address.addressRegion || 'Kent',
      postalCode: props.address.postalCode,
      addressCountry: props.address.addressCountry || 'GB',
    },
  };

  if (props.image) data.image = props.image;
  if (props.url) data.url = props.url;
  if (props.phone) data.telephone = props.phone;
  if (props.email) data.email = props.email;
  if (props.priceRange) data.priceRange = props.priceRange;

  if (props.geo) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: props.geo.latitude,
      longitude: props.geo.longitude,
    };
  }

  if (props.openingHours && props.openingHours.length > 0) {
    data.openingHoursSpecification = props.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    }));
  }

  if (props.rating && props.rating.count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: props.rating.value,
      reviewCount: props.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (props.reviews && props.reviews.length > 0) {
    data.review = props.reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.authorName,
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  if (props.socialLinks && props.socialLinks.length > 0) {
    data.sameAs = props.socialLinks;
  }

  return data;
}

// Generate JSON-LD for Event
function generateEventLD(props: EventProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: props.name,
    description: props.description,
    startDate: props.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: props.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: props.location.address.streetAddress,
        addressLocality: props.location.address.addressLocality || 'Whitstable',
        addressRegion: props.location.address.addressRegion || 'Kent',
        postalCode: props.location.address.postalCode,
        addressCountry: props.location.address.addressCountry || 'GB',
      },
    },
  };

  if (props.image) data.image = props.image;
  if (props.endDate) data.endDate = props.endDate;

  if (props.location.geo) {
    (data.location as Record<string, unknown>).geo = {
      '@type': 'GeoCoordinates',
      latitude: props.location.geo.latitude,
      longitude: props.location.geo.longitude,
    };
  }

  if (props.organizer) {
    data.organizer = {
      '@type': 'Organization',
      name: props.organizer.name,
      ...(props.organizer.url && { url: props.organizer.url }),
    };
  }

  if (props.isFree) {
    data.isAccessibleForFree = true;
  } else if (props.price !== undefined) {
    data.offers = {
      '@type': 'Offer',
      price: props.price,
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      ...(props.ticketUrl && { url: props.ticketUrl }),
    };
  }

  return data;
}

// Generate JSON-LD for FAQPage
function generateFAQPageLD(props: FAQPageProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

// Generate JSON-LD for WebSite
function generateWebSiteLD(props: WebSiteProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: props.name,
    url: props.url,
    description: props.description,
    publisher: {
      '@type': 'Organization',
      name: props.name,
      url: props.url,
    },
    inLanguage: 'en-GB',
  };

  if (props.searchUrlTemplate) {
    data.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: props.searchUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return data;
}

// Generate JSON-LD for BreadcrumbList
function generateBreadcrumbListLD(props: BreadcrumbListProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Main component
export function StructuredData(props: StructuredDataProps) {
  let jsonLd: Record<string, unknown>;

  switch (props.type) {
    case 'LocalBusiness':
      jsonLd = generateLocalBusinessLD(props);
      break;
    case 'Event':
      jsonLd = generateEventLD(props);
      break;
    case 'FAQPage':
      jsonLd = generateFAQPageLD(props);
      break;
    case 'WebSite':
      jsonLd = generateWebSiteLD(props);
      break;
    case 'BreadcrumbList':
      jsonLd = generateBreadcrumbListLD(props);
      break;
    default:
      return null;
  }

  return (
    <Script
      id={`structured-data-${props.type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

// Convenience components for common use cases
export function LocalBusinessStructuredData(
  props: Omit<LocalBusinessProps, 'type'>
) {
  return <StructuredData type="LocalBusiness" {...props} />;
}

export function EventStructuredData(props: Omit<EventProps, 'type'>) {
  return <StructuredData type="Event" {...props} />;
}

export function FAQPageStructuredData(props: Omit<FAQPageProps, 'type'>) {
  return <StructuredData type="FAQPage" {...props} />;
}

export function WebSiteStructuredData(props: Omit<WebSiteProps, 'type'>) {
  return <StructuredData type="WebSite" {...props} />;
}

export function BreadcrumbStructuredData(
  props: Omit<BreadcrumbListProps, 'type'>
) {
  return <StructuredData type="BreadcrumbList" {...props} />;
}

export default StructuredData;
