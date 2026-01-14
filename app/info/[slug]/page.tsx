import Link from 'next/link';
import { ChevronLeft, ExternalLink, Phone, MapPin, Clock, AlertCircle, Calendar, Waves, Car, Sun, Trash2, Music, Building, Heart, Stethoscope } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { notFound } from 'next/navigation';

// Page-specific configuration
const pageConfig: Record<string, {
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

// Content for each page
const infoContent: Record<string, { title: string; sections: { heading?: string; content: string[] }[] }> = {
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
      {
        heading: 'Christmas schedule',
        content: [
          'Collections often change during the festive period.',
          'Check the council website in December for updated times.',
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
      {
        heading: 'For oyster foraging',
        content: [
          'Low tide is best for exploring the oyster beds.',
          'The famous "Street" at Tankerton is only visible at low tide.',
          'Always check tide times before heading out.',
        ],
      },
      {
        heading: 'Spring vs neap tides',
        content: [
          '**Spring tides** (full/new moon): Higher highs, lower lows — more dramatic',
          '**Neap tides** (quarter moons): More moderate tidal range',
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
      {
        heading: 'Main events',
        content: [
          '**Oyster Parade**: Saturday 10am from Harbour Street',
          '**Blessing of the Waters**: Saturday 11am at the harbour',
          '**Oyster Eating Competition**: Saturday 2pm',
          '**Live music**: Both days across multiple stages',
          '**Fireworks**: Saturday 10pm over the harbour',
        ],
      },
      {
        heading: 'What to expect',
        content: [
          'Street food from local vendors (not just oysters!)',
          'Local craft stalls and artisan markets',
          "Children's activities and entertainment",
          'Beer tent with local ales and ciders',
        ],
      },
      {
        heading: 'Getting there',
        content: [
          '**Park & Ride**: Free shuttle from Whitstable Rugby Club',
          '**Train**: Regular services from London Victoria (90 mins)',
          '**Parking**: Very limited — please use public transport',
          'Harbour Street and surrounding areas closed to traffic.',
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
      {
        heading: 'Beach car parks',
        content: [
          '**Tankerton Slopes** — Marine Parade, seasonal rates, arrive early in summer',
          '**Long Beach** — Pay & display, can flood at high tide (check notices)',
        ],
      },
      {
        heading: 'Tips',
        content: [
          'Download the **RingGo** app for easy payment.',
          'Most car parks fill by 10am on sunny weekends.',
          'Blue badge holders: Free parking in all council car parks.',
          'Consider Park & Ride during festivals and busy summer weekends.',
        ],
      },
      {
        heading: 'Resident permits',
        content: [
          'Apply through Canterbury City Council for annual permits.',
          'Needed for zone-restricted streets.',
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
          '**West Beach**: Pebble/shingle, good swimming at high tide, popular with families, cafes nearby',
          '**Tankerton Beach**: Longer stretch, the famous "Street" visible at low tide, quieter, beach huts',
          '**Long Beach** (towards Seasalter): More secluded, dog-friendly year-round, great for walks',
        ],
      },
      {
        heading: 'Facilities',
        content: [
          'Public toilets at West Beach and Tankerton Slopes.',
          'Beach huts available for hire (book well in advance).',
          'RNLI lifeguards patrol in summer — check flags.',
        ],
      },
      {
        heading: 'Safety flags',
        content: [
          '🚩 **Red flag**: No swimming',
          '🚩 **Yellow flag**: Caution, weak swimmers stay out',
          '🏁 **Checkered flag**: Safe swimming area',
        ],
      },
      {
        heading: 'Dogs on beaches',
        content: [
          'Dogs allowed all year at Long Beach.',
          'Seasonal restrictions on West Beach and Tankerton (May-September).',
          'Always clean up after your dog.',
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
      {
        heading: 'Local services',
        content: [
          '**Whitstable Police Station**: 25 High Street, CT5 1AP',
          '**Nearest A&E**: Kent & Canterbury Hospital, Canterbury CT1 3NG — 01227 766877',
        ],
      },
      {
        heading: 'Useful numbers',
        content: [
          '**Coast Guard**: 999 (ask for Coast Guard)',
          '**Whitstable Lifeboat**: 01227 262166',
          '**Canterbury City Council**: 01227 862000',
          '**Gas emergency**: 0800 111 999',
          '**Power cuts**: 0800 31 63 105',
          '**Flooding**: Environment Agency 0800 80 70 60',
        ],
      },
      {
        heading: 'Local medical',
        content: [
          '**Whitstable Medical Practice**: Harbour Street, 01227 594400',
          '**Out of hours**: Call 111',
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
          '**Address**: Council Offices, Military Road, Canterbury CT1 1YW',
        ],
      },
      {
        heading: 'Useful departments',
        content: [
          '**Council Tax**: 01227 862056',
          '**Housing**: 01227 862030',
          '**Planning**: 01227 862178',
          '**Environmental Health**: 01227 862100',
          '**Parking Services**: 01227 862545',
        ],
      },
      {
        heading: 'Reporting issues',
        content: [
          '**Fly-tipping**: Report online or call 01227 862000',
          '**Potholes**: Report through Kent County Council',
          '**Streetlights**: KCC — 03000 41 81 81',
          '**Noise complaints**: Environmental Health',
        ],
      },
    ],
  },
  'school-term-dates': {
    title: 'School Term Dates',
    sections: [
      {
        heading: 'Autumn term 2024',
        content: [
          '**Start**: Tuesday 3 September 2024',
          '**Half term**: 28 October - 1 November 2024',
          '**End**: Friday 20 December 2024',
        ],
      },
      {
        heading: 'Spring term 2025',
        content: [
          '**Start**: Monday 6 January 2025',
          '**Half term**: 17-21 February 2025',
          '**End**: Friday 4 April 2025',
        ],
      },
      {
        heading: 'Summer term 2025',
        content: [
          '**Start**: Tuesday 22 April 2025',
          '**Half term**: 26-30 May 2025',
          '**End**: Tuesday 22 July 2025',
        ],
      },
      {
        heading: 'Local schools',
        content: [
          'Whitstable Junior School',
          'Joy Lane Primary School',
          'Swalecliffe Community Primary',
          'The Whitstable School',
          'Each school sets their own INSET days — check with your school.',
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
          '**Estuary View Medical Centre**: Boorman Way, CT5 3SE — 01227 284100',
        ],
      },
      {
        heading: 'Dentists',
        content: [
          '**Whitstable Dental Practice**: 39 High Street — 01227 273322',
          '**Coast Dental**: Oxford Street — 01227 262280',
          'Finding an NHS dentist can be difficult. Use the NHS Find a Dentist tool or call 111.',
        ],
      },
      {
        heading: 'Pharmacies',
        content: [
          '**Boots**: 41 High Street — 01227 273414',
          '**Lloyds**: 24 Oxford Street — 01227 262888',
        ],
      },
      {
        heading: 'Vets',
        content: [
          '**Westgate Veterinary Surgery**: 7 Station Road, CT5 1QT — 01227 273223 (24hr emergency)',
          '**Companion Care** (Pets at Home): Thanet Way Retail Park — 01227 771174',
        ],
      },
      {
        heading: 'Opticians',
        content: [
          '**Specsavers**: 38 High Street — 01227 264955',
          '**Blacks Opticians**: 12 Oxford Street — 01227 273880',
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
          "The Whitstable Carnival is a traditional summer celebration held annually since the 1930s.",
        ],
      },
      {
        heading: 'Events',
        content: [
          '**Carnival Procession**: Starting from Tankerton, ending at the harbour',
          '**Float competition**: Enter your community group!',
          '**Fancy dress**: Categories for all ages',
          '**Beach activities**: Sandcastle competition, games',
          '**Live entertainment**: Music, dancing, performers',
        ],
      },
      {
        heading: 'Getting involved',
        content: [
          '**Enter a float**: Contact the carnival committee by June',
          '**Volunteer marshals needed**: Help keep the procession safe',
          '**Sponsor the event**: Business sponsorship opportunities',
        ],
      },
      {
        heading: 'Road closures',
        content: [
          'The carnival route (Tankerton Road, Oxford Street, Harbour Street) will be closed 11am-5pm.',
        ],
      },
    ],
  },
};

interface InfoPageProps {
  params: { slug: string };
}

export default async function InfoDetailPage({ params }: InfoPageProps) {
  const { slug } = params;
  const info = infoContent[slug];
  const config = pageConfig[slug];

  if (!info) {
    notFound();
  }

  // Render content with basic markdown
  const renderText = (text: string) => {
    // Handle bold text
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
      <div className={`${config?.bgColor || 'bg-sky'} px-4 py-5`}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/info" className="text-white/80 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-white font-bold text-xl">{info.title.toLowerCase()}</h1>
            {config?.subtitle && (
              <p className="text-white/70 text-sm">{config.subtitle}</p>
            )}
          </div>
          {config?.icon && (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
              {config.icon}
            </div>
          )}
        </div>

        {/* Quick facts */}
        {config?.quickFacts && config.quickFacts.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {config.quickFacts.map((fact, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 text-white/70 text-xs mb-0.5">
                  {fact.icon}
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
        {info.sections.map((section, i) => (
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
        {config?.links && config.links.length > 0 && (
          <div className="pt-4 border-t border-oyster-100">
            <h2 className="text-base font-bold text-ink mb-3 lowercase">useful links</h2>
            <div className="space-y-2">
              {config.links.map((link, i) => (
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
  return Object.keys(infoContent).map((slug) => ({ slug }));
}
