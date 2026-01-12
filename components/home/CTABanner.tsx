import Link from 'next/link';
import { Store, ArrowRight } from 'lucide-react';

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
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Store className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-lg font-bold text-white mb-2">
            own a local business?
          </h2>
          <p className="text-sm text-white/80 mb-4">
            join 50+ Whitstable shops and reach more locals
          </p>

          <Link
            href="/auth/signup?role=shop_owner"
            className="inline-flex items-center gap-2 bg-white text-sky font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors tap-effect"
          >
            add your shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
