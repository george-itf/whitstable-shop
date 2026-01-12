'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Camera, Shield, Award, ChevronLeft } from 'lucide-react';
import { Button, Card, Input, Textarea, Badge, Avatar } from '@/components/ui';
import { USER_BADGES } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  is_local: boolean;
  created_at: string;
}

interface UserContributions {
  reports_submitted: number;
  reports_helpful: number;
  reviews_written: number;
  photos_submitted: number;
  photos_approved: number;
  photos_won: number;
  questions_answered: number;
  answers_accepted: number;
  contribution_score: number;
  badge: 'newcomer' | 'regular' | 'expert' | 'local_legend';
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [contributions, setContributions] = useState<UserContributions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    is_public: true,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient();

        // Check authentication
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login?redirect=/settings/profile');
          return;
        }

        // Fetch profile
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data.profile);
          setContributions(data.contributions);
          setFormData({
            display_name: data.profile.display_name || '',
            bio: data.profile.bio || '',
            is_public: data.profile.is_public ?? true,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-oyster-200 rounded-xl" />
            <div>
              <div className="h-8 bg-oyster-200 rounded w-48 mb-2" />
              <div className="h-4 bg-oyster-200 rounded w-32" />
            </div>
          </div>
          <Card className="mb-8">
            <div className="h-64 bg-oyster-200 rounded" />
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-oyster-600 mb-4">Please sign in to view your profile</p>
        <Link href="/login?redirect=/settings/profile">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const badgeInfo = contributions
    ? USER_BADGES[contributions.badge]
    : USER_BADGES['newcomer'];

  const memberSince = new Date(user.created_at).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const nextBadgeThreshold = 250;
  const currentScore = contributions?.contribution_score || 0;

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
          <p className="text-oyster-600">Manage your public profile</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar src={user.avatar_url} fallback={user.display_name || 'User'} size="xl" />
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
              {user.is_local && (
                <Badge variant="success" className="text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Local
                </Badge>
              )}
            </div>
            <p className="text-sm text-oyster-500">
              Member since {memberSince} • {currentScore} contribution points
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display Name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="How you'll appear to others"
          />

          <Input
            label="Email"
            type="email"
            value={user.email}
            disabled
            helperText="Contact support to change your email"
          />

          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell others a bit about yourself..."
            rows={3}
          />

          <div className="flex items-center gap-3 py-4 border-t border-oyster-100">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="h-4 w-4 rounded border-oyster-300 text-ocean-600 focus:ring-ocean-500"
            />
            <label htmlFor="isPublic" className="text-sm">
              <span className="font-medium text-oyster-900">Public profile</span>
              <p className="text-oyster-500">
                Allow others to see your profile, reviews, and photos
              </p>
            </label>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>

      {/* Contribution Stats */}
      {contributions && (
        <Card>
          <h2 className="font-semibold text-oyster-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Your Contributions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-oyster-50 rounded-xl">
              <p className="text-2xl font-bold text-oyster-900">
                {contributions.reviews_written}
              </p>
              <p className="text-sm text-oyster-500">Reviews</p>
            </div>
            <div className="text-center p-4 bg-oyster-50 rounded-xl">
              <p className="text-2xl font-bold text-oyster-900">
                {contributions.photos_approved}
              </p>
              <p className="text-sm text-oyster-500">Photos</p>
            </div>
            <div className="text-center p-4 bg-oyster-50 rounded-xl">
              <p className="text-2xl font-bold text-oyster-900">
                {contributions.questions_answered}
              </p>
              <p className="text-sm text-oyster-500">Answers</p>
            </div>
            <div className="text-center p-4 bg-oyster-50 rounded-xl">
              <p className="text-2xl font-bold text-oyster-900">
                {contributions.reports_submitted}
              </p>
              <p className="text-sm text-oyster-500">Reports</p>
            </div>
            <div className="text-center p-4 bg-oyster-50 rounded-xl">
              <p className="text-2xl font-bold text-oyster-900">
                {contributions.reports_helpful}
              </p>
              <p className="text-sm text-oyster-500">Helpful</p>
            </div>
            <div className="text-center p-4 bg-ocean-50 rounded-xl">
              <p className="text-2xl font-bold text-ocean-600">
                {contributions.contribution_score}
              </p>
              <p className="text-sm text-ocean-700">Total Points</p>
            </div>
          </div>

          {/* Badge Progress */}
          <div className="border-t border-oyster-100 pt-4">
            <p className="text-sm text-oyster-600 mb-2">
              Next badge: <strong>Local Expert</strong> ({nextBadgeThreshold} points)
            </p>
            <div className="w-full bg-oyster-200 rounded-full h-2">
              <div
                className="bg-ocean-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((currentScore / nextBadgeThreshold) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-oyster-500 mt-1">
              {Math.max(nextBadgeThreshold - currentScore, 0)} points to go
            </p>
          </div>
        </Card>
      )}

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
