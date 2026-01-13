'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertTriangle, Camera, Calendar, Award } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { PhotoSubmitForm } from '@/components/photos';
import { createClient } from '@/lib/supabase/client';
import type { PhotoCompetition, Shop } from '@/types/database';

export default function PhotoSubmitPage() {
  const router = useRouter();
  const [competition, setCompetition] = useState<PhotoCompetition | null>(null);
  const [shops, setShops] = useState<Pick<Shop, 'id' | 'name'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        // Redirect to login if not authenticated
        if (!user) {
          router.push('/login?redirect=/photos/submit');
          return;
        }

        // Fetch current competition
        const { data: competitionData } = await supabase
          .from('photo_competitions')
          .select('*')
          .eq('status', 'submissions')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setCompetition(competitionData);

        // Fetch shops for tagging
        const { data: shopsData } = await supabase
          .from('shops')
          .select('id, name')
          .eq('status', 'approved')
          .order('name', { ascending: true });

        setShops(shopsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // Get current competition month
  const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-oyster-200 rounded" />
          <div className="h-6 w-48 bg-oyster-200 rounded" />
          <div className="h-64 bg-oyster-200 rounded" />
          <div className="h-10 bg-oyster-200 rounded" />
          <div className="h-10 bg-oyster-200 rounded" />
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/photos">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Gallery
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-oyster-900 mb-2">Submit a Photo</h1>
        <p className="text-oyster-600">
          Share your best Whitstable shots and enter the monthly competition
        </p>
      </div>

      {/* Competition Info */}
      {competition ? (
        <Card className="mb-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border-ocean-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-ocean-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <Badge variant="success" size="sm" className="mb-2">
                Submissions Open
              </Badge>
              <h2 className="font-semibold text-oyster-900">{competition.title}</h2>
              {competition.theme && (
                <p className="text-sm text-oyster-600 mt-1">Theme: {competition.theme}</p>
              )}
              {competition.prize_description && (
                <div className="flex items-center gap-2 mt-2 text-sm text-ocean-700">
                  <Award className="h-4 w-4" />
                  <span>{competition.prize_description}</span>
                </div>
              )}
              {competition.submissions_close && (
                <div className="flex items-center gap-2 mt-2 text-sm text-oyster-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Submit by {new Date(competition.submissions_close).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">No Active Competition</p>
              <p className="text-sm text-amber-700 mt-1">
                There&apos;s no competition running right now, but you can still submit photos to the gallery.
                They&apos;ll be entered into the next competition automatically.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Competition Rules */}
      <Card className="mb-8">
        <h3 className="font-semibold text-oyster-900 mb-3">Photo Guidelines</h3>
        <ul className="space-y-2 text-sm text-oyster-600">
          <li className="flex items-start gap-2">
            <span className="text-ocean-500 mt-0.5">•</span>
            Photos must be taken in Whitstable or the surrounding area
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ocean-500 mt-0.5">•</span>
            You must own the copyright to the photo
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ocean-500 mt-0.5">•</span>
            Basic editing is allowed, but no heavy manipulation
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ocean-500 mt-0.5">•</span>
            Maximum file size: 10MB (JPEG or PNG)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ocean-500 mt-0.5">•</span>
            One submission per person per competition
          </li>
        </ul>
      </Card>

      {/* Submit Form */}
      <PhotoSubmitForm
        shops={shops}
        competitionMonth={competition?.month || currentMonth}
      />
    </div>
  );
}
