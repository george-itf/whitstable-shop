import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-oyster-900 text-white py-8 px-4 pb-24">
      <div className="space-y-6">
        {/* Logo */}
        <div>
          <span className="text-xl font-bold">whitstable.shop</span>
          <p className="text-oyster-400 text-sm mt-1">
            your local guide to Whitstable, Kent
          </p>
        </div>

        {/* Links - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {/* Explore */}
          <div>
            <h4 className="font-bold mb-2.5 text-xs uppercase tracking-wider text-oyster-500">
              explore
            </h4>
            <ul className="space-y-1.5">
              <FooterLink href="/shops">All Shops</FooterLink>
              <FooterLink href="/map">Map</FooterLink>
              <FooterLink href="/events">What&apos;s On</FooterLink>
              <FooterLink href="/info">Local Info</FooterLink>
              <FooterLink href="/offers">Deals</FooterLink>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold mb-2.5 text-xs uppercase tracking-wider text-oyster-500">
              community
            </h4>
            <ul className="space-y-1.5">
              <FooterLink href="/community">Community Hub</FooterLink>
              <FooterLink href="/awards">Awards</FooterLink>
              <FooterLink href="/ask">Ask a Local</FooterLink>
              <FooterLink href="/photos">Photos</FooterLink>
              <FooterLink href="/report">Report Issue</FooterLink>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-2.5 text-xs uppercase tracking-wider text-oyster-500">
              account
            </h4>
            <ul className="space-y-1.5">
              <FooterLink href="/auth/login">Log In</FooterLink>
              <FooterLink href="/auth/signup">Sign Up</FooterLink>
              <FooterLink href="/saved">Saved</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/settings/profile">Settings</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-2.5 text-xs uppercase tracking-wider text-oyster-500">
              legal
            </h4>
            <ul className="space-y-1.5">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-oyster-700/50">
          <p className="text-oyster-400 text-sm">
            &copy; {new Date().getFullYear()} whitstable.shop
          </p>
          <p className="mt-1 text-oyster-500 text-sm flex items-center gap-1">
            made with <Heart className="w-3.5 h-3.5 text-coral fill-coral" /> for Whitstable
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
        className="text-oyster-300 hover:text-white transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  );
}
