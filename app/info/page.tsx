'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Waves, PartyPopper, Music, Car, Sun, Phone, Building, Calendar, Stethoscope, ChevronRight, ArrowLeft } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';

export default function InfoPage() {
  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 pt-4 pb-6">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          back
        </Link>
        <h1 className="text-white font-bold text-2xl">local info</h1>
      </div>

      <div className="px-4 py-5 pb-24 -mt-2">
        {/* Quick access - tides and bins */}
        <div className="bg-white rounded-2xl shadow-sm border border-oyster-100 overflow-hidden mb-5">
          <div className="grid grid-cols-2 divide-x divide-oyster-100">
            <Link href="/info/tide-times" className="p-4 hover:bg-oyster-50 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-sky flex items-center justify-center mb-2">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-ink text-sm group-hover:text-sky transition-colors">tide times</p>
              <p className="text-xs text-grey mt-0.5">harbour & tankerton</p>
            </Link>

            <Link href="/info/bin-collection" className="p-4 hover:bg-oyster-50 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center mb-2">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-ink text-sm group-hover:text-emerald-600 transition-colors">bin collection</p>
              <p className="text-xs text-grey mt-0.5">check your day</p>
            </Link>
          </div>
        </div>

        {/* Beaches & parking */}
        <div className="space-y-2 mb-5">
          <Link
            href="/info/beach-info"
            className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-oyster-100 hover:border-oyster-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-amber-600 transition-colors">beaches</p>
              <p className="text-xs text-grey">west beach, tankerton, long beach</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>

          <Link
            href="/info/parking"
            className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-oyster-100 hover:border-oyster-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-violet-600 transition-colors">parking</p>
              <p className="text-xs text-grey">gorrell tank, harbour, slopes</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>
        </div>

        {/* Annual events */}
        <h2 className="text-xs font-semibold text-grey uppercase tracking-wider mb-2 px-1">annual events</h2>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <Link
            href="/info/oyster-festival"
            className="bg-coral-light/50 rounded-xl p-3.5 border border-coral/10 hover:border-coral/30 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <PartyPopper className="w-4 h-4 text-coral" />
              <span className="text-[10px] font-semibold text-coral uppercase">July</span>
            </div>
            <p className="font-semibold text-ink text-sm group-hover:text-coral transition-colors">oyster festival</p>
          </Link>

          <Link
            href="/info/carnival"
            className="bg-pink-50 rounded-xl p-3.5 border border-pink-100 hover:border-pink-200 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Music className="w-4 h-4 text-pink-500" />
              <span className="text-[10px] font-semibold text-pink-500 uppercase">August</span>
            </div>
            <p className="font-semibold text-ink text-sm group-hover:text-pink-600 transition-colors">carnival</p>
          </Link>
        </div>

        {/* Contacts & services */}
        <h2 className="text-xs font-semibold text-grey uppercase tracking-wider mb-2 px-1">contacts</h2>
        <div className="bg-white rounded-2xl border border-oyster-100 divide-y divide-oyster-100 overflow-hidden mb-5">
          <Link href="/info/emergency-contacts" className="flex items-center gap-3 p-3.5 hover:bg-oyster-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-red-600 transition-colors">emergency</p>
              <p className="text-xs text-grey">999, coast guard, NHS 111</p>
            </div>
          </Link>

          <Link href="/info/healthcare" className="flex items-center gap-3 p-3.5 hover:bg-oyster-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-teal-600 transition-colors">healthcare</p>
              <p className="text-xs text-grey">GPs, dentists, pharmacies, vets</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>

          <Link href="/info/council-contacts" className="flex items-center gap-3 p-3.5 hover:bg-oyster-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-slate-600 transition-colors">council</p>
              <p className="text-xs text-grey">Canterbury City Council</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>

          <Link href="/info/school-term-dates" className="flex items-center gap-3 p-3.5 hover:bg-oyster-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm group-hover:text-indigo-600 transition-colors">school terms</p>
              <p className="text-xs text-grey">Kent 2024-25 dates</p>
            </div>
            <ChevronRight className="w-4 h-4 text-oyster-300" />
          </Link>
        </div>

        {/* Seagull */}
        <div className="flex justify-center pt-2">
          <div className="w-14 h-14 relative opacity-40">
            <Image
              src="/brand/seagull-wave.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
