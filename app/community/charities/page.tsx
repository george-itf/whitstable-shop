import Link from "next/link";
import { ChevronLeft, Heart, Search } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { CharityCard } from "@/components/charity";
import type { Charity } from "@/types/database";

const charities: Charity[] = [
  {
    id: "1",
    name: "Whitstable Lifeboat Station (RNLI)",
    slug: "rnli-whitstable",
    description: "The Royal National Lifeboat Institution saves lives at sea. Our Whitstable lifeboat crew are on call 24/7, 365 days a year.",
    logo_url: null,
    website: "https://rnli.org",
    donation_url: "https://rnli.org/support-us/donate",
    current_campaign: "2025 Lifeboat Fund",
    target_amount: 10000,
    raised_amount: 6250,
    is_active: true,
    is_featured: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Pilgrims Hospices",
    slug: "pilgrims-hospices",
    description: "Providing expert, compassionate care for people living with an incurable illness in east Kent.",
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
    description: "Preserving and sharing Whitstable's rich maritime heritage and local history for future generations.",
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
    description: "Protecting the UK's beaches and ocean for everyone to enjoy. Regular beach cleanups and campaigns.",
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
  {
    id: "5",
    name: "Whitstable Castle",
    slug: "whitstable-castle",
    description: "Supporting the preservation and community use of Whitstable Castle and its grounds.",
    logo_url: null,
    website: "https://whitstablecastle.co.uk",
    donation_url: null,
    current_campaign: "Castle Restoration",
    target_amount: 15000,
    raised_amount: 8500,
    is_active: true,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Canterbury Food Bank",
    slug: "canterbury-food-bank",
    description: "Providing emergency food supplies to local people in crisis across the Canterbury district.",
    logo_url: null,
    website: "https://canterbury.foodbank.org.uk",
    donation_url: "https://canterbury.foodbank.org.uk/give-help/donate-money",
    current_campaign: null,
    target_amount: null,
    raised_amount: 0,
    is_active: true,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const metadata = {
  title: "Local Charities",
  description: "Support local charities and causes in Whitstable",
};

export default function CharitiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/community">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Community Hub
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart className="h-6 w-6 text-rose-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Local Charities</h1>
          <p className="text-oyster-600">
            {charities.length} causes making a difference in our community
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-oyster-400" />
          <input
            type="text"
            placeholder="Search charities..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-oyster-300 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
          />
        </div>
      </div>

      {/* Charities Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {charities.map((charity) => (
          <CharityCard key={charity.id} charity={charity} />
        ))}
      </div>

      {/* CTA */}
      <Card className="mt-8 text-center">
        <Heart className="h-12 w-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-oyster-900 mb-2">
          Know a local charity we&apos;re missing?
        </h2>
        <p className="text-oyster-600 mb-6 max-w-md mx-auto">
          Help us support more local causes by suggesting charities and
          organisations in the Whitstable area.
        </p>
        <Link href="/report">
          <Button>Suggest a Charity</Button>
        </Link>
      </Card>
    </div>
  );
}
