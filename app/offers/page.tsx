import { Tag, Filter, Calendar } from "lucide-react";
import { Button, Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { OfferCard } from "@/components/offers";
import type { Offer, Shop } from "@/types/database";

// Mock offers data
const mockOffers: (Offer & { shop: Pick<Shop, 'name' | 'slug'> })[] = [
  {
    id: "1",
    shop_id: "1",
    shop: { name: "Wheeler's Oyster Bar", slug: "wheelers-oyster-bar" },
    title: "10% off Tuesday lunches",
    description: "Enjoy 10% off your bill when you visit us for lunch on Tuesdays. Perfect for a mid-week treat!",
    valid_from: "2025-01-01",
    valid_until: "2025-03-31",
    is_ongoing: false,
    terms: "Not valid with other offers. Lunch service only.",
    offer_type: "discount",
    is_active: true,
    view_count: 156,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    shop_id: "2",
    shop: { name: "The Cheese Box", slug: "the-cheese-box" },
    title: "Free cheese tasting with any purchase over £20",
    description: "Sample our artisan cheese selection when you spend £20 or more in store.",
    valid_from: "2025-01-01",
    valid_until: null,
    is_ongoing: true,
    terms: "Subject to availability.",
    offer_type: "freebie",
    is_active: true,
    view_count: 89,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "3",
    shop_id: "3",
    shop: { name: "JoJo's", slug: "jojos" },
    title: "Kids eat free on Sundays",
    description: "One free kids meal with every adult main course ordered. Perfect for family Sunday lunch!",
    valid_from: "2025-01-01",
    valid_until: null,
    is_ongoing: true,
    terms: "One child per paying adult. Under 12s only.",
    offer_type: "freebie",
    is_active: true,
    view_count: 234,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "4",
    shop_id: "4",
    shop: { name: "Harbour Street Books", slug: "harbour-street-books" },
    title: "Buy 2, get 3rd book half price",
    description: "Build your reading list and save! Buy any two books and get your third at 50% off.",
    valid_from: "2025-01-01",
    valid_until: "2025-01-31",
    is_ongoing: false,
    terms: "Cheapest book discounted. Excludes special editions.",
    offer_type: "bundle",
    is_active: true,
    view_count: 67,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "5",
    shop_id: "5",
    shop: { name: "Frank", slug: "frank" },
    title: "Loyalty card - 9th drink free",
    description: "Pick up a loyalty card and get your 9th hot drink absolutely free!",
    valid_from: "2024-01-01",
    valid_until: null,
    is_ongoing: true,
    terms: "One stamp per visit. Card must be presented.",
    offer_type: "loyalty",
    is_active: true,
    view_count: 445,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    shop_id: "6",
    shop: { name: "Windy Corner Stores", slug: "windy-corner-stores" },
    title: "15% off local produce Thursdays",
    description: "Support local producers and save! All local Kent produce 15% off every Thursday.",
    valid_from: "2025-01-01",
    valid_until: null,
    is_ongoing: true,
    terms: "Local produce section only.",
    offer_type: "discount",
    is_active: true,
    view_count: 123,
    created_at: "2025-01-01T00:00:00Z",
  },
];

export const metadata = {
  title: "Deals & Offers",
  description: "Special offers and deals from local Whitstable shops",
};

export default function OffersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Tag className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Deals & Offers</h1>
          <p className="text-oyster-600">
            Special offers from local shops
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-oyster-900">{mockOffers.length}</p>
          <p className="text-sm text-oyster-500">Active Offers</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-oyster-900">
            {mockOffers.filter(o => o.is_ongoing).length}
          </p>
          <p className="text-sm text-oyster-500">Ongoing Deals</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-oyster-900">
            {new Set(mockOffers.map(o => o.shop_id)).size}
          </p>
          <p className="text-sm text-oyster-500">Participating Shops</p>
        </Card>
      </div>

      {/* Filters & Tabs */}
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Offers</TabsTrigger>
            <TabsTrigger value="discount">Discounts</TabsTrigger>
            <TabsTrigger value="freebie">Freebies</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <div className="grid sm:grid-cols-2 gap-4">
            {mockOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discount">
          <div className="grid sm:grid-cols-2 gap-4">
            {mockOffers
              .filter((o) => o.offer_type === "discount")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="freebie">
          <div className="grid sm:grid-cols-2 gap-4">
            {mockOffers
              .filter((o) => o.offer_type === "freebie")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="loyalty">
          <div className="grid sm:grid-cols-2 gap-4">
            {mockOffers
              .filter((o) => o.offer_type === "loyalty")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA for shops */}
      <Card className="mt-8 bg-ocean-50 border-ocean-200 text-center">
        <Tag className="h-10 w-10 text-ocean-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-oyster-900 mb-2">
          Are you a local shop owner?
        </h2>
        <p className="text-oyster-600 mb-4 max-w-md mx-auto">
          Add your offers to reach thousands of locals and visitors looking for
          great deals in Whitstable.
        </p>
        <Button>Add Your Offer</Button>
      </Card>
    </div>
  );
}
