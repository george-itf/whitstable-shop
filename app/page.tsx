import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Notice from '@/components/home/Notice';
import HubButtons from '@/components/home/HubButtons';
import EventsScroll from '@/components/home/EventsScroll';
import LocalInfoGrid from '@/components/home/LocalInfoGrid';
import CTABanner from '@/components/home/CTABanner';

// Mock data - will be replaced with Supabase data
const mockNotice = {
  message: 'Oyster Festival this weekend! Road closures in effect.',
  link: '/info/oyster-festival',
};

const mockEvents = [
  {
    id: '1',
    shop_id: null,
    title: 'Oyster Festival Opening',
    description: 'Annual celebration of Whitstable oysters',
    date: '2025-07-26',
    time_start: '10:00',
    time_end: '18:00',
    location: 'Harbour',
    is_recurring: false,
    recurrence_rule: null,
    status: 'approved' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    shop_id: null,
    title: 'Live Music at The Old Neptune',
    description: 'Weekly live music night',
    date: '2025-07-28',
    time_start: '19:00',
    time_end: '22:00',
    location: 'The Old Neptune',
    is_recurring: true,
    recurrence_rule: 'weekly',
    status: 'approved' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    shop_id: null,
    title: 'Art Walk',
    description: 'Monthly gallery trail',
    date: '2025-08-02',
    time_start: '14:00',
    time_end: '17:00',
    location: 'Town Centre',
    is_recurring: true,
    recurrence_rule: 'monthly',
    status: 'approved' as const,
    created_at: new Date().toISOString(),
  },
];

const mockLocalInfo = [
  { id: '1', title: 'Bin Days', slug: 'bin-collection', content: null, icon: null, display_order: 1, updated_at: new Date().toISOString() },
  { id: '2', title: 'Tide Times', slug: 'tide-times', content: null, icon: null, display_order: 2, updated_at: new Date().toISOString() },
  { id: '3', title: 'Oyster Festival', slug: 'oyster-festival', content: null, icon: null, display_order: 3, updated_at: new Date().toISOString() },
  { id: '4', title: 'Parking', slug: 'parking', content: null, icon: null, display_order: 5, updated_at: new Date().toISOString() },
  { id: '5', title: 'Beach Info', slug: 'beach-info', content: null, icon: null, display_order: 6, updated_at: new Date().toISOString() },
  { id: '6', title: 'Emergency', slug: 'emergency-contacts', content: null, icon: null, display_order: 7, updated_at: new Date().toISOString() },
];

export default function HomePage() {
  return (
    <MobileWrapper>
      {/* Hero section */}
      <Hero />

      {/* Notice bar */}
      <Notice message={mockNotice.message} link={mockNotice.link} />

      {/* Hub buttons - primary navigation */}
      <HubButtons />

      {/* Events - what's happening now */}
      <EventsScroll events={mockEvents} />

      {/* Local info grid - practical information */}
      <LocalInfoGrid items={mockLocalInfo} />

      {/* CTA banner - business signup */}
      <CTABanner />

      {/* Footer */}
      <Footer />

      {/* Bottom navigation */}
      <BottomNav />
    </MobileWrapper>
  );
}
