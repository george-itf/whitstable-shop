import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Default pages to seed
const DEFAULT_PAGES = [
  {
    slug: 'tide-times',
    title: 'Tide Times',
    subtitle: 'harbour & tankerton',
    icon: 'Waves',
    color: 'text-sky',
    bg_color: 'bg-sky',
    display_order: 0,
    quick_facts: [
      { label: 'Location', value: 'Whitstable Harbour' },
      { label: 'Tidal range', value: '~4-5m (springs)' },
    ],
    links: [
      { label: 'BBC Weather Tides', url: 'https://www.bbc.co.uk/weather/coast-and-sea/tide-tables', description: '14-day forecast' },
      { label: 'Magic Seaweed', url: 'https://magicseaweed.com', description: 'Surf & sea conditions' },
    ],
    sections: [
      {
        heading: 'About tides in Whitstable',
        content: [
          'Whitstable has a semi-diurnal tide pattern with two high tides and two low tides each day.',
          'The tidal range is typically 4-5 metres during spring tides.',
        ],
      },
    ],
  },
  {
    slug: 'bin-collection',
    title: 'Bin Collection',
    subtitle: 'check your day',
    icon: 'Trash2',
    color: 'text-green',
    bg_color: 'bg-emerald-500',
    display_order: 1,
    quick_facts: [
      { label: 'Collection day', value: 'Tuesdays' },
      { label: 'This week', value: 'Blue lid (recycling)' },
    ],
    links: [
      { label: 'Check your collection day', url: 'https://www.canterbury.gov.uk/bins', description: 'Canterbury City Council' },
      { label: 'Report missed collection', url: 'https://www.canterbury.gov.uk/bins/missed', description: 'Within 48 hours' },
    ],
    sections: [
      {
        heading: 'Collection schedule',
        content: [
          'Most Whitstable addresses are collected on **Tuesdays**.',
          'Put bins out by 7am on collection day.',
          '**Week A (Green Lid)**: General waste + food waste',
          '**Week B (Blue Lid)**: Recycling + food waste',
        ],
      },
    ],
  },
  {
    slug: 'beach-info',
    title: 'Beaches',
    subtitle: 'west beach, tankerton, long beach',
    icon: 'Sun',
    color: 'text-amber-500',
    bg_color: 'bg-amber-500',
    display_order: 2,
    quick_facts: [
      { label: 'Water quality', value: 'Excellent' },
      { label: 'Dogs allowed', value: 'Long Beach (all year)' },
    ],
    links: [
      { label: 'Beach hut hire', url: 'https://www.canterbury.gov.uk/beach-huts', description: 'Book in advance' },
      { label: 'Water quality', url: 'https://environment.data.gov.uk/bwq', description: 'Environment Agency' },
    ],
  },
  {
    slug: 'parking',
    title: 'Parking',
    subtitle: 'gorrell tank, harbour, slopes',
    icon: 'Car',
    color: 'text-violet-500',
    bg_color: 'bg-violet-500',
    display_order: 3,
    quick_facts: [
      { label: 'Best option', value: 'Gorrell Tank' },
      { label: 'Day rate', value: '£8 max' },
    ],
    links: [
      { label: 'RingGo parking app', url: 'https://myringgo.co.uk', description: 'Pay by phone' },
      { label: 'Resident permits', url: 'https://www.canterbury.gov.uk/parking-permits', description: 'Apply online' },
    ],
  },
  {
    slug: 'oyster-festival',
    title: 'Oyster Festival',
    subtitle: 'annual celebration since 1985',
    icon: 'Music',
    color: 'text-coral',
    bg_color: 'bg-coral',
    display_order: 4,
    quick_facts: [
      { label: '2025 dates', value: '26-27 July' },
      { label: 'Main event', value: 'Oyster Parade 10am Sat' },
    ],
    links: [
      { label: 'Official festival website', url: 'https://whitstableoysterfestival.co.uk', description: 'Programme & tickets' },
    ],
  },
  {
    slug: 'carnival',
    title: 'Carnival',
    subtitle: 'annual summer celebration',
    icon: 'Music',
    color: 'text-pink-500',
    bg_color: 'bg-pink-500',
    display_order: 5,
    quick_facts: [
      { label: '2025 date', value: '9 August (TBC)' },
    ],
  },
  {
    slug: 'emergency-contacts',
    title: 'Emergency',
    subtitle: '999, coast guard, NHS 111',
    icon: 'Phone',
    color: 'text-red-500',
    bg_color: 'bg-red-500',
    display_order: 6,
    quick_facts: [
      { label: 'Emergency', value: '999' },
      { label: 'Non-emergency', value: '101 or 111' },
    ],
  },
  {
    slug: 'healthcare',
    title: 'Healthcare',
    subtitle: 'GPs, dentists, pharmacies, vets',
    icon: 'Stethoscope',
    color: 'text-teal-500',
    bg_color: 'bg-teal-500',
    display_order: 7,
    quick_facts: [
      { label: 'Out of hours', value: 'Call 111' },
    ],
    links: [
      { label: 'Find an NHS dentist', url: 'https://www.nhs.uk/service-search/find-a-dentist', description: 'NHS website' },
      { label: 'Register with a GP', url: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/', description: 'NHS guide' },
    ],
  },
  {
    slug: 'council-contacts',
    title: 'Council',
    subtitle: 'Canterbury City Council',
    icon: 'Building',
    color: 'text-slate-500',
    bg_color: 'bg-slate-500',
    display_order: 8,
    quick_facts: [
      { label: 'Main number', value: '01227 862000' },
    ],
    links: [
      { label: 'Council website', url: 'https://www.canterbury.gov.uk', description: 'Online services' },
      { label: 'Report an issue', url: 'https://www.canterbury.gov.uk/report', description: 'Fly-tipping, potholes, etc.' },
    ],
  },
  {
    slug: 'school-term-dates',
    title: 'School Terms',
    subtitle: 'Kent 2024-25 dates',
    icon: 'Calendar',
    color: 'text-indigo-500',
    bg_color: 'bg-indigo-500',
    display_order: 9,
    quick_facts: [
      { label: 'Summer term ends', value: '22 July 2025' },
    ],
    links: [
      { label: 'Kent term dates', url: 'https://www.kent.gov.uk/education-and-children/schools/term-dates', description: 'Official KCC dates' },
    ],
  },
];

/**
 * POST /api/admin/local-info/seed
 * Seed default local info pages (admin only)
 */
export async function POST() {
  try {
    const supabase = await createClient();

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get existing slugs
    const { data: existing } = await supabase
      .from('local_info_pages')
      .select('slug');

    const existingSlugs = new Set((existing || []).map((p: { slug: string }) => p.slug));

    // Filter out pages that already exist
    const pagesToInsert = DEFAULT_PAGES.filter(p => !existingSlugs.has(p.slug));

    if (pagesToInsert.length === 0) {
      return NextResponse.json({
        message: 'All default pages already exist',
        inserted: 0
      });
    }

    // Insert new pages
    const { data, error } = await supabase
      .from('local_info_pages')
      .insert(pagesToInsert.map(p => ({
        ...p,
        is_active: true,
      })))
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: `Imported ${data.length} default pages`,
      inserted: data.length,
      pages: data,
    });
  } catch (error) {
    console.error('Error seeding local info pages:', error);
    return NextResponse.json(
      { error: 'Failed to seed local info pages' },
      { status: 500 }
    );
  }
}
