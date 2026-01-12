import Link from 'next/link';

// Mock deals - will be replaced with Supabase data
const mockDeals = [
  {
    id: '1',
    shopName: 'The Forge',
    title: '10% off lunches',
    validUntil: 'Ends Sunday',
  },
  {
    id: '2',
    shopName: 'Harbour Books',
    title: 'Buy 2 get 1 free',
    validUntil: 'This week only',
  },
  {
    id: '3',
    shopName: "Samphire",
    title: 'Free dessert with mains',
    validUntil: 'Weekdays only',
  },
];

export default function DealsPreview() {
  return (
    <section className="py-6">
      <div className="px-4 flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-ink">Local Deals</h2>
        <Link
          href="/offers"
          className="text-sm text-sky font-medium hover:underline"
        >
          See all
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {mockDeals.map((deal) => (
            <Link
              key={deal.id}
              href="/offers"
              className="flex-shrink-0 w-48 p-3 bg-coral-light rounded-card border border-coral/20 hover:border-coral transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-coral"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span className="text-xs text-coral font-medium">
                  {deal.validUntil}
                </span>
              </div>
              <p className="font-semibold text-ink text-sm mb-0.5">
                {deal.title}
              </p>
              <p className="text-xs text-grey">{deal.shopName}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
