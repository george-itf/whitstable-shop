'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2, Waves, PartyPopper, Music, Car, Sun, Phone, Building, Calendar, Stethoscope, ChevronRight } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';

// Info categories with rich visual styling
const infoCategories = [
  {
    id: 'essentials',
    title: 'Essentials',
    items: [
      {
        id: '1',
        title: 'Bin Collection Days',
        slug: 'bin-collection',
        description: 'When your bins get collected',
        icon: Trash2,
        color: 'bg-emerald-500',
        lightColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
      },
      {
        id: '2',
        title: 'Tide Times',
        slug: 'tide-times',
        description: 'High & low tide schedules',
        icon: Waves,
        color: 'bg-sky',
        lightColor: 'bg-sky-light',
        textColor: 'text-sky',
      },
      {
        id: '5',
        title: 'Parking',
        slug: 'parking',
        description: 'Where to park & costs',
        icon: Car,
        color: 'bg-violet-500',
        lightColor: 'bg-violet-50',
        textColor: 'text-violet-600',
      },
      {
        id: '6',
        title: 'Beach Info',
        slug: 'beach-info',
        description: 'Safety, facilities & rules',
        icon: Sun,
        color: 'bg-amber-500',
        lightColor: 'bg-amber-50',
        textColor: 'text-amber-600',
      },
    ],
  },
  {
    id: 'events',
    title: 'Annual Events',
    items: [
      {
        id: '3',
        title: 'Oyster Festival',
        slug: 'oyster-festival',
        description: 'July celebration of oysters',
        icon: PartyPopper,
        color: 'bg-coral',
        lightColor: 'bg-coral-light',
        textColor: 'text-coral',
        badge: 'July 2026',
      },
      {
        id: '4',
        title: 'Carnival',
        slug: 'carnival',
        description: 'Summer parade & festivities',
        icon: Music,
        color: 'bg-pink-500',
        lightColor: 'bg-pink-50',
        textColor: 'text-pink-600',
        badge: 'August',
      },
    ],
  },
  {
    id: 'contacts',
    title: 'Useful Contacts',
    items: [
      {
        id: '7',
        title: 'Emergency Contacts',
        slug: 'emergency-contacts',
        description: 'Police, fire, ambulance, coast guard',
        icon: Phone,
        color: 'bg-red-500',
        lightColor: 'bg-red-50',
        textColor: 'text-red-600',
        urgent: true,
      },
      {
        id: '8',
        title: 'Council Contacts',
        slug: 'council-contacts',
        description: 'Canterbury City Council services',
        icon: Building,
        color: 'bg-slate-500',
        lightColor: 'bg-slate-50',
        textColor: 'text-slate-600',
      },
      {
        id: '10',
        title: 'Healthcare',
        slug: 'healthcare',
        description: 'Doctors, dentists & vets',
        icon: Stethoscope,
        color: 'bg-teal-500',
        lightColor: 'bg-teal-50',
        textColor: 'text-teal-600',
      },
    ],
  },
  {
    id: 'families',
    title: 'For Families',
    items: [
      {
        id: '9',
        title: 'School Term Dates',
        slug: 'school-term-dates',
        description: 'Kent school calendar',
        icon: Calendar,
        color: 'bg-indigo-500',
        lightColor: 'bg-indigo-50',
        textColor: 'text-indigo-600',
      },
    ],
  },
];

export default function InfoPage() {
  return (
    <MobileWrapper>
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-sky to-sky-600 px-4 py-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-white font-bold text-xl">Local Info</h1>
        </div>
        <p className="text-white/80 text-sm">
          Everything you need to know about Whitstable — from tide times to bin days, and all the local essentials.
        </p>
      </div>

      {/* Content with negative margin overlap */}
      <div className="px-4 -mt-4 pb-24">
        {infoCategories.map((category) => (
          <div key={category.id} className="mb-6">
            <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-3 px-1">
              {category.title}
            </h2>

            <div className="space-y-3">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={`/info/${item.slug}`}
                    className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-grey-light/50"
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Icon with color background */}
                      <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-ink group-hover:text-sky transition-colors">
                            {item.title}
                          </h3>
                          {'badge' in item && item.badge && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.lightColor} ${item.textColor}`}>
                              {item.badge}
                            </span>
                          )}
                          {'urgent' in item && item.urgent && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                              24/7
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-grey mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-grey-light group-hover:text-sky group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick tip card */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Quick Tip</h3>
              <p className="text-amber-800 text-sm mt-1">
                Bookmark this page for quick access to local essentials when you&apos;re out and about in Whitstable!
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
