import Link from "next/link";
import { Bell, ChevronLeft, Mail, Smartphone } from "lucide-react";
import { Button, Card } from "@/components/ui";

export const metadata = {
  title: "Notification Settings",
  description: "Manage your notification preferences",
};

// Mock notification preferences
const mockPreferences = {
  weekly_digest: true,
  new_reviews_on_saved: true,
  competition_reminders: true,
  event_reminders: false,
  push_enabled: false,
};

interface ToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

function Toggle({ id, label, description, checked }: ToggleProps) {
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
          <p className="text-oyster-600">
            Choose what you want to hear about
          </p>
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
          checked={mockPreferences.weekly_digest}
        />

        <Toggle
          id="new_reviews_on_saved"
          label="New Reviews on Saved Shops"
          description="Get notified when someone reviews a shop you've saved"
          checked={mockPreferences.new_reviews_on_saved}
        />

        <Toggle
          id="competition_reminders"
          label="Photo Competition Updates"
          description="Reminders about submission deadlines and voting periods"
          checked={mockPreferences.competition_reminders}
        />

        <Toggle
          id="event_reminders"
          label="Event Reminders"
          description="Get notified about upcoming events you're interested in"
          checked={mockPreferences.event_reminders}
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
          checked={mockPreferences.push_enabled}
        />

        <p className="text-sm text-oyster-500 mt-4">
          Push notifications require adding whitstable.shop to your home screen
          as a Progressive Web App (PWA).
        </p>
      </Card>

      {/* Sample Digest */}
      <Card className="bg-ocean-50 border-ocean-200">
        <h3 className="font-semibold text-oyster-900 mb-2">
          What&apos;s in the Weekly Digest?
        </h3>
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
        <Button className="w-full">Save Preferences</Button>
      </div>
    </div>
  );
}
