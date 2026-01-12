import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-white py-8 px-4">
      <div className="space-y-6">
        {/* Logo */}
        <div>
          <span className="text-xl font-bold">whitstable.shop</span>
          <p className="text-grey text-sm mt-1">
            Your local guide to Whitstable, Kent
          </p>
        </div>

        {/* Links - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase text-grey">
              Explore
            </h4>
            <ul className="space-y-1">
              <FooterLink href="/shops">All Shops</FooterLink>
              <FooterLink href="/map">Map</FooterLink>
              <FooterLink href="/events">What&apos;s On</FooterLink>
              <FooterLink href="/info">Local Info</FooterLink>
              <FooterLink href="/offers">Deals</FooterLink>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase text-grey">
              Community
            </h4>
            <ul className="space-y-1">
              <FooterLink href="/community">Community Hub</FooterLink>
              <FooterLink href="/awards">Awards</FooterLink>
              <FooterLink href="/ask">Ask a Local</FooterLink>
              <FooterLink href="/photos">Photos</FooterLink>
              <FooterLink href="/report">Report Issue</FooterLink>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase text-grey">
              Account
            </h4>
            <ul className="space-y-1">
              <FooterLink href="/auth/login">Log In</FooterLink>
              <FooterLink href="/auth/signup">Sign Up</FooterLink>
              <FooterLink href="/saved">Saved</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/settings/profile">Settings</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase text-grey">
              Legal
            </h4>
            <ul className="space-y-1">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-grey-dark text-grey text-sm">
          <p>&copy; {new Date().getFullYear()} whitstable.shop</p>
          <p className="mt-1">Made with love for Whitstable</p>
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
        className="text-grey-light hover:text-white transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  );
}
