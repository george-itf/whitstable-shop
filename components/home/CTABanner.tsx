import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Friendly shop owner illustration
const ShopOwnerIllustration = () => (
  <svg viewBox="0 0 48 56" fill="none" className="w-12 h-14">
    {/* Head */}
    <circle cx="24" cy="14" r="10" fill="#FDFCFB" stroke="#4A8BA8" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="20" cy="12" r="1.5" fill="#3D3D3D" />
    <circle cx="28" cy="12" r="1.5" fill="#3D3D3D" />
    {/* Rosy cheeks */}
    <circle cx="17" cy="15" r="2" fill="#C9705B" opacity="0.3" />
    <circle cx="31" cy="15" r="2" fill="#C9705B" opacity="0.3" />
    {/* Smile */}
    <path d="M20 17c2 2 6 2 8 0" stroke="#C9705B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Body with apron */}
    <rect x="14" y="24" width="20" height="28" rx="2" fill="#C9705B" />
    <rect x="18" y="28" width="12" height="20" rx="1" fill="#FDFCFB" />
    {/* Apron strings */}
    <path d="M18 28c-2-2-4 0-4 2" stroke="#FDFCFB" strokeWidth="1.5" />
    <path d="M30 28c2-2 4 0 4 2" stroke="#FDFCFB" strokeWidth="1.5" />
    {/* Apron pocket with heart */}
    <rect x="20" y="36" width="8" height="6" rx="1" fill="none" stroke="#D1C4B5" strokeWidth="1" />
    <path d="M24 38.5c-.5-.5-1.5-.5-1.5.5s1 1.5 1.5 2c.5-.5 1.5-1 1.5-2s-1-1-1.5-.5z" fill="#C9705B" />
  </svg>
);

export default function CTABanner() {
  return (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-br from-sky to-sky-dark rounded-2xl p-5 text-center relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)"/>
          </svg>
        </div>

        <div className="relative">
          <div className="mx-auto mb-3 flex justify-center">
            <ShopOwnerIllustration />
          </div>

          <h2 className="text-lg font-bold text-white mb-2 font-display">
            run a lovely local shop?
          </h2>
          <p className="text-sm text-white/80 mb-4 font-handwritten text-base">
            join 50+ Whitstable businesses & reach more locals
          </p>

          <Link
            href="/auth/signup?role=shop_owner"
            className="inline-flex items-center gap-2 bg-white text-sky font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors tap-effect font-display"
          >
            add your shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
