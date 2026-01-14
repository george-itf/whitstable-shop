'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

interface PendingReview {
  id: string;
  shop: { name: string } | null;
  author_name: string;
  author_postcode: string;
  rating: number;
  comment: string;
  flag_reason: string | null;
  created_at: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchPendingReviews() {
      try {
        const supabase = createClient();

        // Check authentication and admin role
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login?redirect=/admin/reviews');
          return;
        }

        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAdmin(true);

        // Fetch pending reviews
        const { data: pendingReviews } = await supabase
          .from('reviews')
          .select('id, author_name, author_postcode, rating, comment, flag_reason, created_at, shop:shops(name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        // Transform data to handle Supabase's join return type
        const transformedReviews = (pendingReviews || []).map((review: PendingReview & { shop: { name: string } | { name: string }[] | null }) => ({
          ...review,
          shop: Array.isArray(review.shop) ? review.shop[0] : review.shop,
        }));

        setReviews(transformedReviews);
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPendingReviews();
  }, [router]);

  const handleApprove = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id);

      if (!error) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (!error) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">moderate reviews</h1>
          </div>
        </div>
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-5 bg-grey-light rounded w-1/2 mb-2" />
              <div className="h-16 bg-grey-light rounded w-full mb-4" />
              <div className="flex gap-3">
                <div className="h-8 bg-grey-light rounded flex-1" />
                <div className="h-8 bg-grey-light rounded flex-1" />
              </div>
            </Card>
          ))}
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  if (isAdmin === false) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">moderate reviews</h1>
          </div>
        </div>
        <div className="px-4 py-6 text-center py-12">
          <p className="text-grey">You don&apos;t have permission to view this page.</p>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-coral px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">moderate reviews</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {reviews.length === 0 ? (
          <Card className="text-center py-8">
            <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-grey">All caught up! No pending reviews.</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-ink">{review.shop?.name || 'Unknown Shop'}</h3>
                  <p className="text-xs text-grey">
                    By {review.author_name} ({review.author_postcode})
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={star <= review.rating ? '#f5a623' : 'none'}
                      stroke={star <= review.rating ? '#f5a623' : '#e5e7eb'}
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="text-sm text-grey-dark mb-3">&ldquo;{review.comment}&rdquo;</p>

              {review.flag_reason && (
                <div className="bg-coral-light text-coral text-xs px-2 py-1 rounded inline-block mb-4">
                  Flag: {review.flag_reason}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleApprove(review.id)}
                >
                  approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleReject(review.id)}
                >
                  delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
