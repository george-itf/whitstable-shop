import Link from "next/link";
import { Heart, Calendar, Users, ArrowRight, Store, HandHeart } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { CharityCard, CharityEventCard } from "@/components/charity";
import type { Charity, CharityEvent } from "@/types/database";

// Mock data
const featuredCharity: Charity = {
  id: "1",
  name: "Whitstable Lifeboat Station (RNLI)",
  slug: "rnli-whitstable",
  description: "The Royal National Lifeboat Institution saves lives at sea. Our Whitstable lifeboat crew are on call 24/7, 365 days a year.",
  logo_url: null,
  website: "https://rnli.org/find-my-nearest/lifeboat-stations/whitstable-lifeboat-station",
  donation_url: "https://rnli.org/support-us/donate",
  current_campaign: "2025 Lifeboat Fund",
  target_amount: 10000,
  raised_amount: 6250,
  is_active: true,
  is_featured: true,
  created_at: "2024-01-01T00:00:00Z",
};

const charities: Charity[] = [
  {
    id: "2",
    name: "Pilgrims Hospices",
    slug: "pilgrims-hospices",
    description: "Providing expert, compassionate care for people living with an incurable illness.",
    logo_url: null,
    website: "https://pilgrimshospices.org",
    donation_url: "https://pilgrimshospices.org/donate",
    current_campaign: null,
    target_amount: null,
    raised_amount: 0,
    is_active: true,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Whitstable Community Museum",
    slug: "whitstable-museum",
    description: "Preserving and sharing Whitstable's rich maritime heritage and local history.",
    logo_url: null,
    website: "https://whitstablemuseum.org",
    donation_url: null,
    current_campaign: "Heritage Preservation Fund",
    target_amount: 5000,
    raised_amount: 2100,
    is_active: true,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Surfers Against Sewage",
    slug: "surfers-against-sewage",
    description: "Protecting the UK's beaches and ocean for everyone to enjoy.",
    logo_url: null,
    website: "https://sas.org.uk",
    donation_url: "https://sas.org.uk/donate",
    current_campaign: null,
    target_amount: null,
    raised_amount: 0,
    is_active: true,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
];

const upcomingEvents: (CharityEvent & { charity_name: string })[] = [
  {
    id: "1",
    charity_id: "4",
    charity_name: "Surfers Against Sewage",
    title: "Winter Beach Cleanup",
    description: "Join us for our monthly beach cleanup. All equipment provided!",
    date: "2025-01-18",
    time_start: "10:00",
    time_end: "12:00",
    location: "West Beach Car Park",
    signup_url: "https://example.com/signup",
    max_participants: 30,
    current_participants: 22,
    event_type: "cleanup",
    is_active: true,
    created_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "2",
    charity_id: "1",
    charity_name: "RNLI Whitstable",
    title: "Lifeboat Station Open Day",
    description: "Meet the crew, see the lifeboat, and learn about sea safety.",
    date: "2025-01-25",
    time_start: "11:00",
    time_end: "15:00",
    location: "Whitstable Lifeboat Station",
    signup_url: null,
    max_participants: null,
    current_participants: 0,
    event_type: "awareness",
    is_active: true,
    created_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "3",
    charity_id: "2",
    charity_name: "Pilgrims Hospices",
    title: "Charity Quiz Night",
    description: "Test your knowledge and raise money for Pilgrims Hospices.",
    date: "2025-02-01",
    time_start: "19:00",
    time_end: null,
    location: "The Old Neptune",
    signup_url: "https://example.com/quiz",
    max_participants: 60,
    current_participants: 48,
    event_type: "fundraiser",
    is_active: true,
    created_at: "2024-12-01T00:00:00Z",
  },
];

export const metadata = {
  title: "Community Hub",
  description: "Support local charities and volunteer opportunities in Whitstable",
};

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart className="h-6 w-6 text-rose-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Community Hub</h1>
          <p className="text-oyster-600">
            Support local causes and make a difference
          </p>
        </div>
      </div>

      {/* Featured Charity */}
      <section className="mb-12">
        <CharityCard charity={featuredCharity} variant="featured" />
      </section>

      {/* Stats */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">8</div>
              <div className="text-rose-100 text-sm">Local Charities</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-rose-100 text-sm">Upcoming Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">15</div>
              <div className="text-rose-100 text-sm">Shops That Give Back</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">£8.2k</div>
              <div className="text-rose-100 text-sm">Raised This Year</div>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-oyster-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ocean-600" />
                Upcoming Events
              </h2>
              <Link
                href="/community/events"
                className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <CharityEventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Local Charities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-oyster-900">
                Local Charities
              </h2>
              <Link
                href="/community/charities"
                className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
              >
                All →
              </Link>
            </div>
            <div className="space-y-4">
              {charities.slice(0, 3).map((charity) => (
                <CharityCard key={charity.id} charity={charity} />
              ))}
            </div>
          </section>

          {/* Shops That Give Back */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-ocean-600" />
              <h3 className="font-semibold text-oyster-900">
                Shops That Give Back
              </h3>
            </div>
            <p className="text-sm text-oyster-600 mb-4">
              These local businesses support community causes through donations,
              partnerships, or volunteer work.
            </p>
            <div className="space-y-3">
              {["Wheeler's Oyster Bar", "The Cheese Box", "Frank"].map((shop, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-oyster-100 last:border-0"
                >
                  <span className="text-oyster-900">{shop}</span>
                  <Badge variant="success" size="sm">
                    <HandHeart className="h-3 w-3 mr-1" />
                    Gives Back
                  </Badge>
                </div>
              ))}
            </div>
            <Link href="/shops?filter=gives-back" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All
              </Button>
            </Link>
          </Card>

          {/* CTA */}
          <Card className="bg-ocean-50 border-ocean-200">
            <h3 className="font-semibold text-oyster-900 mb-2">
              Know a local charity?
            </h3>
            <p className="text-sm text-oyster-600 mb-4">
              Help us expand our community hub by suggesting local causes and
              organisations.
            </p>
            <Link href="/report">
              <Button size="sm" className="w-full">
                Suggest a Charity
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
