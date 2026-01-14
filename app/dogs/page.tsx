'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Dog,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Calendar,
  Footprints,
  Waves,
} from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Badge, Button } from '@/components/ui';

interface WalkSchedule {
  id: string;
  day_of_week: number;
  time_slot: string;
  max_participants: number;
  attendee_count?: number;
}

interface WalkRoute {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_point: string;
  distance_km: number;
  estimated_duration_mins: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  terrain: string[];
  features: string[];
  image_url?: string;
  schedules: WalkSchedule[];
}

// Day names
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Format time from 24h to 12h
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}${period}`;
}

// Get the next 7 days
function getNextDays(count: number = 7): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

// Format date for API
function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Difficulty colors
const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-100 text-emerald-700',
  moderate: 'bg-amber-100 text-amber-700',
  challenging: 'bg-red-100 text-red-700',
};

// Feature icons
const FEATURE_ICONS: Record<string, typeof Waves> = {
  water_access: Waves,
  off_lead_area: Dog,
  // Default to Footprints for unknown features
};

export default function DogsPage() {
  const [routes, setRoutes] = useState<WalkRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const days = getNextDays(7);

  // Fetch routes and schedules for selected date
  useEffect(() => {
    async function fetchRoutes() {
      setIsLoading(true);
      try {
        const dateStr = formatDateForApi(selectedDate);
        const res = await fetch(`/api/dog-walks?date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          setRoutes(data);
        }
      } catch (error) {
        console.error('Failed to fetch routes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [selectedDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-4 py-6 pb-20">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Dog className="w-6 h-6 text-white" />
            <h1 className="text-white font-bold text-xl">Dog Walks</h1>
          </div>
        </div>
        <p className="text-white/90 text-sm">
          Find walking buddies for your pup! Join group walks around Whitstable&apos;s
          best dog-friendly routes.
        </p>
      </div>

      {/* Date selector */}
      <div className="px-4 -mt-14">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-grey" />
            <span className="text-sm font-medium text-grey">Select a day</span>
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {days.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center min-w-[52px] py-2 px-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-grey-light/50 text-ink hover:bg-grey-light'
                  }`}
                >
                  <span className="text-xs font-medium">
                    {isToday(date) ? 'Today' : DAY_NAMES[date.getDay()]}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <h2 className="text-sm font-bold text-grey-dark uppercase tracking-wide mb-4">
          Walks on {isToday(selectedDate) ? 'Today' : DAY_NAMES_FULL[selectedDate.getDay()]}
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-grey-light/50">
                <div className="h-6 bg-grey-light rounded w-3/4 mb-3 animate-pulse" />
                <div className="h-4 bg-grey-light rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-4 bg-grey-light rounded w-1/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dog className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-bold text-ink mb-2">No Walks Scheduled</h3>
            <p className="text-grey text-sm">
              There are no group walks scheduled for this day yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl shadow-sm border border-grey-light/50 overflow-hidden"
              >
                {/* Route header */}
                <div className="p-4 border-b border-grey-light/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-ink text-lg">{route.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-grey">
                        <MapPin className="w-4 h-4" />
                        <span>{route.start_point}</span>
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      size="sm"
                      className={DIFFICULTY_COLORS[route.difficulty]}
                    >
                      {route.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm text-grey mt-2 line-clamp-2">
                    {route.description}
                  </p>

                  {/* Route stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-grey">
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5" />
                      {route.distance_km} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      ~{route.estimated_duration_mins} min
                    </span>
                  </div>
                </div>

                {/* Time slots */}
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-grey-dark uppercase tracking-wide mb-3">
                    Available Times
                  </h4>

                  {route.schedules.length === 0 ? (
                    <p className="text-sm text-grey italic">No walks scheduled for this day</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {route.schedules.map((schedule) => (
                        <Link
                          key={schedule.id}
                          href={`/dogs/${route.slug}?date=${formatDateForApi(selectedDate)}&time=${schedule.id}`}
                          className="group flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
                        >
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-amber-700">
                            {formatTime(schedule.time_slot)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-amber-600/80">
                            <Users className="w-3 h-3" />
                            {schedule.attendee_count || 0}
                          </span>
                          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info card */}
        <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🐕</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">About Group Walks</h3>
              <p className="text-amber-800 text-sm mt-1">
                Join friendly locals and their dogs for social walks around Whitstable.
                Perfect for dogs who love making friends! All breeds and sizes welcome.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
