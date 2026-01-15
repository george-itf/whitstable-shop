import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-driftwood-800 text-driftwood-100 pt-8 pb-28 px-4 relative overflow-hidden">
      {/* Chalk texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative space-y-8">
        {/* Header with seagull */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xl font-semibold font-display text-white">whitstable.shop</span>
            <p className="text-driftwood-400 text-sm mt-1 font-handwritten text-lg">
              your local guide since 2024
            </p>
          </div>
          <div className="w-20 h-20 relative opacity-90">
            <Image
              src="/brand/seagull-wave.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Notice board style links */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-handwritten text-xl text-driftwood-300 mb-3">
              explore
            </h4>
            <ul className="space-y-2">
              <FooterLink href="/shops">All Shops</FooterLink>
              <FooterLink href="/map">Town Map</FooterLink>
              <FooterLink href="/events">What&apos;s On</FooterLink>
              <FooterLink href="/info">Local Info</FooterLink>
              <FooterLink href="/offers">Deals &amp; Offers</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-handwritten text-xl text-driftwood-300 mb-3">
              community
            </h4>
            <ul className="space-y-2">
              <FooterLink href="/community">Community Hub</FooterLink>
              <FooterLink href="/awards">Local Awards</FooterLink>
              <FooterLink href="/ask">Ask a Local</FooterLink>
              <FooterLink href="/photos">Photo Gallery</FooterLink>
              <FooterLink href="/report">Report an Issue</FooterLink>
            </ul>
          </div>
        </div>

        {/* Handwritten style tagline */}
        <div className="py-4 border-t border-driftwood-700/50">
          <p className="font-handwritten text-2xl text-center text-driftwood-300 leading-relaxed">
            &ldquo;supporting independent shops<br />& the folk who run them&rdquo;
          </p>
        </div>

        {/* Contact - give us a bell */}
        <div className="text-center py-4 border-b border-driftwood-700/50">
          <p className="font-handwritten text-xl text-driftwood-400 mb-2">
            got a question? give us a bell
          </p>
          <a
            href="tel:07704873632"
            className="inline-flex items-center gap-3 text-white font-display text-2xl hover:text-driftwood-200 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            07704 873 632
          </a>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <div className="flex gap-4">
              <Link href="/privacy" className="text-driftwood-500 hover:text-driftwood-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-driftwood-500 hover:text-driftwood-300 transition-colors">
                Terms
              </Link>
            </div>
            <p className="text-driftwood-600 text-xs">
              &copy; {new Date().getFullYear()} whitstable.shop
            </p>
          </div>

          <p className="text-driftwood-500 text-xs text-right">
            made in Whitstable<br />
            <span className="text-driftwood-600">with salt air & strong tea</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-driftwood-400 hover:text-white transition-colors text-sm inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
