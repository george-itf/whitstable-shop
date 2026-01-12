import Link from 'next/link';

const communityCards = [
  {
    href: '/awards',
    title: 'Awards',
    description: 'Nominate local heroes',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: 'bg-yellow/10 text-yellow',
  },
  {
    href: '/community',
    title: 'Community',
    description: 'Connect with locals',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: 'bg-sky-light text-sky',
  },
  {
    href: '/ask',
    title: 'Ask a Local',
    description: 'Get local answers',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: 'bg-green-light text-green',
  },
  {
    href: '/photos',
    title: 'Photos',
    description: 'Share & win prizes',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    color: 'bg-coral-light text-coral',
  },
];

export default function CommunitySection() {
  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold text-ink mb-4">Community</h2>
      <div className="grid grid-cols-2 gap-3">
        {communityCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col items-center p-4 bg-white rounded-card border border-grey-light hover:border-sky transition-colors"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${card.color}`}
            >
              {card.icon}
            </div>
            <span className="font-semibold text-ink text-sm">{card.title}</span>
            <span className="text-xs text-grey mt-0.5">{card.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
