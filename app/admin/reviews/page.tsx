'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Mock flagged reviews
const mockFlaggedReviews = [
  {
    id: '100',
    shopName: 'The Forge',
    authorName: 'Anonymous',
    authorPostcode: 'XX1 1XX',
    rating: 1,
    comment: 'Terrible experience, would not recommend to anyone!!!',
    flagReason: 'Suspicious postcode',
    createdAt: '2025-01-10',
  },
  {
    id: '101',
    shopName: 'Wheelers Oyster Bar',
    authorName: 'John',
    authorPostcode: 'CT5 1AA',
    rating: 5,
    comment: 'Best place ever! Check out my website at spam.com for more reviews',
    flagReason: 'Contains URL',
    createdAt: '2025-01-09',
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockFlaggedReviews);

  const handleApprove = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

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
            <p className="text-grey">All caught up! No flagged reviews.</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-ink">{review.shopName}</h3>
                  <p className="text-xs text-grey">
                    By {review.authorName} ({review.authorPostcode})
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

              <div className="bg-coral-light text-coral text-xs px-2 py-1 rounded inline-block mb-4">
                Flag: {review.flagReason}
              </div>

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
