import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ExternalLink, Phone, MapPin, Clock, AlertCircle, Calendar, Waves, Car, Sun, Trash2, Music, Building, Heart, Stethoscope, Info } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { LocalInfoPage } from '@/types/database';

// Icon mapping for database entries
const iconMap: Record<string, React.ReactNode> = {
  Trash2: <Trash2 className="w-6 h-6" />,
  Waves: <Waves className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  Sun: <Sun className="w-6 h-6" />,
  Phone: <Phone className="w-6 h-6" />,
  Building: <Building className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  MapPin: <MapPin className="w-6 h-6" />,
  AlertCircle: <AlertCircle className="w-6 h-6" />,
  Info: <Info className="w-6 h-6" />,
};

// Small icon mapping for quick facts
const smallIconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="w-4 h-4" />,
  Trash2: <Trash2 className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Waves: <Waves className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Phone: <Phone className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
};

// Fallback hardcoded page configuration (used when database is empty)
const fallbackPageConfig: Record<string, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle: string;
  quickFacts?: { label: string; value: string; icon?: React.ReactNode }[];
  links?: { label: string; url: string; description?: string }[];
}> = {
  'bin-collection': {
    icon: <Trash2 className="w-6 h-6" />,
    color: 'text-green',
    bgColor: 'bg-green',
    subtitle: 'collection schedules & recycling',
    quickFacts: [
      { label: 'Collection day', value: 'Tuesdays', icon: <Calendar className="w-4 h-4" /> },
      { label: 'This week', value: 'Blue lid (recycling)', icon: <Trash2 className="w-4 h-4" /> },
    ],
    links: [
      { label: 'Check your collection day', url: 'https://www.canterbury.gov.uk/bins', description: 'Canterbury City Council' },
      { label: 'Report missed collection', url: 'https://www.canterbury.gov.uk/bins/missed', description: 'Within 48 hours' },
    ],
  },
  'tide-times': {
    icon: <Waves className="w-6 h-6" />,
    color: 'text-sky',
    bgColor: 'bg-sky',
    subtitle: 'high & low tide predictions',
    quickFacts: [
      { label: 'Location', value: 'Whitstable Harbour', icon: <MapPin className="w-4 h-4" /> },
      { label: 'Tidal range', value: '~4-5m (springs)', icon: <Waves className="w-4 h-4" /> },
    ],
    links: [
      { label: 'BBC Weather Tides', url: 'https://www.bbc.co.uk/weather/coast-and-sea/tide-tables', description: '14-day forecast' },
      { label: 'Magic Seaweed', url: 'https://magicseaweed.com', description: 'Surf & sea conditions' },
    ],
  },
  'oyster-festival': {
    icon: <Music className="w-6 h-6" />,
    color: 'text-coral',
    bgColor: 'bg-coral',
    subtitle: 'annual celebration since 1985',
    quickFacts: [
      { label: '2025 dates', value: '26-27 July', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Main event', value: 'Oyster Parade 10am Sat', icon: <MapPin className="w-4 h-4" /> },
    ],
    links: [
      { label: 'Official festival website', url: 'https://whitstableoysterfestival.co.uk', description: 'Programme & tickets' },
      { label: 'Volunteer signup', url: 'https://whitstableoysterfestival.co.uk/volunteer', description: 'Help out this year' },
    ],
  },
  'parking': {
    icon: <Car className="w-6 h-6" />,
    color: 'text-yellow',
    bgColor: 'bg-yellow',
    subtitle: 'car parks, rates & permits',
    quickFacts: [
      { label: 'Best option', value: 'Gorrell Tank', icon: <MapPin className="w-4 h-4" /> },
      { label: 'Day rate', value: '£8 max', icon: <Car className="w-4 h-4" /> },
    ],
    links: [
      { label: 'RingGo parking app', url: 'https://myringgo.co.uk', description: 'Pay by phone' },
      { label: 'Resident permits', url: 'https://www.canterbury.gov.uk/parking-permits', description: 'Apply online' },
    ],
  },
  'beach-info': {
    icon: <Sun className="w-6 h-6" />,
    color: 'text-coral',
    bgColor: 'bg-coral',
    subtitle: 'beaches, safety & facilities',
    quickFacts: [
      { label: 'Water quality', value: 'Excellent', icon: <Heart className="w-4 h-4" /> },
      { label: 'Dogs allowed', value: 'Long Beach (all year)', icon: <MapPin className="w-4 h-4" /> },
    ],
    links: [
      { label: 'Beach hut hire', url: 'https://www.canterbury.gov.uk/beach-huts', description: 'Book in advance' },
      { label: 'Water quality', url: 'https://environment.data.gov.uk/bwq', description: 'Environment Agency' },
    ],
  },
  'emergency-contacts': {
    icon: <Phone className="w-6 h-6" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    subtitle: 'emergency & useful numbers',
    quickFacts: [
      { label: 'Emergency', value: '999', icon: <AlertCircle className="w-4 h-4" /> },
      { label: 'Non-emergency', value: '101 or 111', icon: <Phone className="w-4 h-4" /> },
    ],
  },
  'council-contacts': {
    icon: <Building className="w-6 h-6" />,
    color: 'text-sky',
    bgColor: 'bg-sky',
    subtitle: 'Canterbury City Council services',
    quickFacts: [
      { label: 'Main number', value: '01227 862000', icon: <Phone className="w-4 h-4" /> },
    ],
    links: [
      { label: 'Council website', url: 'https://www.canterbury.gov.uk', description: 'Online services' },
      { label: 'Report an issue', url: 'https://www.canterbury.gov.uk/report', description: 'Fly-tipping, potholes, etc.' },
    ],
  },
  'school-term-dates': {
    icon: <Calendar className="w-6 h-6" />,
    color: 'text-sky',
    bgColor: 'bg-sky',
    subtitle: '2024-2025 academic year',
    quickFacts: [
      { label: 'Summer term ends', value: '22 July 2025', icon: <Calendar className="w-4 h-4" /> },
    ],
    links: [
      { label: 'Kent term dates', url: 'https://www.kent.gov.uk/education-and-children/schools/term-dates', description: 'Official KCC dates' },
    ],
  },
  'healthcare': {
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'text-green',
    bgColor: 'bg-green',
    subtitle: 'GPs, dentists, pharmacies & vets',
    quickFacts: [
      { label: 'Out of hours', value: 'Call 111', icon: <Phone className="w-4 h-4" /> },
    ],
    links: [
      { label: 'Find an NHS dentist', url: 'https://www.nhs.uk/service-search/find-a-dentist', description: 'NHS website' },
      { label: 'Register with a GP', url: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/', description: 'NHS guide' },
    ],
  },
  'carnival': {
    icon: <Music className="w-6 h-6" />,
    color: 'text-coral',
    bgColor: 'bg-coral',
    subtitle: 'annual summer celebration',
    quickFacts: [
      { label: '2025 date', value: '9 August (TBC)', icon: <Calendar className="w-4 h-4" /> },
    ],
  },
};

// Fallback content for each page
const fallbackInfoContent: Record<string, { title: string; sections: { heading?: string; content: string[] }[] }> = {
  'bin-collection': {
    title: 'Bin Collection Days',
    sections: [
      {
        heading: 'Your collection days',
        content: [
          'Most Whitstable addresses are collected on **Tuesdays**.',
          'Put bins out by 7am on collection day.',
        ],
      },
      {
        heading: 'What goes out when?',
        content: [
          '**Week A (Green Lid)**: General waste + food waste',
          '**Week B (Blue Lid)**: Recycling (paper, cardboard, plastics, cans, glass) + food waste',
          'Food waste goes out every week in the small caddy.',
        ],
      },
      {
        heading: 'Large item collection',
        content: [
          'Book a bulky waste collection for furniture and large items through the council website.',
          'Charges apply — typically £25-35 per collection.',
        ],
      },
    ],
  },
  'tide-times': {
    title: 'Tide Times',
    sections: [
      {
        heading: 'Checking tide times',
        content: [
          'Use the links below to check current tide predictions.',
          'Times are for Whitstable Harbour. Add ~10 mins for Tankerton.',
          'Tides occur roughly 50 minutes later each day.',
        ],
      },
      {
        heading: 'Swimming safety',
        content: [
          'Best swimming at high tide ± 2 hours.',
          'Avoid swimming at low tide — exposed mudflats and shallow water.',
          'Always check for red flags indicating no swimming.',
        ],
      },
    ],
  },
  'oyster-festival': {
    title: 'Oyster Festival',
    sections: [
      {
        heading: '2025 festival dates',
        content: [
          '**Saturday 26th - Sunday 27th July 2025**',
          "Whitstable's biggest annual event celebrating our maritime heritage.",
        ],
      },
    ],
  },
  'parking': {
    title: 'Parking',
    sections: [
      {
        heading: 'Main car parks',
        content: [
          '**Gorrell Tank (Long Stay)** — CT5 2BP, ~200 spaces, £1.50/hr, max £8/day',
          '**Harbour Street (Short Stay)** — CT5 1AB, ~50 spaces, £2/hr, max 3 hours',
          '**Stream Walk (Medium Stay)** — CT5 1AW, ~100 spaces, £1.50/hr, max £6/day',
        ],
      },
    ],
  },
  'beach-info': {
    title: 'Beach Info',
    sections: [
      {
        heading: 'Beach areas',
        content: [
          '**West Beach**: Pebble/shingle, good swimming at high tide, popular with families',
          '**Tankerton Beach**: Longer stretch, the famous "Street" visible at low tide',
          '**Long Beach**: More secluded, dog-friendly year-round',
        ],
      },
    ],
  },
  'emergency-contacts': {
    title: 'Emergency Contacts',
    sections: [
      {
        heading: 'Emergency services',
        content: [
          '**999**: Police, Fire, Ambulance',
          '**101**: Non-emergency police',
          '**111**: NHS non-emergency health advice',
        ],
      },
    ],
  },
  'council-contacts': {
    title: 'Council Contacts',
    sections: [
      {
        heading: 'Main contact',
        content: [
          '**Phone**: 01227 862000',
          '**Email**: info@canterbury.gov.uk',
        ],
      },
    ],
  },
  'school-term-dates': {
    title: 'School Term Dates',
    sections: [
      {
        heading: 'Summer term 2025',
        content: [
          '**Start**: Tuesday 22 April 2025',
          '**End**: Tuesday 22 July 2025',
        ],
      },
    ],
  },
  'healthcare': {
    title: 'Healthcare',
    sections: [
      {
        heading: 'GP surgeries',
        content: [
          '**Whitstable Medical Practice**: Harbour Street, CT5 1AJ — 01227 594400',
        ],
      },
    ],
  },
  'carnival': {
    title: 'Carnival',
    sections: [
      {
        heading: '2025 carnival',
        content: [
          '**Date**: Saturday 9th August 2025 (TBC)',
        ],
      },
    ],
  },
};

interface InfoPageProps {
  params: Promise<{ slug: string }>;
}

async function getInfoPage(slug: string): Promise<{
  dbPage: LocalInfoPage | null;
  fallbackConfig: typeof fallbackPageConfig[string] | null;
  fallbackContent: typeof fallbackInfoContent[string] | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('local_info_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (data && !error) {
      return { dbPage: data, fallbackConfig: null, fallbackContent: null };
    }
  } catch (e) {
    // Database fetch failed, fall back to hardcoded
  }

  // Use fallback if database doesn't have this page
  return {
    dbPage: null,
    fallbackConfig: fallbackPageConfig[slug] || null,
    fallbackContent: fallbackInfoContent[slug] || null,
  };
}

export default async function InfoDetailPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const { dbPage, fallbackConfig, fallbackContent } = await getInfoPage(slug);

  // If neither database nor fallback has this page, 404
  if (!dbPage && !fallbackContent) {
    notFound();
  }

  // Resolve content from database or fallback
  const title = dbPage?.title || fallbackContent?.title || 'Info';
  const subtitle = dbPage?.subtitle || fallbackConfig?.subtitle;
  const bgColor = dbPage?.bg_color || fallbackConfig?.bgColor || 'bg-sky';
  const icon = dbPage?.icon ? iconMap[dbPage.icon] : fallbackConfig?.icon;
  const imageUrl = dbPage?.image_url;
  const quickFacts = (dbPage?.quick_facts as Array<{ label: string; value: string; icon?: string }>) || fallbackConfig?.quickFacts || [];
  const links = (dbPage?.links as Array<{ label: string; url: string; description?: string }>) || fallbackConfig?.links || [];
  const sections = (dbPage?.sections as Array<{ heading?: string; content: string[] }>) || fallbackContent?.sections || [];

  // Render content with basic markdown
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <MobileWrapper>
      {/* Header */}
      <div className={`${bgColor} px-4 py-5`}>
        {/* Header image if available */}
        {imageUrl && (
          <div className="relative -mx-4 -mt-5 mb-4 h-40 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <Link href="/info" className="text-white/80 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-white font-bold text-xl">{title.toLowerCase()}</h1>
            {subtitle && (
              <p className="text-white/70 text-sm">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
              {icon}
            </div>
          )}
        </div>

        {/* Quick facts */}
        {quickFacts.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {quickFacts.map((fact, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 text-white/70 text-xs mb-0.5">
                  {typeof fact.icon === 'string' ? smallIconMap[fact.icon] : fact.icon}
                  <span>{fact.label}</span>
                </div>
                <p className="text-white font-semibold text-sm">{fact.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-6">
        {sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="text-base font-bold text-ink mb-3 lowercase">{section.heading}</h2>
            )}
            <div className="space-y-2">
              {section.content.map((line, j) => (
                <p key={j} className="text-sm text-oyster-600 leading-relaxed">
                  {renderText(line)}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* Useful links */}
        {links.length > 0 && (
          <div className="pt-4 border-t border-oyster-100">
            <h2 className="text-base font-bold text-ink mb-3 lowercase">useful links</h2>
            <div className="space-y-2">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-oyster-50 rounded-xl hover:bg-oyster-100 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-sky transition-colors">{link.label}</p>
                    {link.description && (
                      <p className="text-xs text-oyster-500">{link.description}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-oyster-400 group-hover:text-sky transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Last updated hint */}
        <p className="text-xs text-oyster-400 text-center pt-4">
          Info may change — always check official sources for the latest
        </p>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

export async function generateStaticParams() {
  // Return all known slugs (from fallback + any active database pages)
  const fallbackSlugs = Object.keys(fallbackInfoContent);

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('local_info_pages')
      .select('slug')
      .eq('is_active', true);

    const dbSlugs = data?.map((p: { slug: string }) => p.slug) || [];
    const allSlugs = [...new Set([...fallbackSlugs, ...dbSlugs])];

    return allSlugs.map((slug) => ({ slug }));
  } catch {
    return fallbackSlugs.map((slug) => ({ slug }));
  }
}
