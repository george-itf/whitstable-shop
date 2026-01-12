'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ChevronLeft, Mail, Smartphone } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

interface NotificationPreferences {
  weekly_digest: boolean;
  new_reviews_on_saved: boolean;
  competition_reminders: boolean;
  event_reminders: boolean;
  push_enabled: boolean;
}

interface ToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-oyster-100 last:border-0">
      <div>
        <label htmlFor={id} className="font-medium text-oyster-900 cursor-pointer">
          {label}
        </label>
        <p className="text-sm text-oyster-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-ocean-600' : 'bg-oyster-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    weekly_digest: true,
    new_reviews_on_saved: true,
    competition_reminders: true,
    event_reminders: false,
    push_enabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const supabase = createClient();

        // Check authentication
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login?redirect=/settings/notifications');
          return;
        }

        // Fetch notification preferences from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('notification_preferences')
          .eq('id', user.id)
          .single();

        if (profile?.notification_preferences) {
          setPreferences((prev) => ({
            ...prev,
            ...profile.notification_preferences,
          }));
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreferences();
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('profiles')
          .update({ notification_preferences: preferences })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/settings/profile">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Profile
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-oyster-200 rounded-xl" />
            <div>
              <div className="h-8 bg-oyster-200 rounded w-36 mb-2" />
              <div className="h-4 bg-oyster-200 rounded w-48" />
            </div>
          </div>
          <Card className="mb-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-oyster-200 rounded" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/settings/profile">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center">
          <Bell className="h-6 w-6 text-ocean-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Notifications</h1>
          <p className="text-oyster-600">Choose what you want to hear about</p>
        </div>
      </div>

      {/* Email Notifications */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-ocean-600" />
          <h2 className="font-semibold text-oyster-900">Email Notifications</h2>
        </div>

        <Toggle
          id="weekly_digest"
          label="Weekly Digest"
          description="Get a summary of what's new in Whitstable every Friday"
          checked={preferences.weekly_digest}
          onChange={(checked) => updatePreference('weekly_digest', checked)}
        />

        <Toggle
          id="new_reviews_on_saved"
          label="New Reviews on Saved Shops"
          description="Get notified when someone reviews a shop you've saved"
          checked={preferences.new_reviews_on_saved}
          onChange={(checked) => updatePreference('new_reviews_on_saved', checked)}
        />

        <Toggle
          id="competition_reminders"
          label="Photo Competition Updates"
          description="Reminders about submission deadlines and voting periods"
          checked={preferences.competition_reminders}
          onChange={(checked) => updatePreference('competition_reminders', checked)}
        />

        <Toggle
          id="event_reminders"
          label="Event Reminders"
          description="Get notified about upcoming events you're interested in"
          checked={preferences.event_reminders}
          onChange={(checked) => updatePreference('event_reminders', checked)}
        />
      </Card>

      {/* Push Notifications */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-ocean-600" />
          <h2 className="font-semibold text-oyster-900">Push Notifications</h2>
        </div>

        <Toggle
          id="push_enabled"
          label="Enable Push Notifications"
          description="Receive notifications directly on your device (coming soon)"
          checked={preferences.push_enabled}
          onChange={(checked) => updatePreference('push_enabled', checked)}
        />

        <p className="text-sm text-oyster-500 mt-4">
          Push notifications require adding whitstable.shop to your home screen as a Progressive
          Web App (PWA).
        </p>
      </Card>

      {/* Sample Digest */}
      <Card className="bg-ocean-50 border-ocean-200">
        <h3 className="font-semibold text-oyster-900 mb-2">What&apos;s in the Weekly Digest?</h3>
        <ul className="text-sm text-oyster-600 space-y-1">
          <li>• New shops opening in Whitstable</li>
          <li>• Trending shops this week</li>
          <li>• Photo competition updates</li>
          <li>• Upcoming events and activities</li>
          <li>• Weekend tide times</li>
        </ul>
      </Card>

      {/* Save Button */}
      <div className="mt-8">
        <Button className="w-full" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
