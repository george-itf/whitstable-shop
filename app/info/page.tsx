'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Waves, PartyPopper, Music, Car, Sun, Phone, Building, Calendar, Stethoscope, ChevronRight, ArrowLeft } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';

export default function InfoPage() {
  return (
    <MobileWrapper>
      {/* Custom header with character */}
      <div className="bg-sky px-4 pt-4 pb-6 relative overflow-hidden">
        {/* Subtle wave pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0 10 Q25 0, 50 10 T100 10 V20 H0Z" fill="currentColor" className="text-white" />
          </svg>
        </div>

        <div className="relative">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            back
          </Link>
          <h1 className="text-white font-bold text-2xl">the local know-how</h1>
          <p className="text-white/70 text-sm mt-1">stuff you actually need to know</p>
        </div>
      </div>

      <div className="px-4 py-5 pb-24 -mt-2">
        {/* Daily essentials - the stuff you check often */}
        <div className="bg-white rounded-2xl shadow-sm border border-oyster-100 overflow-hidden mb-5">
          <div className="grid grid-cols-2 divide-x divide-oyster-100">
            {/* Tide times */}
            <Link href="/info/tide-times" className="p-4 hover:bg-sky-light/30 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-sky font-medium">tides</span>
              </div>
              <p className="font-bold text-ink text-sm group-hover:text-sky transition-colors">is the sea in?</p>
              <p className="text-xs text-grey mt-0.5">check before you go</p>
            </Link>

            {/* Bins */}
            <Link href="/info/bin-collection" className="p-4 hover:bg-emerald-50/50 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-emerald-600 font-medium">bins</span>
              </div>
              <p className="font-bold text-ink text-sm group-hover:text-emerald-600 transition-colors">recycling week?</p>
              <p className="text-xs text-grey mt-0.5">the eternal question</p>
            </Link>
          </div>
        </div>

        {/* Beach & Parking - summer essentials */}
        <h2 className="text-xs font-bold text-grey uppercase tracking-wider mb-3 px-1">beach day sorted</h2>
        <div className="space-y-2 mb-6">
          <Link
            href="/info/beach-info"
            className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-sm">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink group-hover:text-amber-700 transition-colors">beach essentials</p>
              <p className="text-sm text-amber-700/70">tankerton slopes, west beach & beyond</p>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/info/parking"
            className="flex items-center gap-4 bg-white rounded-xl p-4 border border-oyster-100 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-500 flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink group-hover:text-violet-600 transition-colors">where to park</p>
              <p className="text-sm text-grey">arrive early in summer, trust us</p>
            </div>
            <ChevronRight className="w-5 h-5 text-oyster-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Annual highlights */}
        <h2 className="text-xs font-bold text-grey uppercase tracking-wider mb-3 px-1">mark your calendar</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/info/oyster-festival"
            className="bg-gradient-to-br from-coral-light to-rose-100 rounded-xl p-4 border border-coral/20 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-10">
              <PartyPopper className="w-full h-full text-coral" />
            </div>
            <div className="relative">
              <span className="inline-block px-2 py-0.5 bg-coral text-white text-[10px] font-bold rounded-full mb-2">JULY</span>
              <p className="font-bold text-ink text-sm group-hover:text-coral transition-colors">oyster festival</p>
              <p className="text-xs text-coral-dark/70 mt-0.5">the big one</p>
            </div>
          </Link>

          <Link
            href="/info/carnival"
            className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-xl p-4 border border-pink-200/50 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-10">
              <Music className="w-full h-full text-pink-500" />
            </div>
            <div className="relative">
              <span className="inline-block px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full mb-2">AUG</span>
              <p className="font-bold text-ink text-sm group-hover:text-pink-600 transition-colors">carnival</p>
              <p className="text-xs text-pink-700/60 mt-0.5">parade & party</p>
            </div>
          </Link>
        </div>

        {/* Practical stuff */}
        <h2 className="text-xs font-bold text-grey uppercase tracking-wider mb-3 px-1">good to know</h2>
        <div className="bg-white rounded-2xl border border-oyster-100 divide-y divide-oyster-100 overflow-hidden mb-6">
          <Link href="/info/emergency-contacts" className="flex items-center gap-3 p-3.5 hover:bg-red-50/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-red-600 transition-colors">emergency numbers</p>
              <p className="text-xs text-grey">coast guard, police, NHS</p>
            </div>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">24/7</span>
          </Link>

          <Link href="/info/healthcare" className="flex items-center gap-3 p-3.5 hover:bg-teal-50/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-teal-600 transition-colors">doctors & dentists</p>
              <p className="text-xs text-grey">GPs, pharmacies, vets too</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>

          <Link href="/info/council-contacts" className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-slate-600 transition-colors">council stuff</p>
              <p className="text-xs text-grey">Canterbury City Council</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>

          <Link href="/info/school-term-dates" className="flex items-center gap-3 p-3.5 hover:bg-indigo-50/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-indigo-600 transition-colors">school term dates</p>
              <p className="text-xs text-grey">Kent school calendar</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>
        </div>

        {/* Friendly sign-off with seagull */}
        <div className="flex items-end gap-3 px-2">
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src="/brand/seagull-wave.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-grey italic pb-2">
            missing something? let us know what&apos;d be useful
          </p>
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
