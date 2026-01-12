import Link from "next/link";
import { User, Camera, Shield, Award, ChevronLeft } from "lucide-react";
import { Button, Card, Input, Textarea, Badge, Avatar } from "@/components/ui";
import { USER_BADGES } from "@/types/database";

export const metadata = {
  title: "Profile Settings",
  description: "Manage your whitstable.shop profile",
};

// Mock user data
const mockUser = {
  id: "user1",
  email: "user@example.com",
  display_name: "Local Explorer",
  bio: "Whitstable local since 2018. Love discovering new cafes and walking on the beach.",
  avatar_url: null,
  is_public: true,
  is_local: true,
  joined_at: "2024-03-15T00:00:00Z",
};

const mockContributions = {
  user_id: "user1",
  reports_submitted: 8,
  reports_helpful: 5,
  reviews_written: 12,
  photos_submitted: 6,
  photos_approved: 5,
  photos_won: 0,
  questions_answered: 15,
  answers_accepted: 3,
  contribution_score: 185,
  badge: "regular" as const,
};

export default function ProfileSettingsPage() {
  const badgeInfo = USER_BADGES[mockContributions.badge];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center">
          <User className="h-6 w-6 text-ocean-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-oyster-900">Profile Settings</h1>
          <p className="text-oyster-600">
            Manage your public profile
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={mockUser.avatar_url}
              fallback={mockUser.display_name}
              size="xl"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-ocean-600 text-white rounded-full flex items-center justify-center hover:bg-ocean-700 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Badges */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="info" className="text-sm">
                <Award className="h-3 w-3 mr-1" />
                {badgeInfo.label}
              </Badge>
              {mockUser.is_local && (
                <Badge variant="success" className="text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Local
                </Badge>
              )}
            </div>
            <p className="text-sm text-oyster-500">
              Member since March 2024 • {mockContributions.contribution_score} contribution points
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <Input
            label="Display Name"
            defaultValue={mockUser.display_name}
            placeholder="How you'll appear to others"
          />

          <Input
            label="Email"
            type="email"
            defaultValue={mockUser.email}
            disabled
            helperText="Contact support to change your email"
          />

          <Textarea
            label="Bio"
            defaultValue={mockUser.bio || ''}
            placeholder="Tell others a bit about yourself..."
            rows={3}
          />

          <div className="flex items-center gap-3 py-4 border-t border-oyster-100">
            <input
              type="checkbox"
              id="isPublic"
              defaultChecked={mockUser.is_public}
              className="h-4 w-4 rounded border-oyster-300 text-ocean-600 focus:ring-ocean-500"
            />
            <label htmlFor="isPublic" className="text-sm">
              <span className="font-medium text-oyster-900">Public profile</span>
              <p className="text-oyster-500">
                Allow others to see your profile, reviews, and photos
              </p>
            </label>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </Card>

      {/* Contribution Stats */}
      <Card>
        <h2 className="font-semibold text-oyster-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Your Contributions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-oyster-50 rounded-xl">
            <p className="text-2xl font-bold text-oyster-900">
              {mockContributions.reviews_written}
            </p>
            <p className="text-sm text-oyster-500">Reviews</p>
          </div>
          <div className="text-center p-4 bg-oyster-50 rounded-xl">
            <p className="text-2xl font-bold text-oyster-900">
              {mockContributions.photos_approved}
            </p>
            <p className="text-sm text-oyster-500">Photos</p>
          </div>
          <div className="text-center p-4 bg-oyster-50 rounded-xl">
            <p className="text-2xl font-bold text-oyster-900">
              {mockContributions.questions_answered}
            </p>
            <p className="text-sm text-oyster-500">Answers</p>
          </div>
          <div className="text-center p-4 bg-oyster-50 rounded-xl">
            <p className="text-2xl font-bold text-oyster-900">
              {mockContributions.reports_submitted}
            </p>
            <p className="text-sm text-oyster-500">Reports</p>
          </div>
          <div className="text-center p-4 bg-oyster-50 rounded-xl">
            <p className="text-2xl font-bold text-oyster-900">
              {mockContributions.reports_helpful}
            </p>
            <p className="text-sm text-oyster-500">Helpful</p>
          </div>
          <div className="text-center p-4 bg-ocean-50 rounded-xl">
            <p className="text-2xl font-bold text-ocean-600">
              {mockContributions.contribution_score}
            </p>
            <p className="text-sm text-ocean-700">Total Points</p>
          </div>
        </div>

        {/* Badge Progress */}
        <div className="border-t border-oyster-100 pt-4">
          <p className="text-sm text-oyster-600 mb-2">
            Next badge: <strong>Local Expert</strong> (250 points)
          </p>
          <div className="w-full bg-oyster-200 rounded-full h-2">
            <div
              className="bg-ocean-500 h-2 rounded-full transition-all"
              style={{ width: `${(mockContributions.contribution_score / 250) * 100}%` }}
            />
          </div>
          <p className="text-xs text-oyster-500 mt-1">
            {250 - mockContributions.contribution_score} points to go
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex gap-4">
        <Link href="/settings/notifications" className="flex-1">
          <Button variant="outline" className="w-full">
            Notification Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}
