'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Dog,
  MapPin,
  Clock,
  Users,
  Footprints,
  Check,
  X,
  Waves,
  TreePine,
  Car,
  Coffee,
  AlertCircle,
} from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Badge, Button, Input, Textarea, Avatar } from '@/components/ui';

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
  end_point?: string;
  distance_km: number;
  estimated_duration_mins: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  terrain: string[];
  features: string[];
  image_url?: string;
  schedules: WalkSchedule[];
}

interface Attendee {
  id: string;
  dog_name?: string;
  dog_breed?: string;
  notes?: string;
  user?: {
    id: string;
    display_name?: string;
    avatar_url?: string;
  };
}

// Format time from 24h to 12h
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}${period}`;
}

// Difficulty colors
const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-100 text-emerald-700',
  moderate: 'bg-amber-100 text-amber-700',
  challenging: 'bg-red-100 text-red-700',
};

// Feature info
const FEATURE_INFO: Record<string, { icon: typeof Waves; label: string }> = {
  water_access: { icon: Waves, label: 'Water access' },
  off_lead_area: { icon: Dog, label: 'Off-lead area' },
  dog_friendly_cafe: { icon: Coffee, label: 'Dog-friendly café nearby' },
  parking: { icon: Car, label: 'Parking available' },
  sea_views: { icon: Waves, label: 'Sea views' },
  wildlife: { icon: TreePine, label: 'Wildlife spotting' },
  castle_grounds: { icon: TreePine, label: 'Castle grounds' },
  unique_terrain: { icon: Footprints, label: 'Unique terrain' },
};

// Terrain labels
const TERRAIN_LABELS: Record<string, string> = {
  beach: 'Beach',
  sand: 'Sandy',
  grass: 'Grassy',
  paved: 'Paved paths',
  shingle: 'Shingle',
  rocky: 'Rocky areas',
};

export default function WalkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const timeParam = searchParams.get('time'); // schedule ID

  const [route, setRoute] = useState<WalkRoute | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<WalkSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch route and attendees
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch route with schedules for this date
        const routeRes = await fetch(`/api/dog-walks?date=${dateParam}`);
        if (routeRes.ok) {
          const routes = await routeRes.json();
          const foundRoute = routes.find((r: WalkRoute) => r.slug === slug);
          if (foundRoute) {
            setRoute(foundRoute);

            // Select schedule from URL param or first available
            if (timeParam) {
              const schedule = foundRoute.schedules.find((s: WalkSchedule) => s.id === timeParam);
              setSelectedSchedule(schedule || foundRoute.schedules[0]);
            } else if (foundRoute.schedules.length > 0) {
              setSelectedSchedule(foundRoute.schedules[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch route:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug, dateParam, timeParam]);

  // Fetch attendees when schedule selected
  useEffect(() => {
    async function fetchAttendees() {
      if (!selectedSchedule) return;

      try {
        const res = await fetch(
          `/api/dog-walks/attend?schedule_id=${selectedSchedule.id}&date=${dateParam}`
        );
        if (res.ok) {
          const data = await res.json();
          setAttendees(data);

          // Check if current user is attending
          // This would need user ID check in a real app
          setIsAttending(false); // Simplified for now
        }
      } catch (err) {
        console.error('Failed to fetch attendees:', err);
      }
    }

    fetchAttendees();
  }, [selectedSchedule, dateParam]);

  const handleJoin = async () => {
    if (!selectedSchedule) return;

    setIsJoining(true);
    setError(null);

    try {
      const res = await fetch('/api/dog-walks/attend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_id: selectedSchedule.id,
          date: dateParam,
          dog_name: dogName || undefined,
          dog_breed: dogBreed || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to join walk');
      }

      setIsAttending(true);
      setShowJoinForm(false);

      // Refresh attendees
      const attendeesRes = await fetch(
        `/api/dog-walks/attend?schedule_id=${selectedSchedule.id}&date=${dateParam}`
      );
      if (attendeesRes.ok) {
        setAttendees(await attendeesRes.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!selectedSchedule) return;

    try {
      await fetch(
        `/api/dog-walks/attend?schedule_id=${selectedSchedule.id}&date=${dateParam}`,
        { method: 'DELETE' }
      );

      setIsAttending(false);

      // Refresh attendees
      const attendeesRes = await fetch(
        `/api/dog-walks/attend?schedule_id=${selectedSchedule.id}&date=${dateParam}`
      );
      if (attendeesRes.ok) {
        setAttendees(await attendeesRes.json());
      }
    } catch (err) {
      console.error('Failed to leave walk:', err);
    }
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="animate-pulse">
          <div className="h-48 bg-grey-light" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-grey-light rounded w-3/4" />
            <div className="h-4 bg-grey-light rounded w-1/2" />
            <div className="h-20 bg-grey-light rounded" />
          </div>
        </div>
      </MobileWrapper>
    );
  }

  if (!route) {
    return (
      <MobileWrapper>
        <div className="p-4">
          <Link href="/dogs" className="text-sky hover:underline">
            ← Back to walks
          </Link>
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-ink mb-2">Walk Not Found</h2>
            <p className="text-grey">This walking route doesn&apos;t exist.</p>
          </div>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  const selectedDate = new Date(dateParam);
  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <MobileWrapper>
      {/* Header image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-amber-400 to-orange-500">
        <Link
          href="/dogs"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </Link>

        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant="default" size="sm" className={DIFFICULTY_COLORS[route.difficulty]}>
            {route.difficulty}
          </Badge>
          <h1 className="text-white font-bold text-2xl mt-2 drop-shadow-sm">
            {route.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24 space-y-6">
        {/* Date & Time */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="text-sm font-medium text-amber-700 mb-1">{formattedDate}</div>

          {route.schedules.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {route.schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => setSelectedSchedule(schedule)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedSchedule?.id === schedule.id
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {formatTime(schedule.time_slot)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-amber-700 text-sm italic">No walks scheduled for this day</p>
          )}
        </div>

        {/* Route details */}
        <div>
          <h2 className="font-bold text-ink mb-3">About this walk</h2>
          <p className="text-grey text-sm leading-relaxed">{route.description}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-grey-light/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-grey text-sm mb-1">
                <MapPin className="w-4 h-4" />
                Start
              </div>
              <p className="font-medium text-ink text-sm">{route.start_point}</p>
            </div>
            <div className="bg-grey-light/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-grey text-sm mb-1">
                <Clock className="w-4 h-4" />
                Duration
              </div>
              <p className="font-medium text-ink text-sm">~{route.estimated_duration_mins} mins</p>
            </div>
            <div className="bg-grey-light/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-grey text-sm mb-1">
                <Footprints className="w-4 h-4" />
                Distance
              </div>
              <p className="font-medium text-ink text-sm">{route.distance_km} km</p>
            </div>
            <div className="bg-grey-light/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-grey text-sm mb-1">
                <Dog className="w-4 h-4" />
                Terrain
              </div>
              <p className="font-medium text-ink text-sm">
                {route.terrain.map((t) => TERRAIN_LABELS[t] || t).join(', ')}
              </p>
            </div>
          </div>

          {/* Features */}
          {route.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {route.features.map((feature) => {
                const info = FEATURE_INFO[feature];
                const Icon = info?.icon || Footprints;
                return (
                  <span
                    key={feature}
                    className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-full"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {info?.label || feature}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Who's going */}
        {selectedSchedule && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-ink">Who&apos;s going</h2>
              <span className="text-sm text-grey">
                {attendees.length}/{selectedSchedule.max_participants}
              </span>
            </div>

            {attendees.length === 0 ? (
              <div className="bg-grey-light/30 rounded-xl p-4 text-center">
                <Dog className="w-8 h-8 text-grey mx-auto mb-2" />
                <p className="text-grey text-sm">No one has joined yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="bg-white border border-grey-light/50 rounded-xl p-3 flex items-center gap-3"
                  >
                    <Avatar
                      src={attendee.user?.avatar_url}
                      alt={attendee.user?.display_name || 'Walker'}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm">
                        {attendee.user?.display_name || 'Anonymous'}
                        {attendee.dog_name && (
                          <span className="text-grey font-normal">
                            {' '}
                            with {attendee.dog_name}
                          </span>
                        )}
                      </p>
                      {attendee.dog_breed && (
                        <p className="text-xs text-grey">{attendee.dog_breed}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Join form */}
        {showJoinForm && selectedSchedule && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <h3 className="font-bold text-ink mb-4">Join this walk</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Input
                label="Dog's name (optional)"
                placeholder="e.g., Max"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
              />
              <Input
                label="Breed (optional)"
                placeholder="e.g., Labrador"
                value={dogBreed}
                onChange={(e) => setDogBreed(e.target.value)}
              />
              <Textarea
                label="Notes (optional)"
                placeholder="e.g., My dog is a bit shy at first"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowJoinForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                {isJoining ? 'Joining...' : "I'm Going!"}
              </Button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {selectedSchedule && !showJoinForm && (
          <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t border-grey-light">
            <div className="max-w-md mx-auto">
              {isAttending ? (
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">You&apos;re going!</span>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleLeave}
                    className="px-4"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowJoinForm(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 py-3"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join this walk
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
